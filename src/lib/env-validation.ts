// Environment variable validation and startup checks

export interface EnvConfig {
  ADMIN_PASSWORD: string;
  NODE_ENV: string;
}

export interface ValidationResult {
  isValid: boolean;
  missing: string[];
  invalid: string[];
  warnings: string[];
}

// Required environment variables
const REQUIRED_ENV_VARS = [
  'ADMIN_PASSWORD'
] as const;

// Optional environment variables with defaults
const OPTIONAL_ENV_VARS = {
  'NODE_ENV': 'development'
} as const;

// Validation patterns
const VALIDATION_PATTERNS = {
  ADMIN_PASSWORD: /^.{8,}$/, // At least 8 characters
  NODE_ENV: /^(development|production|test)$/
} as const;

export function validateEnvironment(): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    missing: [],
    invalid: [],
    warnings: []
  };

  // Check required variables
  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName];
    
    if (!value) {
      result.missing.push(varName);
      result.isValid = false;
      continue;
    }

    // Validate format if pattern exists
    const pattern = VALIDATION_PATTERNS[varName as keyof typeof VALIDATION_PATTERNS];
    if (pattern && !pattern.test(value)) {
      result.invalid.push(varName);
      result.isValid = false;
    }
  }

  // Check optional variables
  for (const [varName, defaultValue] of Object.entries(OPTIONAL_ENV_VARS)) {
    const value = process.env[varName] || defaultValue;
    
    const pattern = VALIDATION_PATTERNS[varName as keyof typeof VALIDATION_PATTERNS];
    if (pattern && !pattern.test(value)) {
      result.warnings.push(`${varName} has invalid format, using default: ${defaultValue}`);
    }
  }

  // Security warnings
  if (process.env.ADMIN_PASSWORD === 'advisor') {
    result.warnings.push('ADMIN_PASSWORD is using default value - change in production!');
  }

  if (process.env.NODE_ENV === 'production' && (process.env.ADMIN_PASSWORD?.length || 0) < 12) {
    result.warnings.push('ADMIN_PASSWORD should be at least 12 characters in production');
  }

  return result;
}

export function getValidatedEnv(): EnvConfig {
  const validation = validateEnvironment();
  
  if (!validation.isValid) {
    const errorMessage = [
      '❌ Environment validation failed:',
      ...validation.missing.map(v => `  • Missing: ${v}`),
      ...validation.invalid.map(v => `  • Invalid format: ${v}`),
      '',
      'Please check your .env.local file and ensure all required variables are set correctly.'
    ].join('\n');
    
    throw new Error(errorMessage);
  }

  // Warnings are available in validation result but not logged

  return {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
    NODE_ENV: process.env.NODE_ENV || 'development'
  };
}

export function createEnvErrorPage(missing: string[], invalid: string[]): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Configuration Error - Solace Demo</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .error { color: #dc2626; font-weight: 600; margin-bottom: 20px; }
        .list { margin: 10px 0; }
        .list li { margin: 5px 0; padding: 5px; background: #fef2f2; border-left: 3px solid #dc2626; }
        .code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="error">❌ Configuration Error</h1>
        <p>Your application is missing required environment variables. Please check your <span class="code">.env.local</span> file.</p>
        
        ${missing.length > 0 ? `
        <h3>Missing Variables:</h3>
        <ul class="list">
            ${missing.map(v => `<li><span class="code">${v}</span></li>`).join('')}
        </ul>
        ` : ''}
        
        ${invalid.length > 0 ? `
        <h3>Invalid Variables:</h3>
        <ul class="list">
            ${invalid.map(v => `<li><span class="code">${v}</span> has invalid format</li>`).join('')}
        </ul>
        ` : ''}
        
        <div class="footer">
            <p>Create a <span class="code">.env.local</span> file in your project root with the required variables.</p>
        </div>
    </div>
</body>
</html>`;
}
