import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

export interface LoadedDocument {
  source: string;
  text: string;
  html?: string;
}

let cachedDocuments: LoadedDocument[] | null = null;
let cachedContract: { text: string; html: string } | null = null;

function cleanText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\t+/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim();
}

/**
 * Đọc tất cả các tài liệu (.docx) trong thư mục data/ (Dự án + Hợp đồng đầu tư)
 */
export async function loadAllDocuments(): Promise<LoadedDocument[]> {
  if (cachedDocuments) return cachedDocuments;

  const dataDir = path.join(process.cwd(), 'data');
  const targetFiles = [
    'AFTER_HOURS_Du_An.docx',
    'hop_dong_dau_tu_after_hours_preview.docx',
  ];

  const docs: LoadedDocument[] = [];

  for (const filename of targetFiles) {
    const filePath = path.join(dataDir, filename);
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      const [rawResult, htmlResult] = await Promise.all([
        mammoth.extractRawText({ buffer }),
        mammoth.convertToHtml({ buffer }),
      ]);

      docs.push({
        source: filename,
        text: cleanText(rawResult.value),
        html: htmlResult.value,
      });
    }
  }

  cachedDocuments = docs;
  return docs;
}

/**
 * Đọc riêng Hợp Đồng Đầu Tư Mẫu (text + html)
 */
export async function loadContractDocument(): Promise<{ text: string; html: string }> {
  if (cachedContract) return cachedContract;

  const contractPath = path.join(process.cwd(), 'data', 'hop_dong_dau_tu_after_hours_preview.docx');
  if (!fs.existsSync(contractPath)) {
    throw new Error(`Không tìm thấy file hợp đồng tại: ${contractPath}`);
  }

  const buffer = fs.readFileSync(contractPath);
  const [rawResult, htmlResult] = await Promise.all([
    mammoth.extractRawText({ buffer }),
    mammoth.convertToHtml({ buffer }),
  ]);

  cachedContract = {
    text: cleanText(rawResult.value),
    html: htmlResult.value,
  };

  return cachedContract;
}

/**
 * Tương thích ngược: Đọc toàn bộ text tổng hợp
 */
export async function loadDocument(): Promise<string> {
  const docs = await loadAllDocuments();
  return docs.map(d => `=== [TÀI LIỆU: ${d.source}] ===\n\n${d.text}`).join('\n\n\n');
}

/**
 * Xóa cache (dùng khi cần reload tài liệu)
 */
export function clearDocumentCache(): void {
  cachedDocuments = null;
  cachedContract = null;
}

