"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Edit3,
  CheckCircle2,
  X,
  RotateCcw,
  Printer,
  Copy,
  Check,
  Loader2,
  Sparkles,
  ShieldCheck,
  Building,
  User,
  DollarSign,
  Calendar,
  Eye,
  CheckCircle,
} from "lucide-react";
import { ContractData, DEFAULT_CONTRACT_DATA } from "@/lib/contract/generator";

interface ContractPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat?: (summary: string) => void;
  initialData?: Partial<ContractData>;
}

interface QuickPackage {
  id: string;
  name: string;
  amount: string;
  amountWords: string;
  equity: string;
  desc: string;
  badge?: string;
}

const INVESTMENT_PACKAGES: QuickPackage[] = [
  {
    id: "seed",
    name: "Gói Hạt Giống",
    amount: "500.000.000 VNĐ",
    amountWords: "Năm trăm triệu đồng chẵn",
    equity: "3,57%",
    desc: "3,57% Cổ phần sở hữu",
  },
  {
    id: "growth",
    name: "Gói Tăng Trưởng",
    amount: "1.500.000.000 VNĐ",
    amountWords: "Một tỷ năm trăm triệu đồng chẵn",
    equity: "10,71%",
    desc: "10,71% Cổ phần sở hữu",
    badge: "PHỔ BIẾN",
  },
  {
    id: "strategic",
    name: "Gói Chiến Lược",
    amount: "2.800.000.000 VNĐ",
    amountWords: "Hai tỷ tám trăm triệu đồng chẵn",
    equity: "20,00%",
    desc: "20% Cổ phần + Quyền biểu quyết",
  },
  {
    id: "sample",
    name: "Suất Mẫu (Đề án)",
    amount: "400.000.000 VNĐ",
    amountWords: "Bốn trăm triệu đồng chẵn",
    equity: "14,29%",
    desc: "14,29% Vốn góp dự án",
  },
];

