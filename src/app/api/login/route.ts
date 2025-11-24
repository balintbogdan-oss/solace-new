import { NextResponse } from 'next/server';
import { 
  validateRequestSize, 
  validateContentType, 
  validateStringInput, 
  SECURITY_CONFIG 
} from '@/lib/security';
import { getValidatedEnv } from '@/lib/env-validation';

// Password stored securely in environment variable
const env = getValidatedEnv();
const CORRECT_PASSWORD = env.ADMIN_PASSWORD;

// Simple in-memory rate limiting (in production, use Redis or similar)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  
  if (!attempts) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Reset if window has passed
  if (now - attempts.lastAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Check if under limit
  if (attempts.count < MAX_ATTEMPTS) {
    attempts.count++;
    attempts.lastAttempt = now;
    return true;
  }
  
  return false;
}

// Input validation functions using security utilities
function validatePassword(password: unknown): { isValid: boolean; error?: string; sanitized?: string } {
  return validateStringInput(password, SECURITY_CONFIG.maxPasswordLength);
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!validateContentType(contentType, SECURITY_CONFIG.allowedContentTypes)) {
      return NextResponse.json(
        { success: false, message: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Validate request size (max 512 bytes for login)
    const contentLength = request.headers.get('content-length');
    if (!validateRequestSize(contentLength, 512)) {
      return NextResponse.json(
        { success: false, message: 'Request too large' },
        { status: 413 }
      );
    }

    const body = await request.json();
    
    // Validate password input
    const passwordValidation = validatePassword(body.password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.error },
        { status: 400 }
      );
    }

    // Use sanitized password
    const sanitizedPassword = passwordValidation.sanitized!;

    // Determine role based on password
    let userRole: 'client' | 'advisor' | null = null;
    if (sanitizedPassword === 'client123') {
      userRole = 'client';
    } else if (sanitizedPassword === 'advisor123') {
      userRole = 'advisor';
    } else if (sanitizedPassword === CORRECT_PASSWORD) {
      // Fallback to advisor for admin password
      userRole = 'advisor';
    }

    if (userRole) {
      const response = NextResponse.json(
        { success: true, message: 'Login successful', role: userRole },
        { status: 200 }
      );

      // Set secure auth cookie
      response.cookies.set('auth', 'true', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      // Set role cookie (not httpOnly so client can read it)
      response.cookies.set('user-role', userRole, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid password' },
      { status: 401 }
    );
  } catch {
    // Don't expose internal errors
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
} 