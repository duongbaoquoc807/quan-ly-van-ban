// src/pages/VanBanDi.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import UploadCongVan from '../components/UploadCongVan';

const TRANG_THAI_OPTIONS = ['Dự thảo', 'Đã ban hành', 'Đã gửi'];

export default function VanBanDi() {
  const [danhSach, setDanhSach] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState('');

  const [form, setForm] = useState({
    so_ky_hieu: '',
    ngay_van_ban: '',
    noi_nhan: '',
    trich_yeu: '',
    loai_van_ban: '',
    nguoi_ky: '',
    trang_thai: 'Dự thảo',
    duong_dan_tep: '',
  });
  const [dangLuu, setDangLuu] = useState(false);

  async function taiDanhSach() {
    setDangTai(true);
    setLoi('');
    const { data, error } = await supabase
      .from('cong_van_di')
      .select('*')
      .order('ngay_van_ban', { ascending: false });

    if (error) {
      setLoi('Không tải được danh sách: ' + error.message);
    } else {
      setDanhSach(data || []);
    }
    setDangTai(false);
  }

  useEffect(() => {
    taiDanhSach();
  }, []);

  function capNhatForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function themVanBan(e) {
    e.preventDefault();
    if (!form.so_ky_hieu || !form.ngay_van_ban || !form.noi_nhan || !form.trich_yeu) {
      setLoi('Vui lòng điền đủ các trường bắt buộc (Số ký hiệu, Ngày, Nơi nhận, Trích yếu).');
      return;
    }

    setDangLuu(true);
    setLoi('');
    const { error } = await supabase.from('cong_van_di').insert([form]);

    if (error) {
      setLoi('Lưu thất bại: ' + error.message);
    } else {
      setForm({
        so_ky_hieu: '',
        ngay_van_ban: '',
        noi_nhan: '',
        trich_yeu: '',
        loai_van_ban: '',
        nguoi_ky: '',
        trang_thai: 'Dự thảo',
        duong_dan_tep: '',
      });
      await taiDanhSach();
    }
    setDangLuu(false);
  }

  async function doiTrangThai(id, trangThaiMoi) {
    const { error } = await supabase
      .from('cong_van_di')
      .update({ trang_thai: trangThaiMoi })
      .eq('id', id);

    if (error) {
      setLoi('Cập nhật trạng thái thất bại: ' + error.message);
    } else {
      taiDanhSach();
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Thêm văn bản đi</h2>

        {loi && <p className="text-sm text-red-600 mb-3">{loi}</p>}

        <form onSubmit={themVanBan} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Số ký hiệu *</label>
            <input
              name="so_ky_hieu"
              value={form.so_ky_hieu}
              onChange={capNhatForm}
              placeholder="VD: 45/BC-THPTKL"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Ngày văn bản *</label>
            <input
              type="date"
              name="ngay_van_ban"
              value={form.ngay_van_ban}
              onChange={capNhatForm}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Nơi nhận *</label>
            <input
              name="noi_nhan"
              value={form.noi_nhan}
              onChange={capNhatForm}
              placeholder="VD: Sở GD&ĐT tỉnh"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Loại văn bản</label>
            <input
              name="loai_van_ban"
              value={form.loai_van_ban}
              onChange={capNhatForm}
              placeholder="VD: Báo cáo, Kế hoạch..."
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Người ký</label>
            <input
              name="nguoi_ky"
              value={form.nguoi_ky}
              onChange={capNhatForm}
              placeholder="VD: Hiệu trưởng Nguyễn Văn A"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm text-gray-600">Trích yếu *</label>
            <textarea
              name="trich_yeu"
              value={form.trich_yeu}
              onChange={capNhatForm}
              rows={2}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <UploadCongVan
              loaiVanBan="di"
              onUploadSuccess={(result) =>
                setForm((f) => ({ ...f, duong_dan_tep: result.path }))
              }
            />
            {form.duong_dan_tep && (
              <p className="text-xs text-green-600 mt-1">
                Đã đính kèm: {form.duong_dan_tep}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={dangLuu}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300"
            >
              {dangLuu ? 'Đang lưu...' : 'Lưu văn bản đi'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Danh sách văn bản đi ({danhSach.length})
        </h2>

        {dangTai ? (
          <p className="text-sm text-gray-400">Đang tải...</p>
        ) : danhSach.length === 0 ? (
          <p className="text-sm text-gray-400">Chưa có văn bản nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-3">Số ký hiệu</th>
                  <th className="py-2 pr-3">Ngày</th>
                  <th className="py-2 pr-3">Nơi nhận</th>
                  <th className="py-2 pr-3">Trích yếu</th>
                  <th className="py-2 pr-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {danhSach.map((vb) => (
                  <tr key={vb.id} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-medium">{vb.so_ky_hieu}</td>
                    <td className="py-2 pr-3">{vb.ngay_van_ban}</td>
                    <td className="py-2 pr-3">{vb.noi_nhan}</td>
                    <td className="py-2 pr-3 max-w-xs truncate" title={vb.trich_yeu}>
                      {vb.trich_yeu}
                    </td>
                    <td className="py-2 pr-3">
                      <select
                        value={vb.trang_thai}
                        onChange={(e) => doiTrangThai(vb.id, e.target.value)}
                        className="border rounded-md px-2 py-1 text-xs"
                      >
                        {TRANG_THAI_OPTIONS.map((tt) => (
                          <option key={tt} value={tt}>
                            {tt}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
