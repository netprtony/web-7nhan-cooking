# Implementation Plan: Hệ thống RAG Q&A cho Nhà đầu tư - Dự án Nhà hàng AFTER HOURS

## 1. Tổng quan Dự án & Mục tiêu
Xây dựng trợ lý AI thông minh tích hợp trên trang web kêu gọi đầu tư của nhà hàng **AFTER HOURS**. Trợ lý này sẽ giúp các nhà đầu tư tiềm năng giải đáp nhanh chóng, chính xác các thắc mắc về mô hình kinh doanh, chiến lược tài chính, thực đơn, kế hoạch hoàn vốn và tiềm năng mở rộng chuỗi dựa trên tài liệu chính thống của doanh nghiệp, ứng dụng mô hình **Modern RAG** kết hợp **OpenRouter API** trên nền tảng **Next.js**.

---

## 2. Kiến trúc Hệ thống (Modern RAG Workflow)

```
[Tài liệu Nhà đầu tư: PDF/Markdown/Pitch Deck]
       │
       ▼
[1. Document Loading & Recursive Chunking] (Chia nhỏ văn bản thông minh, giữ nguyên ngữ nghĩa)
       │
       ▼
[2. Embedding Model] (Chuyển đổi thành Dense Vectors)
       │
       ▼
[3. Vector Store / Database] (Lưu trữ và lập chỉ mục ANN - Chroma / PGVector / In-memory)
       │
       ▼  (Khi nhà đầu tư đặt câu hỏi qua Next.js UI)
[4. Similarity Search & Retrieval] (Truy xuất Top-K Context liên quan nhất)
       │
       ▼
[5. Prompt Engineering & Context Grounding] (Đóng gói ngữ cảnh, chống ảo giác)
       │
       ▼
[6. OpenRouter API (LLM)] (Sinh câu trả lời minh bạch, trích dẫn nguồn)
       │
       ▼
[Next.js API Route & Chat UI] (Hiển thị phản hồi thời gian thực cho nhà đầu tư)
```

---

## 3. Cấu trúc Thư mục Dự án Next.js đề xuất
```text
after-hours-investor/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API Route xử lý RAG pipeline và gọi OpenRouter
│   ├── investor/
│   │   └── page.tsx              # Giao diện trang web giới thiệu nhà đầu tư & Widget Chat AI
├── lib/
│   ├── rag/
│   │   ├── loader.ts             # Xử lý nạp và làm sạch tài liệu (PDF/Markdown)
│   │   ├── splitter.ts           # Recursive Character Text Splitting & Chunk Overlap
│   │   ├── vectorstore.ts        # Quản lý Vector DB & Similarity Search
│   │   └── prompt.ts             # Template Prompt chuyên biệt cho nhà đầu tư (Grounding)
├── data/
│   ├── AFTER_HOURS_Du_An.docx            # Tài liệu giới thiệu dự án AFTER HOURS (Tổng Hợp)
└── .env.local                    # Chứa OPENROUTER_API_KEY
```

---

## 4. Chi tiết các giai đoạn thực thi (Implementation Steps)

### Giai đoạn 1: Chuẩn bị Dữ liệu & Tiền xử lý (Ingestion & Chunking)
* **Tài liệu nguồn:** Thu thập Pitch Deck, tài liệu tài chính, mô hình vận hành của AFTER HOURS dưới định dạng PDF hoặc Markdown.
* **Text Splitting:** Áp dụng **Recursive Character Text Splitting** (tương tự tài liệu RAG tiêu chuẩn) với:
  * `chunk_size = 500` (đảm bảo mỗi đoạn tập trung vào một ý chính như doanh thu, chi phí, hoặc ý tưởng món ăn).
  * `chunk_overlap = 100` (duy trì sự liên tục ngữ cảnh giữa các phần).
* **Chiến lược Indexing nâng cao:** Ở RAG cơ bản, đoạn văn bản dùng để tìm kiếm và đoạn văn bản đưa cho LLM cùng là
một. Tuy nhiên, điều này có thể nảy sinh mâu thuẫn: chunk nhỏ tốt cho tìm kiếm, chunk
lớn tốt cho LLM do có nhiều ngữ cảnh hơn. Để giải quyết, ta có các chiến lược mở rộng:
• Parent-Child Indexing (Small-to-Big):
– Chia văn bản thành các khối lớn, ví dụ 1000 tokens, gọi là Parent chunks để chứa
ngữ cảnh đầy đủ.
– Chia Parent chunks thành các khối nhỏ hơn, ví dụ 200 tokens, gọi là Child chunks.
– Cơ chế: Hệ thống sẽ index và tìm kiếm trên Child chunks để đạt độ chính xác
cao, nhưng khi trả về kết quả cho LLM, hệ thống sẽ lấy Parent chunk tương ứng.
• Summary Indexing: Sử dụng LLM để tóm tắt chunk gốc. Ta sẽ index phiên bản
tóm tắt này với ý nghĩa được cô đọng hơn, nhưng khi cần sẽ trả về văn bản gốc chi
tiết. 
* **Metadata Tagging:** Gắn nhãn metadata cho từng chunk (ví dụ: `source: "financial_model.pdf"`, `category: "dự phóng tài chính"`) để hỗ trợ lọc trước khi truy vấn nếu cần.

