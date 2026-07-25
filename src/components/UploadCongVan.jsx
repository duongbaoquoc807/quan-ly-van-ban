// src/components/UploadCongVan.jsx
// Component tải tệp đính kèm (PDF, Word) lên Supabase Storage bucket "cong-van"
// và trả về đường dẫn để lưu vào cột duong_dan_tep của bảng cong_van_den / cong_van_di

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const BUCKET_NAME = 'cong-van';

// Các định dạng file được phép tải lên
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
];

const MAX_FILE_SIZE_MB = 15;

export default function UploadCongVan({ loaiVanBan = 'den', onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setError('');
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError('Chỉ chấp nhận file PDF hoặc Word (.doc, .docx).');
      setFile(null);
      return;
    }

    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File quá lớn. Kích thước tối đa là ${MAX_FILE_SIZE_MB}MB.`);
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Vui lòng chọn tệp trước khi tải lên.');
      return;
    }

    setUploading(true);
    setProgressText('Đang tải lên...');
    setError('');

    try {
      // Tạo đường dẫn file duy nhất: van-ban-den/2026/07/uuid_tenfile.pdf
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const uniquePrefix = Date.now();
      const folder = loaiVanBan === 'den' ? 'van-ban-den' : 'van-ban-di';
      const filePath = `${folder}/${year}/${month}/${uniquePrefix}_${safeFileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Lấy public URL (nếu bucket là public) hoặc lưu path để tạo signed URL sau này
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      setProgressText('Tải lên thành công!');

      if (onUploadSuccess) {
        onUploadSuccess({
          path: filePath,
          publicUrl: publicUrlData?.publicUrl || null,
          fileName: file.name,
        });
      }
    } catch (err) {
      console.error('Lỗi khi tải file:', err);
      setError('Tải file thất bại: ' + err.message);
      setProgressText('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tệp đính kèm (PDF/Word)
      </label>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100 cursor-pointer"
      />

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {progressText && !error && (
        <p className="text-sm text-green-600 mt-2">{progressText}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
                   hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition-colors"
      >
        {uploading ? 'Đang tải lên...' : 'Tải lên'}
      </button>
    </div>
  );
}

/*
CÁCH DÙNG trong form thêm văn bản, VÍ DỤ:

import UploadCongVan from './components/UploadCongVan';

function FormVanBanDen() {
  const [duongDanTep, setDuongDanTep] = useState('');

  return (
    <UploadCongVan
      loaiVanBan="den"
      onUploadSuccess={(result) => setDuongDanTep(result.path)}
    />
  );
}

// Sau đó khi submit form, lưu `duongDanTep` vào cột duong_dan_tep khi insert vào bảng cong_van_den
*/
