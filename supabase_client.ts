// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
// export const supabase = createClient(supabaseUrl || '', supabaseKey || '');



import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// זה האובייקט שמלמד את Supabase איך לדבר עם הזיכרון של המובייל
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl!, supabaseKey!, {
  auth: {
    storage: ExpoSecureStoreAdapter, // כאן ה-Session נשמר אוטומטית בזיכרון!
    autoRefreshToken: true,          // מחדש את הטוקן ברקע
    persistSession: true,            // דואג שהסשן לא יימחק בסגירת האפליקציה
    detectSessionInUrl: false,
  },
});