### Giai đoạn 2: Xây dựng Vector Database & Embedding
* **Embedding Model:** Sử dụng mô hình Embedding tối ưu (có thể dùng qua API của OpenRouter hoặc HuggingFace Embeddings miễn phí/chi phí thấp).
* **Vector Store:** 
  * Cho giai đoạn Prototype/Demo: Sử dụng `ChromaDB` (chạy local) hoặc `InMemoryVectorStore`.
  * Cho môi trường Production (nếu hệ thống Next.js dùng Supabase/PostgreSQL): Tích hợp extension `pgvector`.

### Giai đoạn 3: Phát triển Backend Pipeline trên Next.js (`/app/api/chat/route.ts`)
* **Nhận Request:** Nhận câu hỏi từ nhà đầu tư (ví dụ: *"Thời gian hoàn vốn dự kiến cho một chi nhánh AFTER HOURS là bao lâu?"*).
* **Truy xuất (Retrieval):** Chuyển câu hỏi thành vector, thực hiện `Similarity Search` trong Vector Store để lấy Top-4 Context phù hợp nhất.
* **Context Reordering (Áp dụng Modern RAG):** Sắp xếp lại thứ tự các tài liệu theo chiến lược hình chữ U (đưa thông tin quan trọng nhất lên đầu và cuối prompt) để tránh hiện tượng *Lost in the Middle*.

### Giai đoạn 4: Tích hợp OpenRouter API & Prompt Engineering
* **OpenRouter Client:** Sử dụng OpenAI SDK cấu hình trỏ tới endpoint của OpenRouter (`https://openrouter.ai/api/v1`) với các model mạnh về tiếng Việt và logic như `qwen/qwen-2.5-72b-instruct`, `anthropic/claude-3.5-sonnet`, hoặc `meta-llama/llama-3.1-70b-instruct`.
* **System Prompt Template cho Nhà đầu tư:**
  ```text
  System: Bạn là Giám đốc Quan hệ Nhà đầu tư (Investor Relations) chuyên nghiệp của nhà hàng AFTER HOURS. 
  Nhiệm vụ của bạn là trả lời các câu hỏi từ nhà đầu tư dựa TUYỆT ĐỐI vào [TÀI LIỆU] được cung cấp dưới đây.
  
  Quy tắc:
  1. Nếu thông tin có trong tài liệu, hãy trình bày rõ ràng, số liệu chính xác, chuyên nghiệp, khách quan và lịch sự.
  2. Nếu tài liệu không có thông tin, hãy lịch sự từ chối và hướng dẫn nhà đầu tư liên hệ trực tiếp qua email founder@afterhours.vn.
  3. Luôn đính kèm tên tài liệu nguồn trích dẫn ở cuối câu trả lời (Ví dụ: [Nguồn: financial_model.pdf]).
  
  [TÀI LIỆU]:
  {context}
  
  [CÂU HỎI TỪ NHÀ ĐẦU TƯ]:
  {question}
  ```

### Giai đoạn 5: Phát triển Giao diện Người dùng (Next.js Frontend)
* Xây dựng giao diện chat hiện đại, tinh tế, phù hợp với phong cách thương hiệu cao cấp của nhà hàng AFTER HOURS (tông màu tối sang trọng, typography sắc nét).
* Thêm các câu hỏi gợi ý sẵn cho nhà đầu tư (Quick Prompts), ví dụ:
  * *"Mô hình kinh doanh và điểm hòa vốn của AFTER HOURS như thế nào?"*
  * *"Chiến lược định giá và biên lợi nhuận gộp mục tiêu?"*
  * *"Kế hoạch sử dụng nguồn vốn gọi đợt này ra sao?"*

---

## 5. Tiêu chí Đánh giá & Kiểm thử (Evaluation)
* **Độ chính xác Grounding:** Kiểm tra xem LLM có bịa đặt số liệu tài chính không (bắt buộc phải bám sát tài liệu nguồn).
* **Độ trễ phản hồi (Latency):** Tối ưu hóa thời gian từ lúc nhà đầu tư bấm gửi đến khi AI trả lời dưới 3 giây bằng cách tối ưu kích thước Top-K chunks và sử dụng mô hình inference nhanh trên OpenRouter (như Groq/Qwen).
* **Tính minh bạch:** Đảm bảo mọi câu trả lời đều có trích dẫn nguồn tài liệu gốc để tạo niềm tin tối đa với nhà đầu tư.
