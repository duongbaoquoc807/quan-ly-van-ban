# Cấu trúc gói file này

Đây là các file bổ sung cho dự án "Quản lý Văn bản đi/đến – Trường THPT Khánh Lâm".
Giải nén và copy đè vào đúng vị trí trong repo GitHub hiện tại của bạn (repo đã có sẵn
package.json, index.html, src/main.jsx, src/App.jsx từ khi tạo dự án Vite/CRA).

quan-ly-van-ban/
├── vercel.json                          → đặt ở GỐC dự án (ngang package.json)
├── .env.example                         → đổi tên thành .env, điền giá trị thật, KHÔNG commit lên Git
├── .gitignore                           → hợp nhất với .gitignore hiện có (nếu đã có file này rồi)
├── src/
│   ├── supabaseClient.js                → cấu hình kết nối Supabase
│   ├── components/
│   │   └── UploadCongVan.jsx            → component tải file lên Storage
│   └── utils/
│       └── baoCaoAssistant.js           → module trợ lý báo cáo tự động
└── supabase/
    ├── schema.sql                       → chạy 1 lần trong Supabase SQL Editor
    └── storage-policy.sql               → chạy 1 lần sau khi tạo bucket "cong-van"

## Việc cần làm sau khi đưa lên GitHub

1. Cài thư viện: npm install @supabase/supabase-js
2. Tạo file .env từ .env.example, điền URL + Anon Key thật.
3. Vào Supabase Dashboard > SQL Editor, chạy lần lượt schema.sql rồi storage-policy.sql.
4. Tạo bucket "cong-van" trong Supabase > Storage (nếu chưa tạo).
5. Push code, Vercel sẽ tự build lại (nhớ thêm biến môi trường VITE_SUPABASE_URL
   và VITE_SUPABASE_ANON_KEY trong Vercel > Project Settings > Environment Variables).
