-- ============================================================
-- CẤU HÌNH STORAGE BUCKET "cong-van"
-- Chạy sau khi đã tạo bucket "cong-van" trong Dashboard > Storage
-- (Storage > New bucket > tên: cong-van > Public: tùy chọn, khuyến nghị để Private)
-- ============================================================

-- Cho phép người dùng đã đăng nhập (authenticated) upload file
create policy "Cho phep authenticated upload cong-van"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'cong-van');

-- Cho phép người dùng đã đăng nhập xem/tải file xuống
create policy "Cho phep authenticated xem cong-van"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'cong-van');

-- Cho phép xóa file (nếu cần chức năng xóa văn bản)
create policy "Cho phep authenticated xoa cong-van"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cong-van');
