import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import { useAuthStore } from '../../stores/auth.store'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import type { AuthResponse } from '../../types/api.types'
import type { AxiosError } from 'axios'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post<AuthResponse>('/auth/register', { email, password, name })
      setAuth(res.data.user, res.data.token)
      navigate('/', { replace: true })
    } catch (err) {
      const e = err as AxiosError<{ error: string }>
      setError(e.response?.data?.error ?? 'Error al registrarse. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-content-primary mb-1">Crear cuenta</h1>
          <p className="text-content-secondary text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="text-accent-violet hover:text-accent-violet-hover transition-colors"
            >
              Inicia sesión
            </Link>
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/8 border border-red-400/20 px-3 py-2.5 rounded">
            <span className="flex-shrink-0">⚠</span>
            {error}
          </div>
        )}

        <Input
          label="Nombre"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          placeholder="Tu nombre completo"
        />

        <Input
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
        />

        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Mín. 8 caracteres"
        />

        <Button type="submit" loading={loading} size="md" className="w-full mt-2">
          Crear cuenta
        </Button>
      </form>
    </AuthLayout>
  )
}
