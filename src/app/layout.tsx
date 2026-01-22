import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { GeistMono } from 'geist/font/mono'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { OrdersProvider } from '@/contexts/OrdersContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { AppearanceProvider } from '@/components/AppearanceProvider'
import { UserRoleProvider } from '@/contexts/UserRoleContext'
import { 
  inter, 
  sourceSerif4, 
  schibstedGrotesk, 
  funnelSans, 
  corben, 
  fraunces,
  ibmPlexSerif,
  geistSans
} from '@/styles/fonts'
import { validateEnvironment } from '@/lib/env-validation'
import { Toaster } from 'sonner'

// All fonts are now imported from the fonts definitions file

export const metadata = {
  // ... metadata
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Validate environment variables at startup
  let envValidation;
  try {
    envValidation = validateEnvironment();
  } catch {
    // If validation fails, continue anyway in development
    envValidation = {
      isValid: process.env.NODE_ENV !== 'production',
      missing: [],
      invalid: [],
      warnings: ['Environment validation error occurred']
    };
  }
  
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
    <html lang="en" suppressHydrationWarning className={`
      ${inter.variable} 
      ${sourceSerif4.variable} 
      ${schibstedGrotesk.variable} 
      ${funnelSans.variable} 
      ${corben.variable} 
      ${fraunces.variable} 
      ${ibmPlexSerif.variable}
      ${geistSans.variable}
      ${GeistMono.variable}
    `}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // This script MUST run before React hydrates
                // Get role from cookie or localStorage immediately
                function getCookie(name) {
                  const value = '; ' + document.cookie;
                  const parts = value.split('; ' + name + '=');
                  if (parts.length === 2) return parts.pop().split(';').shift();
                  return null;
                }
                
                const cookieRole = getCookie('user-role');
                let role = cookieRole;
                
                if (role !== 'advisor' && role !== 'client') {
                  // Fallback to localStorage
                  try {
                    role = localStorage.getItem('user-role');
                  } catch (e) {
                    role = 'advisor'; // Default fallback
                  }
                }
                
                // Default to advisor if still not valid
                if (role !== 'advisor' && role !== 'client') {
                  role = 'advisor';
                }
                
                // Set data-role attribute so components can read it synchronously
                // This must happen before React tries to render
                document.documentElement.setAttribute('data-role', role);
                
                // Set theme immediately based on role
                if (role === 'client') {
                  document.documentElement.setAttribute('data-theme', 'wedbush-next');
                  // Set client background color (Wedbush Next: #F1F5F9 = 241 245 249)
                  document.documentElement.style.setProperty('--background', '241 245 249');
                } else {
                  // Advisor (Solace) theme - remove data-theme and use default background
                  document.documentElement.removeAttribute('data-theme');
                  // Set advisor background color (Solace: #F5F5F4 = 245 245 244)
                  document.documentElement.style.setProperty('--background', '245 245 244');
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {/* <div className="background-gradient-effect fixed inset-0 -z-10 overflow-hidden">
        </div> */}

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <UserRoleProvider>
            <SettingsProvider>
              <AppearanceProvider>
                <SidebarProvider>
                  <OrdersProvider>
                    <NavigationProvider>
                      <HeaderWrapper />
                      <div className="w-full">
                      {children}
                      </div>
                      <Toaster position="top-right" />
                    </NavigationProvider>
                  </OrdersProvider>
                </SidebarProvider>
              </AppearanceProvider>
            </SettingsProvider>
          </UserRoleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
