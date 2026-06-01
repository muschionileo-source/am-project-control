import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AMInfraLogoProps {
  variant?: 'light' | 'dark'
  className?: string
}

// Logo completa — usada na tela de login (fundo claro dentro do card)
export function AMInfraLogo({ variant = 'dark', className }: AMInfraLogoProps) {
  return (
    <Image
      src="/imagem.jpg"
      alt="A&M INFRA & Capital Projects by Alvarez & Marsal"
      width={320}
      height={100}
      priority
      className={cn(className)}
      style={{ objectFit: 'contain' }}
    />
  )
}

// Logo compacta — usada no navbar (fundo navy → caixa branca ao redor)
export function AMInfraLogoCompact({ variant = 'light', className }: AMInfraLogoProps) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '6px',
      padding: '3px 10px',
      display: 'inline-flex',
      alignItems: 'center',
    }}>
      <Image
        src="/imagem.jpg"
        alt="A&M INFRA"
        width={130}
        height={40}
        priority
        className={cn(className)}
        style={{ objectFit: 'contain' }}
      />
    </div>
  )
}

// Ícone isolado (não usado ativamente, mantido por compatibilidade)
export function AMLogoMark({ size = 32, className }: { size?: number; variant?: 'light' | 'dark'; className?: string }) {
  return (
    <div style={{ width: size, height: size, background: 'white', borderRadius: 4, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Image src="/imagem.jpg" alt="A&M" width={size} height={size} style={{ objectFit: 'contain' }} />
    </div>
  )
}

export function AMLogoFull({ variant = 'light', className }: { variant?: 'light' | 'dark'; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  return <AMInfraLogoCompact variant={variant} className={className} />
}
