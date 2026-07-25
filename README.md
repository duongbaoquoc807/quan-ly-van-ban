# Quản lý Văn bản đi/đến - Trường THPT Khánh Lâm

Web app quản lý văn bản đi/đến và trợ lý báo cáo tự động, xây dựng bằng
React + Vite + Tailwind CSS, kết nối Supabase (Database + Storage).

## Cấu trúc dự án

```
quan-ly-van-ban/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── .env.example
├── public/
│   └── vite.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── supabaseClient.js
│   ├── components/
│   │   ├── Layout.jsx
│   │   └── UploadCongVan.jsx
│   ├── pages/
│   │   ├── TrangChu.jsx
│   │   ├── VanBanDen.jsx
│   │   ├── VanBanDi.jsx
│   │   └── BaoCao.jsx
│   └── utils/
│       └── baoCaoAssistant.js
└── supabase/
    ├── schema.sql
    └── storage-policy.sql
```

## Chạy thử ở máy local

```bash
npm install
cp .env.example .env
# mở file .env, điền đúng URL và Anon Key Supabase của bạn (nếu khác mẫu)
npm run dev
```

Mở trình duyệt tại địa chỉ hiển thị trong terminal (thường là http://localhost:5173).

## Thiết lập Supabase (chỉ làm 1 lần)

1. Vào Supabase Dashboard → **SQL Editor** → chạy toàn bộ nội dung `supabase/schema.sql`.
2. Vào **Storage** → tạo bucket mới tên `cong-van`.
3. Quay lại **SQL Editor** → chạy nội dung `supabase/storage-policy.sql`.
4. (Nếu app chưa có màn hình đăng nhập) tạm thời có thể mở rộng policy cho vai trò
   `anon` để test — xem chú thích cuối file `schema.sql`.

## Deploy lên Vercel

1. Đẩy toàn bộ thư mục này lên GitHub (repo gốc phải chứa `package.json` ở cấp cao nhất).
2. Vào [vercel.com](https://vercel.com) → **New Project** → chọn repo.
3. Vercel tự nhận diện framework là **Vite** — không cần chỉnh Build Command/Output Directory.
4. Thêm **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Nhấn **Deploy**.

## Tính năng hiện có

- Trang **Văn bản đến**: thêm mới, đính kèm file PDF/Word, đổi trạng thái xử lý.
- Trang **Văn bản đi**: thêm mới, đính kèm file, theo dõi trạng thái ban hành.
- Trang **Báo cáo tự động**: chọn khoảng thời gian, tự tổng hợp số liệu và soạn
  sẵn nội dung báo cáo hành chính, có thể sao chép sang Word để trình ký.
