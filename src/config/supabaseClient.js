import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; // Ensure this is set in your environment variables
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY; // Ensure this is set in your environment variables

export const supabase = createClient(supabaseUrl, supabaseAnonKey);