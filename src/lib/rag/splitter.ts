export interface TextChunk {
  content: string;
  metadata: {
    source: string;
    chunkIndex: number;
  };
}

/**
 * Recursive Character Text Splitting
 * Chia văn bản thành các chunk nhỏ, giữ nguyên ngữ nghĩa.
 * 
 * @param text - Văn bản đầu vào
 * @param chunkSize - Kích thước tối đa mỗi chunk (default: 500)
 * @param chunkOverlap - Số ký tự chồng lấn giữa các chunk (default: 100)
 * @param source - Tên tài liệu nguồn
 */
export function splitText(
  text: string,
  chunkSize: number = 500,
  chunkOverlap: number = 100,
  source: string = 'AFTER_HOURS_Du_An.docx'
): TextChunk[] {
  // Các separator theo thứ tự ưu tiên (chia tại đoạn văn trước, câu sau, từ cuối)
  const separators = ['\n\n', '\n', '. ', ', ', ' '];

  const chunks = recursiveSplit(text, separators, chunkSize, chunkOverlap);

  return chunks.map((content, index) => ({
    content: content.trim(),
    metadata: {
      source,
      chunkIndex: index,
    },
  })).filter(chunk => chunk.content.length > 20); // Loại bỏ chunk quá ngắn
}

function recursiveSplit(
  text: string,
  separators: string[],
  chunkSize: number,
  chunkOverlap: number
): string[] {
  if (text.length <= chunkSize) {
    return [text];
  }

  // Tìm separator phù hợp nhất
  let bestSeparator = '';
  for (const sep of separators) {
    if (text.includes(sep)) {
      bestSeparator = sep;
      break;
    }
  }

  // Nếu không tìm thấy separator nào, chia cứng theo chunkSize
  if (!bestSeparator) {
    return splitBySize(text, chunkSize, chunkOverlap);
  }

  const parts = text.split(bestSeparator);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const part of parts) {
    const candidate = currentChunk
      ? currentChunk + bestSeparator + part
      : part;

    if (candidate.length <= chunkSize) {
      currentChunk = candidate;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }

      // Nếu part đơn lẻ lớn hơn chunkSize, đệ quy với separator tiếp theo
      if (part.length > chunkSize) {
        const remainingSeparators = separators.slice(
          separators.indexOf(bestSeparator) + 1
        );
        if (remainingSeparators.length > 0) {
          chunks.push(...recursiveSplit(part, remainingSeparators, chunkSize, chunkOverlap));
        } else {
          chunks.push(...splitBySize(part, chunkSize, chunkOverlap));
        }
        currentChunk = '';
      } else {
        currentChunk = part;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  // Áp dụng overlap: thêm phần cuối của chunk trước vào đầu chunk sau
  if (chunkOverlap > 0 && chunks.length > 1) {
    return applyOverlap(chunks, chunkOverlap);
  }

  return chunks;
}

function splitBySize(text: string, chunkSize: number, chunkOverlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - chunkOverlap;
  }

  return chunks;
}

function applyOverlap(chunks: string[], overlap: number): string[] {
  const result: string[] = [chunks[0]];

  for (let i = 1; i < chunks.length; i++) {
    const prevChunk = chunks[i - 1];
    const overlapText = prevChunk.slice(-overlap);
    result.push(overlapText + chunks[i]);
  }

  return result;
}
