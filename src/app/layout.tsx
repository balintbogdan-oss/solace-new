import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from '@/components/layout/Header'
import { GeistMono } from 'geist/font/mono'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { Inter } from 'next/font/google'
import { Source_Serif_4 } from 'next/font/google'
import { validateEnvironment } from '@/lib/env-validation'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-source-serif-4',
})

export const metadata = {
  // ... metadata
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Validate environment variables at startup
  const envValidation = validateEnvironment();
  
  if (!envValidation.isValid) {
    return (
      <html lang="en">
        <body>
          <div style={{ 
            fontFamily: 'system-ui, sans-serif', 
            margin: '40px', 
            background: '#f5f5f5',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              maxWidth: '600px', 
              background: 'white', 
              padding: '30px', 
              borderRadius: '8px', 
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
            }}>
              <h1 style={{ color: '#dc2626', marginBottom: '20px' }}>❌ Configuration Error</h1>
              <p>Your application is missing required environment variables. Please check your <code>.env.local</code> file.</p>
              
              {envValidation.missing.length > 0 && (
                <>
                  <h3>Missing Variables:</h3>
                  <ul>
                    {envValidation.missing.map(v => <li key={v}><code>{v}</code></li>)}
                  </ul>
                </>
              )}
              
              {envValidation.invalid.length > 0 && (
                <>
                  <h3>Invalid Variables:</h3>
                  <ul>
                    {envValidation.invalid.map(v => <li key={v}><code>{v}</code> has invalid format</li>)}
                  </ul>
                </>
              )}
              
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', color: '#6b7280' }}>
                <p>Create a <code>.env.local</code> file in your project root with the required variables.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${GeistMono.variable} ${sourceSerif4.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
         {/*  <div className="background-gradient-effect fixed inset-0 -z-10 overflow-hidden">
          </div> */}

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SettingsProvider>
            <NavigationProvider>
              <Header />
              <div className="w-full">
              {children}
              </div>
            </NavigationProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
