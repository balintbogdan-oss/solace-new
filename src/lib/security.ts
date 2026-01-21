// Security utilities for request validation and limits

export interface SecurityConfig {
  maxRequestSize: number;
  maxPasswordLength: number;
  allowedContentTypes: string[];
  rateLimitWindow: number;
  maxRateLimitAttempts: number;
}

export const SECURITY_CONFIG: SecurityConfig = {
  maxRequestSize: 1024 * 1024, // 1MB default
  maxPasswordLength: 100,
  allowedContentTypes: ['application/json'],
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  maxRateLimitAttempts: 5
};

export function validateRequestSize(contentLength: string | null, maxSize: number): boolean {
  if (!contentLength) return true; // Allow if no content-length header
  return parseInt(contentLength) <= maxSize;
}

export function validateContentType(contentType: string | null, allowedTypes: string[]): boolean {
  if (!contentType) return false;
  return allowedTypes.some(type => contentType.includes(type));
}

export function sanitizeString(input: string, maxLength: number): string {
  return input.trim().slice(0, maxLength);
}

export function validateStringInput(input: unknown, maxLength: number): { isValid: boolean; error?: string; sanitized?: string } {
  if (typeof input !== 'string') {
    return { isValid: false, error: 'Input must be a string' };
  }
  
  if (input.length === 0) {
    return { isValid: false, error: 'Input is required' };
  }
  
  if (input.length > maxLength) {
    return { isValid: false, error: `Input is too long (max ${maxLength} characters)` };
  }
  
  // Check for potentially malicious content
  if (/[<>\"'&]/.test(input)) {
    return { isValid: false, error: 'Input contains invalid characters' };
  }
  
  return { 
    isValid: true, 
    sanitized: sanitizeString(input, maxLength) 
  };
}

export function createSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
  };
}
