import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Verified URL from your first screenshot
const supabaseUrl = 'https://ujbmqcxmiuadqzfipxvm.supabase.co';

// Verified Key from your second screenshot (Copy the full string using that 'Copy' button)
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYm1xY3htaXVhZHF6ZmlweHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMjM1NTIsImV4cCI6MjA4NjY5OTU1Mn0.nxfsWEoU-frbEyuIGtDmvg9tiF7WSWsBpV6PlLYBjHQ'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
