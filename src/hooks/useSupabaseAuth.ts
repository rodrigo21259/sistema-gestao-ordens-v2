import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase' // Importa nosso cliente supabase
import type { User, Session } from '@supabase/supabase-js'

// Define a estrutura do perfil do usuário que criamos no banco
interface Profile {
  id: string;
  name: string | null;
  role: 'user' | 'admin';
  theme_preference: 'light' | 'dark';
}

// Define a estrutura do nosso estado de autenticação
interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export function useSupabaseAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true, // Começa carregando, pois vamos verificar a sessão
    error: null,
  });

  // Função para buscar o perfil de um usuário na nossa tabela 'profiles'
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(); // .single() pega um único resultado ou retorna erro se não achar

      if (error && error.code !== 'PGRST116') { // PGRST116 = 'not found'
        console.error('Erro ao buscar perfil:', error);
        return null;
      }
      return data as Profile | null;
    } catch (err) {
      console.error('Erro inesperado ao buscar perfil:', err);
      return null;
    }
  }, []);

  // Efeito que roda uma vez quando o componente é montado
  useEffect(() => {
    // Verifica se já existe uma sessão ativa
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState({ user: session.user, profile, session, loading: false, error: null });
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    // Ouve por mudanças no estado de autenticação (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({ user: session.user, profile, session, loading: false, error: null });
        } else {
          // Se o usuário fez logout, limpa o estado
          setState({ user: null, profile: null, session: null, loading: false, error: null });
        }
      }
    );

    // Limpa a inscrição quando o componente é desmontado
    return () => subscription?.unsubscribe();
  }, [fetchProfile]);


  // Funções de autenticação que os componentes poderão chamar

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, error: null }));
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  };

  // Retorna o estado e as funções para serem usadas pelos componentes
  return {
    ...state,
    isAuthenticated: !!state.user,
    isAdmin: state.profile?.role === 'admin',
    signIn,
    signOut,
  };
}
