// src/utils/baoCaoAssistant.js
// Module "Trợ lý Báo cáo tự động"
// Tổng hợp số liệu văn bản đi/đến trong một khoảng thời gian
// và sinh ra nội dung báo cáo hành chính dạng văn bản có thể chỉnh sửa/in ra.

import { supabase } from '../supabaseClient';

/**
 * Lấy số liệu thống kê văn bản đến/đi trong khoảng thời gian [tuNgay, denNgay]
 * @param {string} tuNgay - định dạng 'YYYY-MM-DD'
 * @param {string} denNgay - định dạng 'YYYY-MM-DD'
 */
export async function layThongKeVanBan(tuNgay, denNgay) {
  const { data: vanBanDen, error: loi1 } = await supabase
    .from('cong_van_den')
    .select('*')
    .gte('ngay_van_ban', tuNgay)
    .lte('ngay_van_ban', denNgay);

  if (loi1) throw loi1;

  const { data: vanBanDi, error: loi2 } = await supabase
    .from('cong_van_di')
    .select('*')
    .gte('ngay_van_ban', tuNgay)
    .lte('ngay_van_ban', denNgay);

  if (loi2) throw loi2;

  return { vanBanDen: vanBanDen || [], vanBanDi: vanBanDi || [] };
}

/**
 * Đếm số lượng theo trạng thái
 */
function demTheoTrangThai(danhSach) {
  return danhSach.reduce((acc, vb) => {
    const key = vb.trang_thai || 'Không rõ';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Đếm số lượng theo loại văn bản
 */
function demTheoLoai(danhSach) {
  return danhSach.reduce((acc, vb) => {
    const key = vb.loai_van_ban || 'Khác';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function formatNgayVN(ngayISO) {
  if (!ngayISO) return '';
  const d = new Date(ngayISO);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/**
 * Sinh nội dung báo cáo hành chính (dạng text thuần, theo văn phong hành chính VN)
 * Có thể copy vào Word hoặc dùng chung với thư viện docx để xuất file.
 */
export function soanNoiDungBaoCao({ vanBanDen, vanBanDi, tuNgay, denNgay, donVi = 'Trường THPT Khánh Lâm' }) {
  const tongDen = vanBanDen.length;
  const tongDi = vanBanDi.length;

  const trangThaiDen = demTheoTrangThai(vanBanDen);
  const trangThaiDi = demTheoTrangThai(vanBanDi);
  const loaiDen = demTheoLoai(vanBanDen);
  const loaiDi = demTheoLoai(vanBanDi);

  const soChuaXuLy = trangThaiDen['Chưa xử lý'] || 0;
  const soDangXuLy = trangThaiDen['Đang xử lý'] || 0;
  const soDaXuLy = trangThaiDen['Đã xử lý'] || 0;

  const dongThongKeLoai = (obj) =>
    Object.entries(obj)
      .map(([loai, soLuong]) => `   + ${loai}: ${soLuong} văn bản`)
      .join('\n');

  const noiDung = `
BÁO CÁO CÔNG TÁC VĂN THƯ, LƯU TRỮ
(Từ ngày ${formatNgayVN(tuNgay)} đến ngày ${formatNgayVN(denNgay)})

Đơn vị: ${donVi}

I. VĂN BẢN ĐẾN
Tổng số văn bản đến: ${tongDen} văn bản.
Phân loại theo loại văn bản:
${dongThongKeLoai(loaiDen) || '   (Không có dữ liệu)'}

Tình hình xử lý:
   + Đã xử lý: ${soDaXuLy} văn bản
   + Đang xử lý: ${soDangXuLy} văn bản
   + Chưa xử lý: ${soChuaXuLy} văn bản

II. VĂN BẢN ĐI
Tổng số văn bản đi: ${tongDi} văn bản.
Phân loại theo loại văn bản:
${dongThongKeLoai(loaiDi) || '   (Không có dữ liệu)'}

Tình hình ban hành:
${dongThongKeLoai(trangThaiDi) || '   (Không có dữ liệu)'}

III. ĐÁNH GIÁ CHUNG
${soChuaXuLy > 0
    ? `Còn ${soChuaXuLy} văn bản đến chưa được xử lý, cần bộ phận liên quan khẩn trương xem xét, tham mưu xử lý theo quy định.`
    : `Toàn bộ văn bản đến trong kỳ đã được xử lý kịp thời, không có tồn đọng.`}

IV. KIẾN NGHỊ, ĐỀ XUẤT
- Tiếp tục theo dõi, đôn đốc xử lý văn bản đến đúng thời hạn.
- Rà soát, lưu trữ đầy đủ văn bản đi/đến theo quy định về công tác văn thư.

Nơi lập báo cáo: ${donVi}
Ngày lập báo cáo: ${formatNgayVN(new Date().toISOString())}
`.trim();

  return noiDung;
}

/**
 * Hàm tổng hợp — gọi 1 lần để lấy dữ liệu + sinh báo cáo
 */
export async function taoBaoCaoTuDong(tuNgay, denNgay, donVi) {
  const { vanBanDen, vanBanDi } = await layThongKeVanBan(tuNgay, denNgay);
  const noiDungBaoCao = soanNoiDungBaoCao({ vanBanDen, vanBanDi, tuNgay, denNgay, donVi });

  return {
    soLieu: {
      tongVanBanDen: vanBanDen.length,
      tongVanBanDi: vanBanDi.length,
      chiTietDen: vanBanDen,
      chiTietDi: vanBanDi,
    },
    noiDungBaoCao,
  };
}

/*
CÁCH DÙNG trong component React, VÍ DỤ:

import { taoBaoCaoTuDong } from '../utils/baoCaoAssistant';

async function xuLyTaoBaoCao() {
  const ketQua = await taoBaoCaoTuDong('2026-01-01', '2026-07-25', 'Trường THPT Khánh Lâm');
  console.log(ketQua.noiDungBaoCao); // Hiển thị trong <textarea> để Hiệu trưởng chỉnh sửa trước khi ký
}
*/
