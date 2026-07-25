// src/pages/BaoCao.jsx
import React, { useState } from 'react';
import { taoBaoCaoTuDong } from '../utils/baoCaoAssistant';

export default function BaoCao() {
  const [tuNgay, setTuNgay] = useState('');
  const [denNgay, setDenNgay] = useState('');
  const [dangTao, setDangTao] = useState(false);
  const [loi, setLoi] = useState('');
  const [ketQua, setKetQua] = useState(null);

  async function xuLyTaoBaoCao(e) {
    e.preventDefault();
    if (!tuNgay || !denNgay) {
      setLoi('Vui lòng chọn đầy đủ khoảng thời gian.');
      return;
    }
    setDangTao(true);
    setLoi('');
    setKetQua(null);

    try {
      const kq = await taoBaoCaoTuDong(tuNgay, denNgay, 'Trường THPT Khánh Lâm');
      setKetQua(kq);
    } catch (err) {
      setLoi('Không thể tạo báo cáo: ' + err.message);
    } finally {
      setDangTao(false);
    }
  }

  function saoChepBaoCao() {
    if (ketQua?.noiDungBaoCao) {
      navigator.clipboard.writeText(ketQua.noiDungBaoCao);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Trợ lý Báo cáo tự động
        </h2>

        {loi && <p className="text-sm text-red-600 mb-3">{loi}</p>}

        <form onSubmit={xuLyTaoBaoCao} className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-sm text-gray-600">Từ ngày</label>
            <input
              type="date"
              value={tuNgay}
              onChange={(e) => setTuNgay(e.target.value)}
              className="mt-1 border rounded-lg px-3 py-2 text-sm block"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Đến ngày</label>
            <input
              type="date"
              value={denNgay}
              onChange={(e) => setDenNgay(e.target.value)}
              className="mt-1 border rounded-lg px-3 py-2 text-sm block"
            />
          </div>
          <button
            type="submit"
            disabled={dangTao}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300"
          >
            {dangTao ? 'Đang tổng hợp...' : 'Tạo báo cáo'}
          </button>
        </form>
      </div>

      {ketQua && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Kết quả báo cáo</h3>
            <button
              onClick={saoChepBaoCao}
              className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50"
            >
              Sao chép nội dung
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-blue-700">
                {ketQua.soLieu.tongVanBanDen}
              </p>
              <p className="text-xs text-gray-500">Văn bản đến</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-700">
                {ketQua.soLieu.tongVanBanDi}
              </p>
              <p className="text-xs text-gray-500">Văn bản đi</p>
            </div>
          </div>

          <textarea
            readOnly
            value={ketQua.noiDungBaoCao}
            rows={18}
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono bg-gray-50"
          />
          <p className="text-xs text-gray-400 mt-2">
            Bạn có thể chỉnh sửa nội dung này khi dán vào Word trước khi trình ký.
          </p>
        </div>
      )}
    </div>
  );
}
