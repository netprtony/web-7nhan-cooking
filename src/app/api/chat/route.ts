import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { loadAllDocuments } from '@/lib/rag/loader';
import { splitText, TextChunk } from '@/lib/rag/splitter';
import { getVectorStore } from '@/lib/rag/vectorstore';
import { SYSTEM_PROMPT, buildPrompt } from '@/lib/rag/prompt';

// OpenRouter client (sử dụng OpenAI SDK tương thích)
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

// Khởi tạo RAG pipeline (lazy initialization)
let isInitialized = false;

async function initializeRAG() {
  if (isInitialized) return;

  try {
    const docs = await loadAllDocuments();
    const allChunks: TextChunk[] = [];

    for (const doc of docs) {
      const chunks = splitText(doc.text, 500, 100, doc.source);
      allChunks.push(...chunks);
    }

    const store = getVectorStore();
    store.addChunks(allChunks);
    isInitialized = true;
    console.log(`[RAG] Initialized with ${allChunks.length} chunks from ${docs.length} documents.`);
  } catch (error) {
    console.error('[RAG] Failed to initialize:', error);
    throw error;
  }
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      history = [],
      model = 'qwen/qwen-2.5-72b-instruct',
    } = body as {
      message: string;
      history?: ChatMessage[];
      model?: string;
    };

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return Response.json(
        { error: 'Vui lòng nhập câu hỏi.' },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json(
        { error: 'OPENROUTER_API_KEY chưa được cấu hình.' },
        { status: 500 }
      );
    }

    // Khởi tạo RAG pipeline (chỉ chạy 1 lần)
    await initializeRAG();

    // Retrieval: tìm Top-5 context chunks phù hợp nhất từ tất cả tài liệu
    const store = getVectorStore();
    const relevantChunks = store.search(message.trim(), 5);

    // Xây dựng prompt với context
    const userPrompt = buildPrompt(relevantChunks, message.trim());

    // Chuẩn bị messages cho LLM
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Thêm lịch sử hội thoại (giới hạn 6 tin nhắn gần nhất)
    const recentHistory = history.slice(-6);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // Thêm câu hỏi hiện tại (kèm context)
    messages.push({ role: 'user', content: userPrompt });

    // Gọi OpenRouter API với model được chọn
    const selectedModel = model.trim() || 'qwen/qwen-2.5-72b-instruct';

    const completion = await openai.chat.completions.create({
      model: selectedModel,
      messages,
      stream: true,
      temperature: 0.3,
      max_tokens: 2000,
    });

    // Tạo ReadableStream để streaming response về client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('[RAG] Streaming error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'Đã xảy ra lỗi khi xử lý câu hỏi.' })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[RAG] API error:', error);
    return Response.json(
      { error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
