// src/supabaseClient.js
// File cấu hình kết nối tới Supabase — dùng chung cho toàn bộ ứng dụng

import { createClient } from '@supabase/supabase-js';

// LƯU Ý QUAN TRỌNG VỀ BẢO MẬT:
// Không nên hard-code trực tiếp URL và Key vào file như dưới đây khi đưa code lên GitHub công khai.
// Hãy dùng biến môi trường (Environment Variables) của Vite/CRA + Vercel (xem hướng dẫn bên dưới).

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dwuqrtsxngrjvfxsiegt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6HcJL4UvwjCRNpk0dG1Mgw_-uZ6-k3Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
