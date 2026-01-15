import { useState, FormEvent } from 'react'
import { useLocation } from 'wouter'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth' // Nosso hook de autenticação
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner' // Componente para mostrar notificações

export default function Login() {
  // Hooks para gerenciar o estado e a navegação
  const [, setLocation] = useLocation()
  const { signIn, isAuthenticated } = useSupabaseAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Se o usuário já estiver autenticado, redireciona para a home
  if (isAuthenticated) {
    setLocation('/')
    return null
  }

  // Função chamada quando o formulário é enviado
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      toast.success('Login realizado com sucesso!')
      setLocation('/') // Redireciona para a home após o login
    } catch (error) {
      // Mostra uma notificação de erro
      toast.error(error instanceof Error ? error.message : 'E-mail ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sistema de Gestão</CardTitle>
          <CardDescription>Faça login para acessar o painel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="seu.nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Senha</label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
