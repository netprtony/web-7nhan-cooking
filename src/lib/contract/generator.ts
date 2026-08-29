import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
} from 'docx';

export interface ContractData {
  contractNumber?: string;
  signDate?: string;
  day?: string;
  month?: string;
  year?: string;
  // Bên B (Nhà đầu tư)
  investorName: string;
  investorId?: string; // CMND / CCCD / MST
  investorIdDate?: string;
  investorIdPlace?: string;
  investorAddress?: string;
  investorRepresentative?: string;
  investorPosition?: string;
  investorPhone?: string;
  investorEmail?: string;
  investorBankAccount?: string;
  investorBankName?: string;
  // Giá trị đầu tư
  investmentAmount?: string;
  investmentAmountWords?: string;
  equityPercentage?: string;
  // Giai đoạn hoàn vốn & chi trả
  paybackRatePhase1?: string; // e.g. 85%
  paymentDayOfMonth?: string; // e.g. ngày 15 hàng tháng
  contractDurationYears?: string; // e.g. 5 năm
  lockupMonths?: string; // e.g. 12 tháng
  // Tùy chỉnh thêm
  customNotes?: string;
  customFullText?: string;
}

export const DEFAULT_CONTRACT_DATA: ContractData = {
  contractNumber: 'AH-INV-2026-001',
  day: '......',
  month: '......',
  year: '2026',
  investorName: '[TÊN CHỦ ĐẦU TƯ / TỔ CHỨC ĐẦU TƯ]',
  investorId: '.......................................................',
  investorIdDate: '.../.../......',
  investorIdPlace: '.......................................',
  investorAddress: '....................................................................................................',
  investorRepresentative: '................................................',
  investorPosition: '................................................',
  investorPhone: '.............................................',
  investorEmail: '...................................................................',
  investorBankAccount: '.............................................',
  investorBankName: '...................................................................',
  investmentAmount: '400.000.000 VNĐ',
  investmentAmountWords: 'Bốn trăm triệu đồng chẵn',
  equityPercentage: '14,29%',
  paybackRatePhase1: '85%',
  paymentDayOfMonth: '15',
  contractDurationYears: '05',
  lockupMonths: '12',
};

/**
 * Tạo file docx từ dữ liệu hợp đồng hoặc văn bản tùy chỉnh
 */
