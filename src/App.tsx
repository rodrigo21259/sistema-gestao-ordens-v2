import { Switch, Route, useLocation, Redirect } from 'wouter'
import { Toaster } from '@/components/ui/sonner'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth' // Nosso hook

// Importe suas páginas
import Login from '@/pages/Login'
// Supondo que suas outras páginas estejam em `client/src/pages`
// Se os nomes ou locais forem diferentes, ajuste aqui.
// import Home from '@/pages/Home'
// import OrderForm from '@/pages/OrderForm'
// import Ranking from '@/pages/Ranking'
// import AdminDashboard from '@/pages/AdminDashboard'

// Um componente especial que funciona como um "porteiro"
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useSupabaseAuth();
  const [, setLocation] = useLocation();

  // Enquanto verifica a autenticação, não mostre nada (ou um spinner)
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  // Se estiver autenticado, mostra o conteúdo da página
  return <>{children}</>;
}


export default function App() {
  return (
    <>
      {/* O Toaster é o componente que mostra as notificações (toast.success, toast.error) */}
      <Toaster richColors />

      <Switch>
        {/* Rota pública para a página de login */}
        <Route path="/login" component={Login} />

        {/* Rotas Protegidas */}
        {/* Adicione aqui as outras rotas do seu sistema. */}
        {/* Elas estarão dentro do "PrivateRoute" que as protege. */}

        {/* Exemplo de como seria sua página Home protegida */}
        <Route path="/">
          <PrivateRoute>
            {/* <Home /> */}
            <div>Página Principal - Você está logado!</div>
          </PrivateRoute>
        </Route>

        {/* Exemplo para a página de Ranking */}
        {/*
        <Route path="/ranking">
          <PrivateRoute>
            <Ranking />
          </PrivateRoute>
        </Route>
        */}


        {/* Rota padrão: se não achar nenhuma, redireciona */}
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </>
  );
}
