import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
console.log('supabaseKey:', supabaseKey, 'supabaseUrl:', supabaseUrl);

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
