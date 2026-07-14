import { Eye, EyeOff, Info, LockKeyhole, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import { useAuth } from '../context/authContext'
import { getApiError } from '../lib/api'
import { login } from '../services/authService'
import xLogo from '../assets/x.png'
import './LoginPage.css'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { authenticated, startSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: 'onChange' })

  if (authenticated) return <Navigate to="/funcionarios" replace />

  async function submit(credentials) {
    try {
      const response = await login(credentials)
      await startSession(response)
      navigate(location.state?.from?.pathname || '/funcionarios', { replace: true })
    } catch (error) {
      toast.error(getApiError(error, 'Usuário ou senha inválidos.'))
    }
  }

  return <main className="login-page">
    <form className="login-card" onSubmit={handleSubmit(submit)} noValidate>
      <img src={xLogo} alt="Gestão de Funcionários" />
      <div className="login-title"><h1>Bem-vindo</h1><p>Entre para acessar o sistema.</p></div>
      <FormField label="Usuário" error={errors.login}><div className="login-input"><User size={18} /><input autoFocus autoComplete="username" {...register('login', { required: 'Informe o usuário.' })} /></div></FormField>
      <FormField label="Senha" error={errors.senha}><div className="login-input"><LockKeyhole size={18} /><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" {...register('senha', { required: 'Informe a senha.' })} /><button type="button" className="password-toggle" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></FormField>
      <button className="primary-button login-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Entrando...' : 'Entrar'}</button>
    </form>
    <aside className="default-access" aria-label="Credenciais padrão">
      <span className="default-access-icon"><Info size={19} aria-hidden="true" /></span>
      <div><strong>Acesso de demonstração</strong><span>Use as credenciais abaixo para entrar.</span><dl><div><dt>Usuário</dt><dd>login</dd></div><div><dt>Senha</dt><dd>pass</dd></div></dl></div>
    </aside>
  </main>
}
