'use client'

import { useState } from 'react'
import { Lock, Mail, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgotMessage, setShowForgotMessage] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login')
        setLoading(false)
        return
      }

      // Redirecionar para o dashboard após login bem-sucedido
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('Erro ao conectar com o servidor')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/videos/login-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/50"></div>
      </div>
      
      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-md animate-[fadeIn_1s_ease-out]">
        {/* Glass Card */}
        <div className="relative backdrop-blur-xl bg-white/40 border border-black/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Specular Highlight */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
          
          {/* Login Form */}
          <div className="relative p-10 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4 animate-[fadeUp_0.7s_ease-out_0.3s_both]">
              <div className="w-20 h-20 bg-gradient-to-r from-[#00d2c7] to-[#00a89e] rounded-2xl mx-auto shadow-lg flex items-center justify-center">
                <Lock className="w-10 h-10 text-white" />
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold tracking-[0.15em] text-black leading-none">CARBON HUB</span>
                <span className="text-5xl text-[#00d2c7] italic leading-none my-1">&</span>
                <span className="text-4xl font-bold tracking-[0.15em] text-black italic leading-none">DEVELOPER</span>
              </div>

              <h1 className="text-3xl font-light text-black tracking-tight uppercase mt-6">BEM-VINDO</h1>
              <p className="text-[#666666] text-sm tracking-wide">Entre na sua conta</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 animate-[fadeUp_0.7s_ease-out_0.5s_both]">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-600 text-sm backdrop-blur-sm">
                  {error}
                </div>
              )}

              {/* Forgot Password Message */}
              {showForgotMessage && (
                <div className="bg-[#00d2c7]/10 border border-[#00d2c7]/30 rounded-xl p-4 text-black text-sm backdrop-blur-sm animate-[fadeUp_0.5s_ease-out]">
                  <p className="font-semibold mb-1">Esqueceu sua senha?</p>
                  <p>Entre em contato com o administrador do sistema para redefinir sua senha.</p>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black/90 block tracking-wide">ENDEREÇO DE E-MAIL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-black/40" />
                  </div>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-white/60 border border-black/20 rounded-xl text-black placeholder-black/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#00d2c7]/50 focus:border-[#00d2c7]/50 transition-all duration-300"
                    placeholder="Digite seu e-mail"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black/90 block tracking-wide">SENHA</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-black/40" />
                  </div>
                  <input
                    className="w-full pl-10 pr-12 py-3 bg-white/60 border border-black/20 rounded-xl text-black placeholder-black/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#00d2c7]/50 focus:border-[#00d2c7]/50 transition-all duration-300"
                    placeholder="Digite sua senha"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-black/40 hover:text-black/70 transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-black/80 cursor-pointer">
                  <div className="relative">
                    <input
                      className="sr-only"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className={`w-4 h-4 ${rememberMe ? 'bg-[#00d2c7] border-[#00d2c7]' : 'bg-white/60 border-black/30'} border rounded flex items-center justify-center transition-all duration-200`}>
                      {rememberMe && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <span className="tracking-wide">Lembrar-me</span>
                </label>
                <button 
                  type="button"
                  onClick={() => {
                    setShowForgotMessage(true)
                    setTimeout(() => setShowForgotMessage(false), 5000)
                  }}
                  className="text-[#00d2c7] hover:text-[#00a89e] transition-colors tracking-wide"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Login Button */}
              <button
                className="w-full hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex font-semibold text-white bg-gradient-to-r from-[#00d2c7] to-[#00a89e] rounded-xl py-4 px-4 shadow-lg space-x-2 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed tracking-wide uppercase text-sm"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? 'Entrando...' : 'Entrar'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#00d2c7]/10 to-[#00a89e]/10 blur-3xl"></div>
      </div>
    </main>
  )
}