export function ContractPreviewModal({
  isOpen,
  onClose,
  onSendToChat,
  initialData,
}: ContractPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"formatted" | "editor" | "form">("formatted");
  const [contractData, setContractData] = useState<ContractData>(DEFAULT_CONTRACT_DATA);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("sample");
  const [rawText, setRawText] = useState<string>("");
  const [editedText, setEditedText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Load default template from API
  useEffect(() => {
    if (!isOpen) return;

    const fetchContract = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/contract");
        const json = await res.json();
        if (json.text) {
          setRawText(json.text);
          setEditedText(json.text);
        }
        if (json.defaultData) {
          const merged = {
            ...json.defaultData,
            ...initialData,
          };
          setContractData(merged);
        }
      } catch (err) {
        console.error("Error fetching contract:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContract();
  }, [isOpen, initialData]);

  // Lock body scroll when modal is open to prevent page scroll conflict
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Chọn gói đầu tư nhanh
  const handleSelectPackage = (pkg: QuickPackage) => {
    setSelectedPackageId(pkg.id);
    const updated: ContractData = {
      ...contractData,
      investmentAmount: pkg.amount,
      investmentAmountWords: pkg.amountWords,
      equityPercentage: pkg.equity,
    };
    setContractData(updated);
    setFormSuccessMessage(`Đã chọn ${pkg.name} (${pkg.amount} - ${pkg.equity})`);
    setTimeout(() => setFormSuccessMessage(null), 3000);
  };

  // Áp dụng form vào text khi bấm Áp Dụng
  const handleApplyForm = (goToPreview = true) => {
    let text = rawText || editedText;

    if (contractData.investorName) {
      text = text.replace(/\[TÊN CHỦ ĐẦU TƯ \/ TỔ CHỨC ĐẦU TƯ\]/g, contractData.investorName);
      text = text.replace(/\[HỌ TÊN CHỦ ĐẦU TƯ\]/g, contractData.investorName);
    }
    if (contractData.investmentAmount) {
      text = text.replace(/\[Số_Tiền_Bên_B_Góp\]/g, contractData.investmentAmount);
      text = text.replace(/400\.000\.000 VNĐ/g, contractData.investmentAmount);
    }
    if (contractData.equityPercentage) {
      text = text.replace(/\[\.\.\. %\]/g, contractData.equityPercentage);
      text = text.replace(/14,29%/g, contractData.equityPercentage);
    }
    if (contractData.investorId) {
      text = text.replace(/Số CMND \/ CCCD \/ MST:\s*\.{5,}/g, `Số CMND / CCCD / MST: ${contractData.investorId}`);
    }
    if (contractData.investorAddress) {
      text = text.replace(/Địa chỉ thường trú\/Trụ sở:\s*\.{5,}/g, `Địa chỉ thường trú/Trụ sở: ${contractData.investorAddress}`);
    }
    if (contractData.investorPhone || contractData.investorEmail) {
      text = text.replace(/Điện thoại \/ Email:\s*\.{5,}/g, `Điện thoại / Email: ${contractData.investorPhone || '...'} | ${contractData.investorEmail || '...'}`);
    }
    if (contractData.investorBankAccount || contractData.investorBankName) {
      text = text.replace(/Số tài khoản nhận lợi nhuận:\s*STK:\s*tại Ngân hàng/g, `Số tài khoản nhận lợi nhuận: STK ${contractData.investorBankAccount || '...'} tại Ngân hàng ${contractData.investorBankName || '...'}`);
    }

    setEditedText(text);
    if (goToPreview) {
      setActiveTab("formatted");
    }
  };

  // Tải file docx
  const handleDownloadDocx = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            ...contractData,
            customFullText: activeTab === "editor" ? editedText : undefined,
          },
          filename: `Hop_Dong_Dau_Tu_AFTER_HOURS_${(contractData.investorName || 'Investor').replace(/\s+/g, '_')}.docx`,
        }),
      });

      if (!response.ok) throw new Error("Tải file thất bại");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Hop_Dong_Dau_Tu_AFTER_HOURS_${(contractData.investorName || 'Investor').replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download docx error:", err);
      window.open("/api/contract?download=raw&type=docx", "_blank");
    } finally {
      setIsExporting(false);
    }
  };

  // Tải file PDF
  const handleDownloadPdf = () => {
    window.open("/api/contract?download=raw&type=pdf", "_blank");
  };

  // Sao chép toàn bộ văn bản
  const handleCopyText = () => {
    navigator.clipboard.writeText(editedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Reset về bản gốc
  const handleReset = () => {
    setEditedText(rawText);
    setContractData(DEFAULT_CONTRACT_DATA);
    setSelectedPackageId("sample");
  };

  // Gửi vào chat
  const handleSendToChat = () => {
    if (onSendToChat) {
      const summary = `Tôi đã xem và tùy chỉnh thông tin hợp đồng đầu tư:
- Nhà đầu tư: ${contractData.investorName || 'Chưa cập nhật'}
- CCCD/MST: ${contractData.investorId || 'Chưa cập nhật'}
- Góp vốn: ${contractData.investmentAmount || '400.000.000 VNĐ'} (${contractData.equityPercentage || '14.29%'} cổ phần)
- Số điện thoại/Email: ${contractData.investorPhone || ''} | ${contractData.investorEmail || ''}
- Số TK nhận lợi nhuận: ${contractData.investorBankAccount || ''} (${contractData.investorBankName || ''})
Vui lòng hướng dẫn tôi các bước tiếp theo để chuẩn bị ký kết!`;
      onSendToChat(summary);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md"
        data-prevent-hero-scroll="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl h-[94vh] max-h-[900px] flex flex-col rounded-2xl border border-neutral-700/70 bg-neutral-900 shadow-2xl shadow-black/80 overflow-hidden text-neutral-100 font-sans"
          style={{ fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-700/70 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                    Dự Thảo Hợp Đồng Hợp Tác Đầu Tư
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-medium">
                    <ShieldCheck className="w-3 h-3" /> Investor Preview
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Dự án Nhà hàng AFTER HOURS – Modern Dining (08 Nguyễn Gia Trí, Q. Bình Thạnh)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Bar / Tabs & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 sm:px-6 py-2.5 bg-neutral-950/90 border-b border-neutral-800 text-xs shrink-0">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
              <button
                onClick={() => setActiveTab("formatted")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === "formatted"
                    ? "bg-amber-500 text-black shadow-sm font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Bản In Chuẩn Hóa</span>
              </button>
              <button
                onClick={() => setActiveTab("editor")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === "editor"
                    ? "bg-amber-500 text-black shadow-sm font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Soạn Thảo Tự Do</span>
              </button>
              <button
                onClick={() => setActiveTab("form")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === "form"
                    ? "bg-amber-500 text-black shadow-sm font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Điền Thông Tin Nhà Đầu Tư</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                title="Sao chép toàn bộ nội dung"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isCopied ? "Đã chép" : "Sao chép"}</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                title="Khôi phục bản gốc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Khôi phục</span>
              </button>
              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors border border-neutral-700/50"
              >
                <Printer className="w-3.5 h-3.5 text-red-400" />
                <span>Tải .PDF</span>
              </button>
              <button
                onClick={handleDownloadDocx}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold shadow-md transition-all disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>Tải .DOCX (Word)</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-hidden flex flex-col bg-neutral-950">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <p className="text-sm text-neutral-400">Đang tải bản hợp đồng dự thảo...</p>
              </div>
            ) : activeTab === "formatted" ? (
              /* TAB 1: Formatted Document Layout (Đẹp mắt, chuẩn văn bản luật) */
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex justify-center scrollbar-thin" data-scroll-container="true">
                <div className="w-full max-w-3xl bg-neutral-900/95 border border-neutral-800 rounded-xl p-6 sm:p-10 shadow-2xl text-neutral-200 space-y-6 leading-relaxed">
                  {/* Quốc hiệu & Tiêu ngữ */}
                  <div className="text-center space-y-1 pb-4 border-b border-neutral-800">
                    <p className="font-bold text-sm sm:text-base uppercase tracking-widest text-neutral-100">
                      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </p>
                    <p className="font-semibold text-xs sm:text-sm text-neutral-300">
                      Độc lập – Tự do – Hạnh phúc
                    </p>
                    <p className="text-neutral-500 text-xs">---------------------------------</p>
                    <div className="pt-2">
                      <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                        ✦ BẢN MẪU DỰ THẢO XEM TRƯỚC DÀNH CHO CHỦ ĐẦU TƯ / INVESTOR PREVIEW ✦
                      </span>
                    </div>
                  </div>

                  {/* Tiêu đề Hợp đồng */}
                  <div className="text-center space-y-2 py-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-amber-400 tracking-wide uppercase font-serif">
                      HỢP ĐỒNG HỢP TÁC ĐẦU TƯ KINH DOANH
                    </h1>
                    <h2 className="text-base sm:text-lg font-bold text-white uppercase">
                      DỰ ÁN: NHÀ HÀNG AFTER HOURS – MODERN DINING
                    </h2>
                    <p className="text-xs italic text-neutral-400">
                      Số: {contractData.contractNumber || "AH-INV-2026-001"}/2026/HĐĐT-AFTERHOURS
                    </p>
                    <p className="text-xs italic text-neutral-400">
                      Hôm nay, ngày {contractData.day || "..."} tháng {contractData.month || "..."} năm {contractData.year || "2026"}, tại Trụ sở Nhà hàng After Hours, TP. Hồ Chí Minh.
                    </p>
                  </div>

                  {/* Căn cứ pháp lý */}
                  <div className="p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 text-xs italic text-neutral-400 space-y-1">
                    <p>• Căn cứ Bộ luật Dân sự số 91/2015/QH13 nước CHXHCN Việt Nam;</p>
                    <p>• Căn cứ Luật Doanh nghiệp số 59/2020/QH14 và Luật Đầu tư số 61/2020/QH14;</p>
                    <p>• Căn cứ Luật Thương mại số 36/2005/QH11 và Giấy chứng nhận ĐKKD số 41U8031234 của HKD After Hours;</p>
                    <p>• Căn cứ vào Đề án Khả thi Dự án After Hours Modern Dining và sự thống nhất tự nguyện của các Bên.</p>
                  </div>

                  {/* CÁC BÊN THAM GIA KÝ KẾT */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm sm:text-base text-amber-300 uppercase tracking-wide border-b border-neutral-800 pb-1.5">
                      CÁC BÊN THAM GIA KÝ KẾT:
                    </h3>

                    {/* BÊN A */}
                    <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 text-xs sm:text-sm space-y-1.5">
                      <p className="font-bold text-amber-400 text-sm">
                        BÊN A: BAN SÁNG LẬP & ĐIỀU HÀNH DỰ ÁN AFTER HOURS
                      </p>
                      <p><span className="text-neutral-400">Tên đơn vị:</span> <strong className="text-white">HỘ KINH DOANH AFTER HOURS (DỰ ÁN AFTER HOURS MODERN DINING)</strong></p>
                      <p><span className="text-neutral-400">Giấy phép ĐKKD:</span> Số 41U8031234 do Phòng TC-KH UBND Quận Bình Thạnh cấp ngày 15/06/2024</p>
                      <p><span className="text-neutral-400">Mã số thuế:</span> 8888888888-001 do Cục Thuế TP. Hồ Chí Minh cấp</p>
                      <p><span className="text-neutral-400">Địa chỉ mặt bằng:</span> Số 08 Nguyễn Gia Trí, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh</p>
                      <p><span className="text-neutral-400">Đại diện pháp luật:</span> <strong className="text-white">Ông ĐỖ MINH SƠN</strong> | Chức vụ: Quản lý Điều hành / Đại diện Ban Sáng lập</p>
                      <p><span className="text-neutral-400">Số CCCD:</span> 066303005375 cấp ngày 01/03/2023 tại Cục CS QLHC về TTXH</p>
                      <p><span className="text-neutral-400">Điện thoại / Email:</span> 0386 714 512 | contact@afterhours.vn / founder@afterhours.vn</p>
                    </div>

                    {/* BÊN B */}
                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 text-xs sm:text-sm space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-amber-300 text-sm">
                          BÊN B: NHÀ ĐẦU TƯ / CHỦ ĐẦU TƯ (INVESTOR)
                        </p>
                        <button
                          onClick={() => setActiveTab("form")}
                          className="text-xs text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Sửa thông tin này
                        </button>
                      </div>
                      <p><span className="text-neutral-400">Tên Tổ chức / Cá nhân:</span> <strong className="text-white text-base">{contractData.investorName || "[TÊN CHỦ ĐẦU TƯ]"}</strong></p>
                      <p><span className="text-neutral-400">Số CMND / CCCD / MST:</span> <span className="text-white font-mono">{contractData.investorId || "......................................................."}</span></p>
                      <p><span className="text-neutral-400">Địa chỉ thường trú / Trụ sở:</span> <span className="text-white">{contractData.investorAddress || "......................................................."}</span></p>
                      <p><span className="text-neutral-400">Điện thoại / Email:</span> <span className="text-white">{contractData.investorPhone || "..."} | {contractData.investorEmail || "..."}</span></p>
                      <p><span className="text-neutral-400">Số tài khoản nhận lợi nhuận:</span> <span className="text-white font-mono">STK {contractData.investorBankAccount || "..."} tại Ngân hàng {contractData.investorBankName || "..."}</span></p>
                    </div>
                  </div>

                  {/* ĐIỀU 1 */}
                  <div className="space-y-2 pt-2">
                    <h3 className="font-bold text-sm sm:text-base text-amber-400">
                      ĐIỀU 1: ĐỐI TƯỢNG VÀ QUY MÔ DỰ ÁN HỢP TÁC
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      <strong>1.1. Mục đích:</strong> Bên B tham gia góp vốn đầu tư cùng Bên A để xây dựng, thiết lập và vận hành dự án Nhà hàng Modern Dark Dining mang tên <strong>AFTER HOURS</strong>.<br />
                      <strong>1.2. Địa điểm triển khai:</strong> Số 08 Nguyễn Gia Trí, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh.<br />
                      <strong>1.3. Quy mô kết cấu:</strong> 01 trệt, 02 lầu (120m²/tầng, tổng diện tích sàn 360m²):<br />
                      • Tầng trệt (120m²): Khu giữ xe chuyên biệt (25-30 xe máy) và lối check-in sang trọng.<br />
                      • Tầng 1 (120m²): Không gian ăn uống (45-50 khách), Quầy POS, Bếp mở Open Kitchen chuẩn SOP.<br />
                      • Tầng 2 (120m²): Không gian ăn uống (40-45 khách), Quầy pha chế Mocktail & Soda Signature.<br />
                      <strong>1.4. Tổng sức chứa:</strong> 85 - 95 khách/lượt. Giờ phục vụ: 12:00 PM – 12:00 AM (Phục vụ xuyên đêm).
                    </p>
                  </div>

                  {/* ĐIỀU 2 & BẢNG CAPEX */}
                  <div className="space-y-3 pt-2">
                    <h3 className="font-bold text-sm sm:text-base text-amber-400">
                      ĐIỀU 2: TỔNG VỐN ĐẦU TƯ VÀ CƠ CẤU PHÂN BỔ (CAPEX + OPEX)
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300">
                      <strong>2.1. Tổng mức đầu tư toàn bộ dự án:</strong> <strong className="text-amber-300">2.800.000.000 VNĐ</strong> (Hai tỷ tám trăm triệu đồng chẵn).<br />
                      <strong>2.2. Cơ cấu phân bổ nguồn vốn theo Đề án khả thi chuẩn:</strong>
                    </p>

                    {/* Bảng CAPEX 9 hạng mục */}
                    <div className="overflow-x-auto rounded-lg border border-neutral-700/80">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-neutral-800 text-neutral-200 font-semibold uppercase tracking-wider border-b border-neutral-700">
                          <tr>
                            <th className="py-2.5 px-3 text-center w-10">STT</th>
                            <th className="py-2.5 px-3">Hạng Mục Đầu Tư</th>
                            <th className="py-2.5 px-3 text-right">Ngân Sách (VNĐ)</th>
                            <th className="py-2.5 px-3 text-center">Tỷ Lệ</th>
                            <th className="py-2.5 px-3">Ghi Chú</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800 text-neutral-300 bg-neutral-950/40">
                          <tr><td className="py-2 px-3 text-center">1</td><td className="py-2 px-3 font-medium text-white">Thiết bị bếp, nội thất & bàn ghế 3 tầng</td><td className="py-2 px-3 text-right font-mono">728.100.000</td><td className="py-2 px-3 text-center">26,00%</td><td className="py-2 px-3 text-neutral-400">Chi tiết bốc tách</td></tr>
                          <tr><td className="py-2 px-3 text-center">2</td><td className="py-2 px-3 font-medium text-white">Cải tạo, hoàn thiện thô, hút khói & decor</td><td className="py-2 px-3 text-right font-mono">350.000.000</td><td className="py-2 px-3 text-center">12,50%</td><td className="py-2 px-3 text-neutral-400">20-25 ngày thi công</td></tr>
                          <tr><td className="py-2 px-3 text-center">3</td><td className="py-2 px-3 font-medium text-white">Đặt cọc & tiền thuê mặt bằng ban đầu</td><td className="py-2 px-3 text-right font-mono">240.000.000</td><td className="py-2 px-3 text-center">8,57%</td><td className="py-2 px-3 text-neutral-400">Cọc + tháng đầu</td></tr>
                          <tr><td className="py-2 px-3 text-center">4</td><td className="py-2 px-3 font-medium text-white">Nguyên vật liệu & hàng hóa mở bán đợt đầu</td><td className="py-2 px-3 text-right font-mono">100.000.000</td><td className="py-2 px-3 text-center">3,57%</td><td className="py-2 px-3 text-neutral-400">Mega Market / Annam</td></tr>
                          <tr><td className="py-2 px-3 text-center">5</td><td className="py-2 px-3 font-medium text-white">Marketing, truyền thông & Grand Opening</td><td className="py-2 px-3 text-right font-mono">120.000.000</td><td className="py-2 px-3 text-center">4,29%</td><td className="py-2 px-3 text-neutral-400">KOLs / TikTok Food</td></tr>
                          <tr><td className="py-2 px-3 text-center">6</td><td className="py-2 px-3 font-medium text-white">Giấy phép ATTP, PCCC, phần mềm POS</td><td className="py-2 px-3 text-right font-mono">60.000.000</td><td className="py-2 px-3 text-center">2,14%</td><td className="py-2 px-3 text-neutral-400">Đầy đủ pháp lý</td></tr>
                          <tr><td className="py-2 px-3 text-center">7</td><td className="py-2 px-3 font-medium text-white">Đồng phục nhận diện & Đào tạo nghiệp vụ</td><td className="py-2 px-3 text-right font-mono">31.900.000</td><td className="py-2 px-3 text-center">1,14%</td><td className="py-2 px-3 text-neutral-400">23 nhân sự</td></tr>
                          <tr><td className="py-2 px-3 text-center">8</td><td className="py-2 px-3 font-medium text-white">Quỹ chi phí nhân sự bảo đảm 03 tháng đầu</td><td className="py-2 px-3 text-right font-mono">705.000.000</td><td className="py-2 px-3 text-center">25,18%</td><td className="py-2 px-3 text-neutral-400">235 tr/tháng x 3</td></tr>
                          <tr><td className="py-2 px-3 text-center">9</td><td className="py-2 px-3 font-medium text-white">Vốn lưu động dự phòng rủi ro</td><td className="py-2 px-3 text-right font-mono">465.000.000</td><td className="py-2 px-3 text-center">16,61%</td><td className="py-2 px-3 text-neutral-400">Phao cứu sinh</td></tr>
                          <tr className="bg-neutral-800/80 font-bold text-amber-300">
                            <td colSpan={2} className="py-2.5 px-3 text-center">TỔNG MỨC ĐẦU TƯ DỰ ÁN</td>
                            <td className="py-2.5 px-3 text-right font-mono">2.800.000.000</td>
                            <td className="py-2.5 px-3 text-center">100,00%</td>
                            <td className="py-2.5 px-3 text-neutral-400">-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Vốn góp bên B */}
                    <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-xs sm:text-sm space-y-1">
                      <p><strong>2.3. Tỷ lệ tham gia góp vốn của Bên B:</strong></p>
                      <p>• Số tiền góp vốn của Bên B: <strong className="text-amber-300 text-base">{contractData.investmentAmount || "400.000.000 VNĐ"}</strong> (Bằng chữ: <em>{contractData.investmentAmountWords || "Bốn trăm triệu đồng chẵn"}</em>).</p>
                      <p>• Tỷ lệ sở hữu phần vốn góp tại Dự án: <strong className="text-amber-300 text-base">{contractData.equityPercentage || "14,29%"}</strong>.</p>
                      <p className="text-neutral-400 pt-1 text-xs leading-normal">
                        <strong>2.4. Tiến độ góp vốn của Bên B:</strong><br />
                        - Đợt 1 (40% vốn): Ngay sau khi ký hợp đồng chính thức để giải ngân mặt bằng và cải tạo thô.<br />
                        - Đợt 2 (40% vốn): Sau 15 ngày kể từ Đợt 1, khi hoàn tất phần thô và lắp đặt thiết bị bếp, bàn ghế.<br />
                        - Đợt 3 (20% còn lại): Trong vòng 03 ngày trước ngày Soft Opening để nhập kho nguyên liệu và chạy thử.
                      </p>
                    </div>
                  </div>

                  {/* ĐIỀU 3 */}
                  <div className="space-y-2 pt-2">
                    <h3 className="font-bold text-sm sm:text-base text-amber-400">
                      ĐIỀU 3: CHÍNH SÁCH PHÂN CHIA LỢI NHUẬN VÀ BÁO CÁO TÀI CHÍNH
                    </h3>
                    <div className="text-xs sm:text-sm text-neutral-300 space-y-2 leading-relaxed">
                      <p><strong>3.1. Chỉ tiêu tài chính mục tiêu:</strong> Doanh thu kỳ vọng 700 triệu/tháng (~65-70 khách/ngày; Bill TB 325.000 - 350.000đ); Food cost định mức 35% (Gross Profit 65%); Chi phí vận hành OPEX ~350 triệu/tháng; Điểm hòa vốn BEP 492 triệu/tháng (~51 khách/ngày); Lợi nhuận ròng dự kiến ~100 triệu/tháng (~1,2 tỷ VNĐ/năm).</p>
                      <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 space-y-1">
                        <p className="font-semibold text-amber-300">3.2. Cơ chế phân chia lợi nhuận ưu tiên hoàn vốn cho Nhà Đầu Tư (Payback Accelerator):</p>
                        <p>• <strong>Giai đoạn 1 (Thu hồi vốn):</strong> Dành <strong className="text-amber-300">85% Tổng Lợi Nhuận Ròng</strong> hàng tháng để chi trả cho các Nhà đầu tư theo tỷ lệ vốn góp cho đến khi Bên B hoàn lại đủ 100% số vốn góp ban đầu.</p>
                        <p>• <strong>Giai đoạn 2 (Sau khi hoàn vốn):</strong> Toàn bộ Lợi nhuận ròng được phân chia đúng theo <strong>Tỷ lệ sở hữu vốn thực tế ({contractData.equityPercentage || "14,29%"})</strong> xuyên suốt thời hạn hợp tác.</p>
                      </div>
                      <p><strong>3.3. Kỳ chi trả lợi nhuận:</strong> Định kỳ ngày 15 hàng tháng qua tài khoản ngân hàng chỉ định của Bên B.</p>
                      <p><strong>3.4. Minh bạch số liệu:</strong> Bên A cung cấp tài khoản Read-Only trên hệ thống POS/ERP để Bên B theo dõi realtime; gửi Báo cáo P&L có chứng từ đối soát trước ngày 10 hàng tháng.</p>
                    </div>
                  </div>

                  {/* ĐIỀU 4, 5, 6 */}
                  <div className="space-y-3 pt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    <div>
                      <h3 className="font-bold text-amber-400 mb-1">ĐIỀU 4: PHÂN ĐỊNH TRÁCH NHIỆM & QUYỀN HẠN</h3>
                      <p>• <strong>Trách nhiệm Bên A:</strong> Toàn quyền điều hành hoạt động thường nhật: quản trị bếp, thực đơn, food cost, tiêu chuẩn ATTP/PCCC. Quản lý 23 nhân sự. Bảo toàn Quỹ dự phòng rủi ro 465 triệu đồng.<br />
                      • <strong>Quyền hạn Bên B:</strong> Đóng góp vốn đúng hạn. Có quyền giám sát tài chính, kiểm tra kế toán, đối soát doanh thu bất kỳ lúc nào. Không can thiệp vào vận hành tác nghiệp ẩm thực trực tiếp.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-amber-400 mb-1">ĐIỀU 5: THỜI HẠN, CHUYỂN NHƯỢNG VÀ THOÁI VỐN (EXIT STRATEGY)</h3>
                      <p>• <strong>Thời hạn hợp đồng:</strong> 05 (năm) năm kể từ ngày ký. Ưu tiên gia hạn theo hợp đồng thuê mặt bằng.<br />
                      • <strong>Điều khoản thoái vốn:</strong> Sau 12 tháng kể từ ngày Grand Opening, Bên B có quyền chuyển nhượng phần vốn góp cho bên thứ ba. Ban sáng lập Bên A giữ quyền ưu tiên mua lại (Right of First Refusal) theo giá trị thẩm định tài sản tại thời điểm chuyển nhượng.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-amber-400 mb-1">ĐIỀU 6: HIỆU LỰC HỢP ĐỒNG VÀ CHỮ KÝ</h3>
                      <p>Hợp đồng được lập thành 04 (bốn) bản có giá trị pháp lý tương đương, mỗi bên giữ 02 (hai) bản để thực hiện.</p>
                    </div>
                  </div>

                  {/* Phần Chữ Ký 2 Cột */}
                  <div className="pt-6 border-t border-neutral-800 grid grid-cols-2 gap-6 text-center text-xs sm:text-sm">
                    <div className="space-y-16">
                      <div>
                        <p className="font-bold text-white uppercase">ĐẠI DIỆN BÊN A</p>
                        <p className="text-xs text-neutral-400 italic">(Ký, đóng dấu và ghi rõ họ tên)</p>
                      </div>
                      <div>
                        <p className="font-bold text-amber-300">ĐỖ MINH SƠN</p>
                        <p className="text-xs text-neutral-400">Đại diện HKD After Hours / Quản lý Điều hành</p>
                      </div>
                    </div>

                    <div className="space-y-16">
                      <div>
                        <p className="font-bold text-white uppercase">ĐẠI DIỆN BÊN B</p>
                        <p className="text-xs text-neutral-400 italic">(Ký, ghi rõ họ tên / Đóng dấu nếu là pháp nhân)</p>
                      </div>
                      <div>
                        <p className="font-bold text-amber-300">{contractData.investorName || "[HỌ TÊN CHỦ ĐẦU TƯ]"}</p>
                        <p className="text-xs text-neutral-400">Nhà Đầu Tư (Investor)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === "editor" ? (
              /* TAB 2: Textarea Editor (Soạn thảo tự do) */
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex justify-center scrollbar-thin" data-scroll-container="true">
                <div className="w-full max-w-3xl bg-neutral-900/95 border border-neutral-800 rounded-xl p-5 sm:p-8 shadow-xl flex flex-col">
                  <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-neutral-800 text-xs text-neutral-400 shrink-0">
                    <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                      <Edit3 className="w-4 h-4" /> Trình soạn thảo văn bản tự do
                    </span>
                    <span>Hỗ trợ sửa đổi từng câu chữ trước khi xuất file</span>
                  </div>

                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full flex-1 min-h-[500px] bg-transparent text-neutral-200 font-serif text-[15px] leading-relaxed resize-none focus:outline-none scrollbar-thin border-0 p-0"
                    style={{ lineHeight: "1.8" }}
                    placeholder="Nội dung hợp đồng..."
                  />
                </div>
              </div>
            ) : (
              /* TAB 3: Quick Form (Điền thông tin Nhà đầu tư & Chọn gói) */
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 scrollbar-thin" data-scroll-container="true">
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Alert success if package selected */}
                  {formSuccessMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-xs font-semibold flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{formSuccessMessage}</span>
                    </motion.div>
                  )}

                  {/* Gói đầu tư nhanh */}
                  <div className="p-4 sm:p-5 rounded-xl bg-neutral-900 border border-neutral-800">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-amber-400" />
                        Chọn Nhanh Gói Đầu Tư Dự Án
                      </h3>
                      <span className="text-xs text-neutral-400">Click để tự động điền</span>
                    </div>
                    <p className="text-xs text-neutral-400 mb-3">
                      Các gói được tính toán chuẩn theo Đề án khả thi 2.8 tỷ của Nhà hàng AFTER HOURS.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {INVESTMENT_PACKAGES.map((pkg) => {
                        const isSelected = selectedPackageId === pkg.id || contractData.investmentAmount === pkg.amount;
                        return (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => handleSelectPackage(pkg)}
                            className={`text-left p-3.5 rounded-xl border transition-all relative ${
                              isSelected
                                ? "border-amber-500 bg-amber-500/15 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50"
                                : "border-neutral-700/80 bg-neutral-800/40 hover:border-amber-500/40 hover:bg-neutral-800/80"
                            }`}
                          >
                            {pkg.badge && (
                              <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-amber-500 text-black">
                                {pkg.badge}
                              </span>
                            )}
                            <p className="text-xs font-bold text-amber-300">{pkg.name}</p>
                            <p className="text-sm font-extrabold text-white mt-1">{pkg.amount.replace(" VNĐ", "")}</p>
                            <p className="text-[11px] text-neutral-300 mt-0.5">{pkg.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Form thông tin bên B */}
                  <div className="p-4 sm:p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-2.5">
                      <User className="w-4 h-4 text-amber-400" />
                      Thông Tin Bên B (Nhà Đầu Tư)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Họ và Tên / Tên Pháp Nhân *
                        </label>
                        <input
                          type="text"
                          value={contractData.investorName || ""}
                          onChange={(e) => setContractData({ ...contractData, investorName: e.target.value })}
                          placeholder="Ví dụ: NGUYỄN VĂN A"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Số CMND / CCCD / Mã Số Thuế *
                        </label>
                        <input
                          type="text"
                          value={contractData.investorId || ""}
                          onChange={(e) => setContractData({ ...contractData, investorId: e.target.value })}
                          placeholder="Số CCCD 079..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Số Điện Thoại Liên Hệ
                        </label>
                        <input
                          type="text"
                          value={contractData.investorPhone || ""}
                          onChange={(e) => setContractData({ ...contractData, investorPhone: e.target.value })}
                          placeholder="090..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Email Nhận Báo Cáo Tài Chính (P&L)
                        </label>
                        <input
                          type="email"
                          value={contractData.investorEmail || ""}
                          onChange={(e) => setContractData({ ...contractData, investorEmail: e.target.value })}
                          placeholder="investor@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Địa Chỉ Thường Trú / Trụ Sở
                        </label>
                        <input
                          type="text"
                          value={contractData.investorAddress || ""}
                          onChange={(e) => setContractData({ ...contractData, investorAddress: e.target.value })}
                          placeholder="Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/TP"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Số Tài Khoản Nhận Lợi Nhuận Hàng Tháng
                        </label>
                        <input
                          type="text"
                          value={contractData.investorBankAccount || ""}
                          onChange={(e) => setContractData({ ...contractData, investorBankAccount: e.target.value })}
                          placeholder="Số tài khoản ngân hàng..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Ngân Hàng
                        </label>
                        <input
                          type="text"
                          value={contractData.investorBankName || ""}
                          onChange={(e) => setContractData({ ...contractData, investorBankName: e.target.value })}
                          placeholder="Techcombank, Vietcombank, MB Bank..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Giá trị đầu tư & tỷ lệ */}
                  <div className="p-4 sm:p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-2.5">
                      <Building className="w-4 h-4 text-amber-400" />
                      Thông Số Góp Vốn & Tỷ Lệ Sở Hữu
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Số Tiền Góp Vốn (VNĐ)
                        </label>
                        <input
                          type="text"
                          value={contractData.investmentAmount || ""}
                          onChange={(e) => setContractData({ ...contractData, investmentAmount: e.target.value })}
                          placeholder="400.000.000 VNĐ"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Tỷ Lệ Sở Hữu Phần Vốn Góp (%)
                        </label>
                        <input
                          type="text"
                          value={contractData.equityPercentage || ""}
                          onChange={(e) => setContractData({ ...contractData, equityPercentage: e.target.value })}
                          placeholder="14,29%"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800">
                      <p className="text-xs text-neutral-400">
                        * Dữ liệu điền sẽ tự động đồng bộ vào toàn bộ các điều khoản của Hợp đồng.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleApplyForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Áp Dụng & Chuyển Sang Xem Hợp Đồng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-neutral-800 bg-neutral-900/95 text-xs shrink-0">
            <div className="flex items-center gap-2 text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Bảo mật 100% • Hợp đồng có giá trị pháp lý khi ký chính thức</span>
            </div>

            <div className="flex items-center gap-2">
              {onSendToChat && (
                <button
                  onClick={handleSendToChat}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition-colors border border-neutral-700"
                >
                  <span>Gửi Thông Tin Vào Chat</span>
                </button>
              )}
              <button
                onClick={handleDownloadDocx}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Tải File Hợp Đồng (.DOCX)</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
