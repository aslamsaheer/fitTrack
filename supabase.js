const SUPABASE_URL='https://jclptooiconwfbrxmypf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_k31JvGttYYDZj0Y8hMCccA_iwu-7Lqa';
const supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}});
