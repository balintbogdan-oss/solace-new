import { createClient } from '@supabase/supabase-js'

// Get environment variables - these should be available on both client and server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DocumentInfo {
  date: string
  symbol: string
  cusip: string
  issuer: string
  issuerName: string
  type: string
  dueDate: string
  filePath?: string // Path in Supabase storage
}

export async function generateDocumentUrl(filePath: string): Promise<string | null> {
  try {
    // Generate signed URL with 1 hour expiration
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600) // 1 hour = 3600 seconds

    if (error) {
      console.error('Error generating signed URL:', error)
      return null
    }

    return data.signedUrl
  } catch (error) {
    console.error('Error generating signed URL:', error)
    return null
  }
}

// Alternative function to use existing signed URLs but with shorter expiration
export async function generateShortLivedUrl(originalUrl: string): Promise<string> {
  // For now, return the original URL but in production you'd want to:
  // 1. Extract the file path from the original URL
  // 2. Generate a new signed URL with shorter expiration
  // 3. Return the new URL
  
  // This is a temporary solution - the original URL will work but has long expiration
  return originalUrl
}

export async function openDocument(document: DocumentInfo) {
  if (!document.filePath) {
    console.error('No file path provided for document')
    return
  }

  const signedUrl = await generateDocumentUrl(document.filePath)
  if (signedUrl) {
    // Open in new tab
    window.open(signedUrl, '_blank')
  } else {
    alert('Unable to generate document link. Please try again.')
  }
}
