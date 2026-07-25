-- ============================================================
-- SCHEMA CƠ SỞ DỮ LIỆU: QUẢN LÝ VĂN BẢN ĐI/ĐẾN
-- Trường THPT Khánh Lâm
-- Chạy đoạn này trong Supabase Dashboard > SQL Editor
-- ============================================================

-- Bật extension để tự sinh UUID (Supabase thường đã bật sẵn)
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- BẢNG 1: VĂN BẢN ĐẾN (cong_van_den)
-- ------------------------------------------------------------
create table if not exists cong_van_den (
  id uuid primary key default uuid_generate_v4(),
  so_ky_hieu text not null,              -- Số ký hiệu văn bản (VD: 123/QĐ-SGDĐT)
  ngay_van_ban date not null,            -- Ngày ban hành ghi trên văn bản
  ngay_nhan date default current_date,   -- Ngày trường nhận được văn bản
  co_quan_ban_hanh text not null,        -- Cơ quan ban hành (VD: Sở GD&ĐT tỉnh)
  trich_yeu text not null,               -- Trích yếu / nội dung tóm tắt
  loai_van_ban text,                     -- Loại: Công văn, Quyết định, Thông báo...
  do_khan text default 'Thường',         -- Độ khẩn: Thường / Khẩn / Thượng khẩn
  do_mat text default 'Thường',          -- Độ mật: Thường / Mật / Tối mật
  nguoi_xu_ly text,                      -- Cán bộ được giao xử lý
  trang_thai text default 'Chưa xử lý',  -- Trạng thái: Chưa xử lý / Đang xử lý / Đã xử lý
  duong_dan_tep text,                    -- Đường dẫn file trong Supabase Storage
  ghi_chu text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table cong_van_den is 'Sổ theo dõi văn bản đến của trường';

-- ------------------------------------------------------------
-- BẢNG 2: VĂN BẢN ĐI (cong_van_di)
-- ------------------------------------------------------------
create table if not exists cong_van_di (
  id uuid primary key default uuid_generate_v4(),
  so_ky_hieu text not null,              -- Số ký hiệu văn bản đi (VD: 45/BC-THPTKL)
  ngay_van_ban date not null,            -- Ngày ban hành
  co_quan_ban_hanh text default 'Trường THPT Khánh Lâm', -- Nơi ban hành (mặc định là trường)
  noi_nhan text not null,                -- Nơi nhận văn bản
  trich_yeu text not null,               -- Trích yếu / nội dung tóm tắt
  loai_van_ban text,                     -- Loại: Công văn, Báo cáo, Kế hoạch, Quyết định...
  nguoi_ky text,                         -- Người ký (Hiệu trưởng/Phó HT)
  trang_thai text default 'Dự thảo',     -- Trạng thái: Dự thảo / Đã ban hành / Đã gửi
  duong_dan_tep text,                    -- Đường dẫn file trong Supabase Storage
  ghi_chu text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table cong_van_di is 'Sổ theo dõi văn bản đi của trường';

-- ------------------------------------------------------------
-- INDEX để tìm kiếm / báo cáo nhanh hơn
-- ------------------------------------------------------------
create index if not exists idx_cvden_ngay on cong_van_den (ngay_van_ban);
create index if not exists idx_cvden_trangthai on cong_van_den (trang_thai);
create index if not exists idx_cvdi_ngay on cong_van_di (ngay_van_ban);
create index if not exists idx_cvdi_trangthai on cong_van_di (trang_thai);

-- ------------------------------------------------------------
-- TRIGGER tự động cập nhật updated_at khi sửa dữ liệu
-- ------------------------------------------------------------
create or replace function trigger_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_cvden on cong_van_den;
create trigger set_updated_at_cvden
  before update on cong_van_den
  for each row execute function trigger_set_updated_at();

drop trigger if exists set_updated_at_cvdi on cong_van_di;
create trigger set_updated_at_cvdi
  before update on cong_van_di
  for each row execute function trigger_set_updated_at();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) — BẮT BUỘC nên bật vì bạn dùng Anon Key ở frontend
-- ------------------------------------------------------------
alter table cong_van_den enable row level security;
alter table cong_van_di enable row level security;

-- Ví dụ policy đơn giản: cho phép người dùng đã đăng nhập (authenticated) đọc/ghi
-- Bạn nên tinh chỉnh lại theo vai trò (role) thực tế của trường (VD: chỉ văn thư mới được ghi)
create policy "Cho phép đọc dữ liệu văn bản đến"
  on cong_van_den for select
  to authenticated
  using (true);

create policy "Cho phép thêm/sửa văn bản đến"
  on cong_van_den for insert
  to authenticated
  with check (true);

create policy "Cho phép cập nhật văn bản đến"
  on cong_van_den for update
  to authenticated
  using (true);

create policy "Cho phép đọc dữ liệu văn bản đi"
  on cong_van_di for select
  to authenticated
  using (true);

create policy "Cho phép thêm/sửa văn bản đi"
  on cong_van_di for insert
  to authenticated
  with check (true);

create policy "Cho phép cập nhật văn bản đi"
  on cong_van_di for update
  to authenticated
  using (true);

-- Nếu bạn CHƯA làm đăng nhập (login) và muốn test nhanh, có thể tạm thời dùng policy mở cho "anon":
-- (CHỈ dùng tạm khi phát triển — nhớ xóa/khóa lại trước khi công khai ứng dụng)
--
-- create policy "TAM THOI - cho phep anon doc" on cong_van_den for select to anon using (true);
-- create policy "TAM THOI - cho phep anon ghi" on cong_van_den for insert to anon with check (true);
