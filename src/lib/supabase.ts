
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // Bu hata sadece geliştirme ortamında konsola basılmalı, production'da patlamamalı ama 
    // şimdilik kullanıcıyı uyarmak için bırakıyoruz.
    console.warn('Supabase URL veya Anon Key eksik! .env dosyasını kontrol edin.');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);
