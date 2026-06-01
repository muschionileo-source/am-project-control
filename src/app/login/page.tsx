'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, CheckCircle, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { AMInfraLogo } from '@/components/shared/AMLogoFull'

const DISCIPLINAS = ['Civil', 'Elétrica', 'Metalmecânica', 'Instrumentação', 'Automação', 'Execução']
const CARGOS = ['Analista', 'Coordenador', 'Gerente', 'Diretor', 'Consultor']
const UNIDADES = ['Rio Verde', 'Dourados', 'São Paulo', 'Todas as unidades']

export default function LoginPage() {
  const [tab, setTab] = useState<'entrar' | 'criar'>('entrar')

  // ── Login state ──
  const [email, setEmail] = useState('admin@am-infra.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ── Register state ──
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regEmpresa, setRegEmpresa] = useState('')
  const [regDisciplina, setRegDisciplina] = useState('')
  const [regCargo, setRegCargo] = useState('')
  const [regUnidade, setRegUnidade] = useState('')
  const [regSenha, setRegSenha] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regShowPass, setRegShowPass] = useState(false)
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState(false)
  const [regLoading, setRegLoading] = useState(false)

  const { login, loginAsGuest } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error ?? 'Erro ao realizar login.')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')
    if (regSenha !== regConfirm) { setRegError('As senhas não coincidem.'); return }
    if (regSenha.length < 6) { setRegError('A senha deve ter no mínimo 6 caracteres.'); return }
    setRegLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setRegLoading(false)
    setRegSuccess(true)
  }

  const inp: React.CSSProperties = {
    width: '100%', height: '42px', padding: '0 12px',
    border: '1.5px solid #e5e7eb', borderRadius: '8px',
    fontSize: '14px', color: '#1a1a1a', outline: 'none',
    boxSizing: 'border-box', background: '#fff',
  }
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: 700,
    color: '#6b7280', marginBottom: '5px', letterSpacing: '0.05em', textTransform: 'uppercase',
  }
  const sel: React.CSSProperties = {
    ...inp, paddingRight: '32px', appearance: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
  }
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = '#1B3461' }
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = '#e5e7eb' }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1B3461 0%, #0F2040 50%, #142648 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="100%" x2="35%" y2="0" stroke="white" strokeWidth="1" />
        <line x1="25%" y1="100%" x2="60%" y2="0" stroke="white" strokeWidth="1" />
        <line x1="55%" y1="100%" x2="90%" y2="0" stroke="white" strokeWidth="1" />
        <line x1="75%" y1="100%" x2="110%" y2="0" stroke="white" strokeWidth="1" />
        <circle cx="70%" cy="20%" r="200" stroke="white" strokeWidth="1" fill="none" />
        <circle cx="10%" cy="80%" r="150" stroke="white" strokeWidth="1" fill="none" />
      </svg>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '460px' }}>
        {/* Card */}
        <div style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
          {/* Logo inside card */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 28px 0' }}>
            <AMInfraLogo />
          </div>

          <div style={{ height: '4px', background: 'linear-gradient(90deg, #1B3461, #7B9FC9)', marginTop: '20px' }} />

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
            {(['entrar', 'criar'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '14px', fontSize: '14px', fontWeight: 700,
                border: 'none', background: 'none', cursor: 'pointer',
                color: tab === t ? '#1B3461' : '#9ca3af',
                borderBottom: tab === t ? '2px solid #1B3461' : '2px solid transparent',
              }}>
                {t === 'entrar' ? 'Entrar' : 'Criar Conta'}
              </button>
            ))}
          </div>

          <div style={{ padding: '28px' }}>

            {/* ── ENTRAR ── */}
            {tab === 'entrar' && (
              <>
                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#dc2626', fontSize: '13px' }}>
                    <AlertCircle style={{ width: 15, height: 15, flexShrink: 0 }} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={lbl}>E-mail</label>
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seu@email.com" style={inp} onFocus={focus} onBlur={blur} />
                  </div>
                  <div>
                    <label style={lbl}>Senha</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={{ ...inp, paddingRight: '40px' }} onFocus={focus} onBlur={blur} />
                      <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                        {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} style={{ width: '100%', height: '44px', background: loading ? '#4a6490' : 'linear-gradient(90deg, #1B3461, #2A4A7F)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {loading ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />Entrando...</> : 'Entrar'}
                  </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                  <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>ou</span>
                  <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                </div>

                <button onClick={loginAsGuest} style={{ width: '100%', height: '42px', background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B3461'; e.currentTarget.style.color = '#1B3461' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151' }}>
                  👁️ Continuar como visitante
                </button>
                <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '10px' }}>
                  Visitante tem acesso somente leitura ao sistema
                </p>
              </>
            )}

            {/* ── CRIAR CONTA ── */}
            {tab === 'criar' && (
              <>
                {regSuccess ? (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <CheckCircle style={{ width: 48, height: 48, color: '#16a34a', margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>Cadastro enviado!</h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
                      Seu cadastro ficará <strong>pendente de aprovação</strong> até ser liberado por um responsável.
                    </p>
                    <button onClick={() => { setRegSuccess(false); setTab('entrar') }} style={{ marginTop: '20px', padding: '10px 28px', background: 'linear-gradient(90deg, #1B3461, #2A4A7F)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                      Voltar ao login
                    </button>
                  </div>
                ) : (
                  <>
                    {regError && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', color: '#dc2626', fontSize: '13px' }}>
                        <AlertCircle style={{ width: 15, height: 15, flexShrink: 0 }} />
                        {regError}
                      </div>
                    )}
                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                      <div>
                        <label style={lbl}>Nome Completo *</label>
                        <input type="text" required value={regName} onChange={e => setRegName(e.target.value)} placeholder="Seu nome completo" style={inp} onFocus={focus} onBlur={blur} />
                      </div>
                      <div>
                        <label style={lbl}>E-mail *</label>
                        <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="seu@email.com" style={inp} onFocus={focus} onBlur={blur} />
                      </div>
                      <div>
                        <label style={lbl}>Empresa *</label>
                        <div style={{ position: 'relative' }}>
                          <input type="text" required value={regEmpresa} onChange={e => setRegEmpresa(e.target.value)} placeholder="Digite o nome da empresa..." style={{ ...inp, paddingRight: '36px' }} onFocus={focus} onBlur={blur} />
                          <Search style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#9ca3af', pointerEvents: 'none' }} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={lbl}>Disciplina(s) *</label>
                          <select required value={regDisciplina} onChange={e => setRegDisciplina(e.target.value)} style={sel} onFocus={focus} onBlur={blur}>
                            <option value="">Selecione...</option>
                            {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={lbl}>Cargo *</label>
                          <select required value={regCargo} onChange={e => setRegCargo(e.target.value)} style={sel} onFocus={focus} onBlur={blur}>
                            <option value="">Selecione...</option>
                            {CARGOS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label style={lbl}>Unidade onde você atua *</label>
                        <select required value={regUnidade} onChange={e => setRegUnidade(e.target.value)} style={sel} onFocus={focus} onBlur={blur}>
                          <option value="">Selecione as unidades</option>
                          {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={lbl}>Senha *</label>
                          <div style={{ position: 'relative' }}>
                            <input type={regShowPass ? 'text' : 'password'} required value={regSenha} onChange={e => setRegSenha(e.target.value)} placeholder="Mínimo 6 caracteres" style={{ ...inp, paddingRight: '36px' }} onFocus={focus} onBlur={blur} />
                            <button type="button" onClick={() => setRegShowPass(v => !v)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
                              {regShowPass ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label style={lbl}>Confirmar Senha *</label>
                          <input type={regShowPass ? 'text' : 'password'} required value={regConfirm} onChange={e => setRegConfirm(e.target.value)} placeholder="Repita a senha" style={inp} onFocus={focus} onBlur={blur} />
                        </div>
                      </div>
                      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>
                        ⏳ Seu cadastro ficará <strong>pendente de aprovação</strong> até ser liberado por um responsável.
                      </div>
                      <button type="submit" disabled={regLoading} style={{ width: '100%', height: '44px', background: regLoading ? '#4a6490' : 'linear-gradient(90deg, #1B3461, #2A4A7F)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: regLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {regLoading ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />Enviando...</> : 'Solicitar Cadastro'}
                      </button>
                    </form>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '20px' }}>
          A&M INFRA &amp; Capital Projects © {new Date().getFullYear()}
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
