import { createClient } from '@supabase/supabase-js'

// Pega a URL e a chave do Supabase das variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verifica se as variáveis foram configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) não estão configuradas.')
}

// Cria e exporta o cliente Supabase que será usado em todo o aplicativo
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
