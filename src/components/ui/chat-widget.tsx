"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  ChevronDown,
  FileText,
  Download,
  Edit3,
  Cpu,
  Check,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { ContractPreviewModal } from "./contract-preview-modal";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIModelOption {
  id: string;
  name: string;
  badge?: string;
  provider?: string;
}

export const AVAILABLE_MODELS: AIModelOption[] = [
  {
    id: "nvidia/nemotron-3-ultra-550b-a55b:free",
    name: "NVIDIA Nemotron 3 Ultra 550B",
    badge: "FREE",
    provider: "NVIDIA",
  },
  {
    id: "google/gemma-4-31b-it:free",
    name: "Google Gemma 4 31B",
    badge: "FREE",
    provider: "Google",
  },
  {
    id: "z.ai/glm-4.5-air:free",
    name: "GLM 4.5 Air",
    badge: "FREE",
    provider: "Z.AI",
  },
  {
    id: "google/gemma-4-26b-a4b-it:free",
    name: "Google Gemma 4 26B A4B",
    badge: "FREE",
    provider: "Google",
  },
  {
    id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    name: "NVIDIA Nemotron 3 Nano Omni 30B",
    badge: "FREE",
    provider: "NVIDIA",
  },
];

const QUICK_PROMPTS = [
  "📄 Xem và review chi tiết hợp đồng đầu tư mẫu?",
  "Mô hình kinh doanh và điểm hòa vốn của AFTER HOURS?",
  "Chiến lược phân chia lợi nhuận 85% hoàn vốn ra sao?",
  "Kế hoạch sử dụng nguồn vốn 2.8 tỷ và thoái vốn?",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("nvidia/nemotron-3-ultra-550b-a55b:free");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Load saved model from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ah_chat_model");
    if (saved && AVAILABLE_MODELS.some((m) => m.id === saved)) {
      setSelectedModel(saved);
    }
  }, []);

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem("ah_chat_model", modelId);
    setIsModelDropdownOpen(false);
  };

  // Close model dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node)
      ) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Detect if user scrolled up
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 80;
    setShowScrollDown(!isAtBottom);
  }, []);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const messageText = (text || input).trim();
    if (!messageText || isStreaming) return;

    const userMessage: ChatMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    // Add empty assistant message for streaming
    const assistantMessage: ChatMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: messages,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Lỗi kết nối server.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("Không nhận được stream response.");

      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        const lines = textChunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: fullContent,
                  };
                  return updated;
                });
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } catch (error: any) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: `⚠️ ${error.message || "Đã xảy ra lỗi. Vui lòng thử lại hoặc chọn model AI khác."}`,
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Check if assistant message mentions contract keywords
  const isContractRelated = (text: string) => {
    const lower = text.toLowerCase();
    return (
      lower.includes("hợp đồng") ||
      lower.includes("hop_dong") ||
      lower.includes("điều 1") ||
      lower.includes("điều 2") ||
      lower.includes("điều 3") ||
      lower.includes("góp vốn") ||
      lower.includes("hoàn vốn")
    );
  };

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const currentModelInfo = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-amber-500/40 transition-shadow"
            aria-label="Mở trợ lý AI"
          >
            <MessageCircle className="w-6 h-6" />
            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-amber-500/30 animate-ping" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            data-prevent-hero-scroll="true"
            className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[440px] md:w-[480px] h-[640px] max-h-[88vh] flex flex-col rounded-2xl border border-neutral-700/60 bg-neutral-900/98 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden"
            style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-700/60 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-500/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-white leading-tight tracking-tight flex items-center gap-2">
                    Trợ Lý Đầu Tư AI
                  </h3>
                  <p className="text-xs text-neutral-400 tracking-wide">
                    AFTER HOURS – Modern Dining
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Nút Xem Hợp Đồng Mẫu */}
                <button
                  onClick={() => setIsContractModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold transition-colors"
                  title="Xem trước & chỉnh sửa hợp đồng"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Hợp Đồng</span>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                  aria-label="Đóng chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Model Selector Bar */}
            <div className="px-3.5 py-2 bg-neutral-950/90 border-b border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">Model AI:</span>
              </div>

              <div className="relative" ref={modelDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium transition-all"
                >
                  <span className="max-w-[170px] truncate">{currentModelInfo.name}</span>
                  {currentModelInfo.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      currentModelInfo.badge === "FREE"
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}>
                      {currentModelInfo.badge}
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isModelDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.96 }}
                      className="absolute right-0 top-full mt-1.5 z-50 w-72 rounded-xl bg-neutral-900 border border-neutral-700 shadow-xl shadow-black/60 p-1.5 space-y-1"
                    >
                      <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                        Chọn mô hình OpenRouter
                      </div>
                      {AVAILABLE_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => handleSelectModel(model.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                            selectedModel === model.id
                              ? "bg-amber-500/20 text-amber-300 font-semibold"
                              : "text-neutral-300 hover:bg-neutral-800"
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-white">{model.name}</span>
                            <span className="text-[10px] text-neutral-400">{model.provider}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {model.badge && (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                model.badge === "FREE"
                                  ? "bg-green-500/20 text-green-300"
                                  : "bg-amber-500/20 text-amber-300"
                              }`}>
                                {model.badge}
                              </span>
                            )}
                            {selectedModel === model.id && (
                              <Check className="w-3.5 h-3.5 text-amber-400" />
                            )}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              data-scroll-container="true"
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
            >
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-neutral-800/80 border border-neutral-700/50 rounded-2xl rounded-tl-md px-4 py-3.5 max-w-[88%]">
                      <p className="text-[14px] text-neutral-100 leading-relaxed">
                        Xin chào! Tôi là trợ lý AI của{" "}
                        <strong className="text-amber-400">AFTER HOURS</strong>.
                        Tôi có thể giúp bạn tìm hiểu về dự án, mô hình tài chính và đặc biệt là{" "}
                        <strong className="text-amber-300">xem trước, tùy chỉnh thông tin và tải về Hợp đồng đầu tư mẫu</strong>. 🍽️
                      </p>
                    </div>
                  </div>

                  {/* Contract Banner Card */}
                  <div className="ml-11 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Hợp Đồng Hợp Tác Đầu Tư</p>
                        <p className="text-[11px] text-neutral-400">Mẫu dự thảo chuẩn áp dụng cho dự án</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsContractModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors shrink-0 shadow-sm"
                    >
                      Review Ngay
                    </button>
                  </div>

                  {/* Quick Prompts */}
                  <div className="pl-11 space-y-2.5">
                    <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                      Câu hỏi gợi ý
                    </p>
                    <div className="flex flex-col gap-2">
                      {QUICK_PROMPTS.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(prompt)}
                          className="text-left text-[13px] leading-snug px-3.5 py-2.5 rounded-xl border border-neutral-700/60 bg-neutral-800/40 text-neutral-200 hover:bg-amber-500/10 hover:border-amber-500/40 hover:text-amber-300 transition-all duration-200"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3.5 ${
                      msg.role === "user"
                        ? "bg-amber-600 text-white rounded-tr-md shadow-md"
                        : "bg-neutral-800/80 border border-neutral-700/50 text-neutral-100 rounded-tl-md shadow-md"
                    }`}
                  >
                    {msg.role === "assistant" && !msg.content && isStreaming ? (
                      <div className="flex items-center gap-2 py-1">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span className="text-[13px] text-neutral-400">
                          Đang phân tích tài liệu dự án...
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-[14px] leading-[1.7] whitespace-pre-wrap">
                          {renderContent(msg.content)}
                        </div>

                        {/* Interactive Contract Action Card in message if relevant */}
                        {msg.role === "assistant" && isContractRelated(msg.content) && !isStreaming && (
                          <div className="mt-3 p-3 rounded-xl bg-neutral-900/90 border border-amber-500/30 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                              <ShieldCheck className="w-4 h-4" />
                              <span>Hành động với Hợp Đồng Đầu Tư:</span>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                              <button
                                onClick={() => setIsContractModalOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-sm transition-all"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Xem & Sửa Hợp Đồng</span>
                              </button>
                              <a
                                href="/api/contract?download=raw&type=docx"
                                download="hop_dong_dau_tu_after_hours_preview.docx"
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
                              >
                                <Download className="w-3 h-3 text-amber-400" />
                                <span>Tải .DOCX</span>
                              </a>
                              <a
                                href="/api/contract?download=raw&type=pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
                              >
                                <Printer className="w-3 h-3 text-red-400" />
                                <span>Tải .PDF</span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                      <User className="w-4 h-4 text-neutral-300" />
                    </div>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollDown && (
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  onClick={scrollToBottom}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-neutral-700/90 border border-neutral-600 flex items-center justify-center shadow-lg hover:bg-neutral-600 transition-colors"
                >
                  <ChevronDown className="w-4 h-4 text-neutral-200" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="border-t border-neutral-700/60 bg-neutral-950/90 px-3 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Hỏi về dự án, điều khoản hợp đồng hoặc số tiền góp vốn..."
                  rows={1}
                  disabled={isStreaming}
                  className="flex-1 resize-none bg-neutral-800/80 border border-neutral-700/60 rounded-xl px-3.5 py-2.5 text-[14px] text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 disabled:opacity-50 transition-all max-h-24 scrollbar-thin"
                  style={{ minHeight: "42px" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "42px";
                    target.style.height = Math.min(target.scrollHeight, 96) + "px";
                  }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isStreaming || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shrink-0 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shadow-md"
                  aria-label="Gửi"
                >
                  {isStreaming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-neutral-500">
                <span>AI trả lời dựa trên tài liệu dự án & hợp đồng</span>
                <button
                  type="button"
                  onClick={() => setIsContractModalOpen(true)}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1 underline underline-offset-2"
                >
                  <FileText className="w-3 h-3" />
                  Xem Hợp Đồng Mẫu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contract Review & Edit Modal */}
      <ContractPreviewModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        onSendToChat={(summary) => {
          sendMessage(summary);
        }}
      />
    </>
  );
}
