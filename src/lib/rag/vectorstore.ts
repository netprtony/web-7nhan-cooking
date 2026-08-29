import { TextChunk } from './splitter';

interface ScoredChunk {
  chunk: TextChunk;
  score: number;
}

/**
 * In-Memory Vector Store sử dụng BM25-style scoring.
 * Không cần external embedding API → zero cost, zero latency cho retrieval.
 */
class InMemoryVectorStore {
  private chunks: TextChunk[] = [];
  private tokenizedChunks: string[][] = [];
  private avgDocLength: number = 0;
  private idfCache: Map<string, number> = new Map();

  /**
   * Nạp các chunks vào store và tính toán thống kê IDF
   */
  addChunks(chunks: TextChunk[]): void {
    this.chunks = chunks;
    this.tokenizedChunks = chunks.map(c => this.tokenize(c.content));

    // Tính average document length
    const totalTokens = this.tokenizedChunks.reduce((sum, tokens) => sum + tokens.length, 0);
    this.avgDocLength = totalTokens / Math.max(this.tokenizedChunks.length, 1);

    // Pre-compute IDF cho tất cả terms
    this.computeIDF();
  }

  /**
   * Tìm kiếm Top-K chunks phù hợp nhất với query.
   * Sử dụng BM25 scoring + Context Reordering (U-shape).
   */
  search(query: string, topK: number = 4): TextChunk[] {
    if (this.chunks.length === 0) return [];

    const queryTokens = this.tokenize(query);

    const scored: ScoredChunk[] = this.chunks.map((chunk, idx) => ({
      chunk,
      score: this.bm25Score(queryTokens, this.tokenizedChunks[idx]),
    }));

    // Sắp xếp theo score giảm dần
    scored.sort((a, b) => b.score - a.score);

    // Lấy Top-K
    const topResults = scored.slice(0, topK);

    // Context Reordering: sắp xếp hình chữ U
    // Quan trọng nhất ở đầu và cuối, ít quan trọng hơn ở giữa
    return this.uShapeReorder(topResults.map(r => r.chunk));
  }

  /**
   * BM25 scoring algorithm
   * k1 = 1.5, b = 0.75 (standard parameters)
   */
  private bm25Score(queryTokens: string[], docTokens: string[]): number {
    const k1 = 1.5;
    const b = 0.75;
    const docLength = docTokens.length;

    // Đếm term frequency trong document
    const termFreq = new Map<string, number>();
    for (const token of docTokens) {
      termFreq.set(token, (termFreq.get(token) || 0) + 1);
    }

    let score = 0;

    for (const queryToken of queryTokens) {
      const tf = termFreq.get(queryToken) || 0;
      const idf = this.idfCache.get(queryToken) || 0;

      if (tf === 0) continue;

      const numerator = tf * (k1 + 1);
      const denominator = tf + k1 * (1 - b + b * (docLength / this.avgDocLength));

      score += idf * (numerator / denominator);
    }

    return score;
  }

  /**
   * Tính Inverse Document Frequency cho tất cả unique terms
   */
  private computeIDF(): void {
    this.idfCache.clear();
    const N = this.tokenizedChunks.length;

    // Đếm số documents chứa mỗi term
    const docFreq = new Map<string, number>();
    for (const tokens of this.tokenizedChunks) {
      const uniqueTokens = new Set(tokens);
      for (const token of uniqueTokens) {
        docFreq.set(token, (docFreq.get(token) || 0) + 1);
      }
    }

    // Tính IDF: log((N - df + 0.5) / (df + 0.5) + 1)
    for (const [term, df] of docFreq) {
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
      this.idfCache.set(term, idf);
    }
  }

  /**
   * Tokenize text: lowercase, loại bỏ ký tự đặc biệt, tách từ
   * Hỗ trợ tiếng Việt (giữ nguyên dấu)
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(token => token.length > 1);
  }

  /**
   * U-Shape Reordering: đặt thông tin quan trọng nhất ở đầu và cuối
   * Tránh hiện tượng "Lost in the Middle"
   */
  private uShapeReorder(chunks: TextChunk[]): TextChunk[] {
    if (chunks.length <= 2) return chunks;

    const reordered: TextChunk[] = [];
    let left = 0;
    let right = chunks.length - 1;
    let addToFront = true;

    const temp: TextChunk[] = [];

    for (let i = 0; i < chunks.length; i++) {
      if (addToFront) {
        reordered.push(chunks[left]);
        left++;
      } else {
        temp.unshift(chunks[right]);
        right--;
      }
      addToFront = !addToFront;
    }

    return [...reordered, ...temp];
  }
}

// Singleton instance
let storeInstance: InMemoryVectorStore | null = null;

export function getVectorStore(): InMemoryVectorStore {
  if (!storeInstance) {
    storeInstance = new InMemoryVectorStore();
  }
  return storeInstance;
}

export function resetVectorStore(): void {
  storeInstance = null;
}
