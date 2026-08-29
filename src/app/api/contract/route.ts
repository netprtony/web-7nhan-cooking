import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { loadContractDocument } from '@/lib/rag/loader';
import { generateContractDocx, DEFAULT_CONTRACT_DATA, ContractData } from '@/lib/contract/generator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const download = searchParams.get('download');
    const fileType = searchParams.get('type') || 'docx';

    // Xử lý download file gốc (docx hoặc pdf)
    if (download === 'raw') {
      const dataDir = path.join(process.cwd(), 'data');
      const filename = fileType === 'pdf'
        ? 'hop_dong_dau_tu_after_hours_preview.pdf'
        : 'hop_dong_dau_tu_after_hours_preview.docx';

      const filePath = path.join(dataDir, filename);

      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Không tìm thấy file hợp đồng gốc.' }, { status: 404 });
      }

      const fileBuffer = fs.readFileSync(filePath);
      const contentType = fileType === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Trả về dữ liệu mẫu hợp đồng (text, html, default fields)
    const { text, html } = await loadContractDocument();

    return NextResponse.json({
      success: true,
      text,
      html,
      defaultData: DEFAULT_CONTRACT_DATA,
    });
  } catch (error: any) {
    console.error('[Contract API] GET Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Không thể tải thông tin hợp đồng.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const contractData: Partial<ContractData> = body.data || body;
    const filename = body.filename || `Hop_Dong_Dau_Tu_AFTER_HOURS_${Date.now()}.docx`;

    const docxBuffer = await generateContractDocx(contractData);

    return new NextResponse(docxBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      },
    });
  } catch (error: any) {
    console.error('[Contract API] POST Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Không thể tạo file hợp đồng.' },
      { status: 500 }
    );
  }
}
