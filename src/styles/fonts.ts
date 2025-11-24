import { 
  Inter, 
  Source_Serif_4, 
  Schibsted_Grotesk,
  Corben, 
  Fraunces,
  IBM_Plex_Serif
} from 'next/font/google'
import { GeistSans } from 'geist/font/sans'

// Define all available fonts with CSS variables
export const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap'
})

export const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-source-serif-4',
  display: 'swap'
})

export const corben = Corben({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-corben',
  display: 'swap'
})

export const fraunces = Fraunces({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-fraunces',
  display: 'swap'
})

export const schibstedGrotesk = Schibsted_Grotesk({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-schibsted-grotesk',
  display: 'swap'
})

export const ibmPlexSerif = IBM_Plex_Serif({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif',
  display: 'swap'
})

export const geistSans = GeistSans

// Note: Funnel Sans is not available in next/font/google
// Using Inter as fallback for now
export const funnelSans = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-funnel-sans',
  display: 'swap'
})

// Font mapping for easy lookup
export const fontMap = {
  'Source Serif 4': sourceSerif4,
  'Inter': inter,
  'Schibsted Grotesk': schibstedGrotesk,
  'Funnel Sans': funnelSans,
  'Corben': corben,
  'Fraunces': fraunces,
  'IBM Plex Serif': ibmPlexSerif,
  'Geist': geistSans,
} as const

export type FontName = keyof typeof fontMap