export async function generateContractDocx(data: Partial<ContractData>): Promise<Buffer> {
  const merged: ContractData = { ...DEFAULT_CONTRACT_DATA, ...data };

  // Nếu người dùng cung cấp customFullText (đã chỉnh sửa toàn văn bản)
  if (merged.customFullText && merged.customFullText.trim().length > 100) {
    return generateDocxFromPlainText(merged.customFullText);
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          // Quốc hiệu & Tiêu ngữ
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                bold: true,
                size: 26, // 13pt
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Độc lập – Tự do – Hạnh phúc',
                bold: true,
                size: 26,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '---------------------------------',
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Tiêu đề Hợp đồng
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'HỢP ĐỒNG HỢP TÁC ĐẦU TƯ KINH DOANH',
                bold: true,
                size: 32, // 16pt
                color: '8A5A00', // Gold/Bronze accent
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'DỰ ÁN: NHÀ HÀNG AFTER HOURS – MODERN DINING',
                bold: true,
                size: 28,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Số: ${merged.contractNumber || 'AH-INV-2026-001'}/2026/HĐĐT-AFTERHOURS`,
                italics: true,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Hôm nay, ngày ${merged.day || '...'} tháng ${merged.month || '...'} năm ${merged.year || '2026'}, tại Trụ sở Nhà hàng After Hours, TP. Hồ Chí Minh.`,
                italics: true,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Căn cứ pháp lý
          new Paragraph({
            children: [
              new TextRun({
                text: '- Căn cứ Bộ luật Dân sự số 91/2015/QH13 nước CHXHCN Việt Nam;\n- Căn cứ Luật Doanh nghiệp số 59/2020/QH14 và Luật Đầu tư số 61/2020/QH14;\n- Căn cứ Luật Thương mại số 36/2005/QH11 và Giấy chứng nhận ĐKKD số 41U8031234 của HKD After Hours;\n- Căn cứ vào Đề án Khả thi Dự án After Hours Modern Dining và sự thống nhất tự nguyện của các Bên.',
                italics: true,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // CÁC BÊN THAM GIA KÝ KẾT
          new Paragraph({
            children: [
              new TextRun({
                text: 'CÁC BÊN THAM GIA KÝ KẾT:',
                bold: true,
                size: 26,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // BÊN A
          new Paragraph({
            children: [
              new TextRun({
                text: 'BÊN A: BAN SÁNG LẬP & ĐIỀU HÀNH DỰ ÁN AFTER HOURS',
                bold: true,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Tên đơn vị: HỘ KINH DOANH AFTER HOURS (DỰ ÁN AFTER HOURS MODERN DINING)\n• Giấy phép ĐKKD: Số 41U8031234 do Phòng TC-KH UBND Quận Bình Thạnh cấp ngày 15/06/2024\n• Mã số thuế: 8888888888-001 do Cục Thuế TP. Hồ Chí Minh cấp\n• Địa chỉ mặt bằng: Số 08 Nguyễn Gia Trí, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh\n• Đại diện pháp luật: Ông ĐỖ MINH SƠN | Chức vụ: Quản lý Điều hành / Đại diện Ban Sáng lập\n• Số CCCD: 066303005375 cấp ngày 01/03/2023 tại Cục CS QLHC về TTXH\n• Điện thoại / Email: 0386 714 512 | contact@afterhours.vn / founder@afterhours.vn',
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // BÊN B (Nhà đầu tư)
          new Paragraph({
            children: [
              new TextRun({
                text: 'BÊN B: NHÀ ĐẦU TƯ / CHỦ ĐẦU TƯ (INVESTOR)',
                bold: true,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `• Tên Tổ chức / Cá nhân: ${merged.investorName}\n• Số CMND / CCCD / MST: ${merged.investorId}  (Cấp ngày: ${merged.investorIdDate || '...'}  Nơi cấp: ${merged.investorIdPlace || '...'})\n• Địa chỉ thường trú / Trụ sở: ${merged.investorAddress || '...'}\n• Người đại diện (nếu là cty): ${merged.investorRepresentative || '...'} - Chức vụ: ${merged.investorPosition || '...'}\n• Điện thoại / Email: ${merged.investorPhone || '...'} | ${merged.investorEmail || '...'}\n• Số tài khoản nhận lợi nhuận: STK ${merged.investorBankAccount || '...'} tại Ngân hàng ${merged.investorBankName || '...'}`,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Hai bên thống nhất thỏa thuận và ký kết Hợp đồng hợp tác đầu tư với các điều khoản chi tiết sau:',
                italics: true,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // ĐIỀU 1
          new Paragraph({
            children: [
              new TextRun({
                text: 'ĐIỀU 1: ĐỐI TƯỢNG VÀ QUY MÔ DỰ ÁN HỢP TÁC',
                bold: true,
                size: 26,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '1.1. Mục đích: Bên B tham gia góp vốn đầu tư cùng Bên A để xây dựng, thiết lập và vận hành dự án Nhà hàng Modern Dark Dining mang tên AFTER HOURS.\n1.2. Địa điểm triển khai: Số 08 Nguyễn Gia Trí, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh.\n1.3. Quy mô kết cấu: 01 trệt, 02 lầu (120m²/tầng, tổng diện tích sàn 360m²):\n  - Tầng trệt (120m²): Khu giữ xe chuyên biệt (25-30 xe máy) và lối check-in sang trọng.\n  - Tầng 1 (120m²): Không gian ăn uống (45-50 khách), Quầy POS, Bếp mở Open Kitchen chuẩn SOP.\n  - Tầng 2 (120m²): Không gian ăn uống (40-45 khách), Quầy pha chế Mocktail & Soda Signature.\n1.4. Tổng sức chứa: 85 - 95 khách/lượt. Giờ phục vụ: 12:00 PM – 12:00 AM (Phục vụ xuyên đêm).',
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // ĐIỀU 2
          new Paragraph({
            children: [
              new TextRun({
                text: 'ĐIỀU 2: TỔNG VỐN ĐẦU TƯ VÀ CƠ CẤU PHÂN BỔ (CAPEX + OPEX)',
                bold: true,
                size: 26,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '2.1. Tổng mức đầu tư toàn bộ dự án: 2.800.000.000 VNĐ (Hai tỷ tám trăm triệu đồng chẵn).\n2.2. Chi tiết phân bổ ngân sách theo Đề án khả thi: Thiết bị bếp & bàn ghế 728.1 tr (26%); Cải tạo thô & decor 350 tr (12.5%); Đặt cọc & thuê mặt bằng 240 tr (8.57%); Nguyên vật liệu đầu 100 tr (3.57%); Marketing Grand Opening 120 tr (4.29%); Pháp lý ATTP/PCCC 60 tr (2.14%); Đồng phục & Đào tạo 31.9 tr (1.14%); Quỹ lương 3 tháng 705 tr (25.18%); Vốn lưu động dự phòng rủi ro 465 tr (16.61%).\n2.3. Tỷ lệ tham gia góp vốn của Bên B:\n',
                size: 24,
                font: 'Times New Roman',
              }),
              new TextRun({
                text: `• Số tiền góp vốn của Bên B: ${merged.investmentAmount || '400.000.000 VNĐ'} (Bằng chữ: ${merged.investmentAmountWords || 'Bốn trăm triệu đồng chẵn'}).\n• Tỷ lệ sở hữu phần vốn góp tại Dự án: ${merged.equityPercentage || '14,29%'}.\n`,
                bold: true,
                size: 24,
                color: '8A5A00',
                font: 'Times New Roman',
              }),
              new TextRun({
                text: '2.4. Tiến độ góp vốn của Bên B:\n  - Đợt 1 (40% vốn): Ngay sau khi ký hợp đồng chính thức để giải ngân mặt bằng và cải tạo thô.\n  - Đợt 2 (40% vốn): Sau 15 ngày kể từ Đợt 1, khi hoàn tất phần thô và lắp đặt thiết bị bếp, bàn ghế.\n  - Đợt 3 (20% còn lại): Trong vòng 03 ngày trước ngày Soft Opening để nhập kho nguyên liệu.',
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // ĐIỀU 3
          new Paragraph({
            children: [
              new TextRun({
                text: 'ĐIỀU 3: CHÍNH SÁCH PHÂN CHIA LỢI NHUẬN VÀ BÁO CÁO TÀI CHÍNH',
                bold: true,
                size: 26,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `3.1. Chỉ tiêu tài chính mục tiêu: Doanh thu kỳ vọng 700 triệu/tháng; Food cost định mức 35% (Gross Profit 65%); Chi phí vận hành OPEX ~350 triệu/tháng; Điểm hòa vốn BEP 492 triệu/tháng (~51 khách/ngày); Lợi nhuận ròng dự kiến ~100 triệu/tháng (~1,2 tỷ VNĐ/năm).\n3.2. Cơ chế phân chia lợi nhuận ưu tiên hoàn vốn cho Nhà Đầu Tư (Payback Accelerator):\n`,
                size: 24,
                font: 'Times New Roman',
              }),
              new TextRun({
                text: `  • Giai đoạn 1 (Thu hồi vốn): Dành ${merged.paybackRatePhase1 || '85%'} Tổng Lợi Nhuận Ròng hàng tháng chi trả cho Nhà đầu tư theo tỷ lệ vốn góp cho đến khi Bên B thu hồi đủ 100% số vốn góp ban đầu.\n  • Giai đoạn 2 (Sau hoàn vốn): Toàn bộ lợi nhuận ròng phân chia đúng theo Tỷ lệ sở hữu vốn thực tế (${merged.equityPercentage || '14,29%'}) xuyên suốt thời hạn hợp tác.\n`,
                bold: true,
                size: 24,
                font: 'Times New Roman',
              }),
              new TextRun({
                text: `3.3. Kỳ chi trả lợi nhuận: Định kỳ ngày ${merged.paymentDayOfMonth || '15'} hàng tháng qua tài khoản ngân hàng chỉ định của Bên B.\n3.4. Minh bạch số liệu: Bên A cấp tài khoản Read-Only trên hệ thống POS/ERP để Bên B theo dõi doanh thu realtime; gửi Báo cáo P&L có đối soát trước ngày 10 hàng tháng.`,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // ĐIỀU 4
          new Paragraph({
            children: [
              new TextRun({
                text: 'ĐIỀU 4: PHÂN ĐỊNH TRÁCH NHIỆM & QUYỀN HẠN',
                bold: true,
                size: 26,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '4.1. Trách nhiệm & Quyền hạn Bên A: Toàn quyền điều hành hoạt động thường nhật: quản trị bếp, thực đơn 6 món khai vị - 6 món chính - 4 món chia sẻ - 5 tráng miệng - đồ uống signature, kiểm soát food cost và tiêu chuẩn ATTP/PCCC. Quản lý bộ máy 23 nhân sự. Chịu trách nhiệm bảo toàn và sử dụng Quỹ dự phòng rủi ro 465 triệu đồng đúng quy chế.\n4.2. Quyền hạn & Nghĩa vụ Bên B: Đóng góp vốn đúng hạn và đầy đủ theo Điều 2. Có quyền giám sát tài chính, kiểm tra báo cáo kế toán, đối soát doanh thu bất kỳ lúc nào. Tôn trọng quyền quyết định chuyên môn ẩm thực và dịch vụ của Bên A, không can thiệp vào vận hành tác nghiệp trực tiếp.',
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // ĐIỀU 5
          new Paragraph({
            children: [
              new TextRun({
                text: 'ĐIỀU 5: THỜI HẠN, CHUYỂN NHƯỢNG VÀ THOÁI VỐN (EXIT STRATEGY)',
                bold: true,
                size: 26,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `5.1. Thời hạn hợp đồng: ${merged.contractDurationYears || '05 (năm)'} năm kể từ ngày ký. Sau thời hạn trên, hai bên ưu tiên gia hạn hợp tác theo hợp đồng thuê mặt bằng.\n5.2. Điều khoản thoái vốn: Sau ${merged.lockupMonths || '12'} tháng kể từ ngày Grand Opening, Bên B có quyền chuyển nhượng phần vốn góp cho bên thứ ba. Ban sáng lập Bên A giữ quyền ưu tiên mua lại (Right of First Refusal) theo giá trị thẩm định tài sản tại thời điểm chuyển nhượng.`,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // ĐIỀU 6
          new Paragraph({
            children: [
              new TextRun({
                text: 'ĐIỀU 6: HIỆU LỰC HỢP ĐỒNG VÀ CHỮ KÝ',
                bold: true,
                size: 26,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Hợp đồng được lập thành 04 (bốn) bản có giá trị pháp lý tương đương, mỗi bên giữ 02 (hai) bản để thực hiện.',
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),

          // Phần Chữ Ký (2 Cột)
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'ĐẠI DIỆN BÊN A\n(Ký, đóng dấu và ghi rõ họ tên)',
                            bold: true,
                            size: 24,
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ text: '' }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'ĐỖ MINH SƠN\nĐại diện HKD After Hours / Quản lý Điều hành',
                            bold: true,
                            size: 24,
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'ĐẠI DIỆN BÊN B\n(Ký, ghi rõ họ tên / Đóng dấu nếu là pháp nhân)',
                            bold: true,
                            size: 24,
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ text: '' }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: `${merged.investorName}\nNhà Đầu Tư (Investor)`,
                            bold: true,
                            size: 24,
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

/**
 * Chuyển đổi chuỗi văn bản tự do thành tài liệu docx có cấu trúc
 */
export async function generateDocxFromPlainText(plainText: string): Promise<Buffer> {
  const lines = plainText.split('\n');
  const paragraphs: Paragraph[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphs.push(new Paragraph({ text: '' }));
      continue;
    }

    const isHeader = trimmed.startsWith('ĐIỀU ') || trimmed.startsWith('HỢP ĐỒNG') || trimmed.startsWith('CỘNG HÒA') || trimmed.startsWith('BÊN A') || trimmed.startsWith('BÊN B');
    const isSubHeader = trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.') || trimmed.startsWith('4.') || trimmed.startsWith('5.') || trimmed.startsWith('6.');

    paragraphs.push(
      new Paragraph({
        alignment: trimmed.startsWith('CỘNG HÒA') || trimmed.startsWith('Độc lập') || trimmed.startsWith('HỢP ĐỒNG') || trimmed.startsWith('DỰ ÁN: NHÀ HÀNG')
          ? AlignmentType.CENTER
          : AlignmentType.LEFT,
        children: [
          new TextRun({
            text: trimmed,
            bold: isHeader || isSubHeader,
            size: isHeader ? 26 : 24,
            font: 'Times New Roman',
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
