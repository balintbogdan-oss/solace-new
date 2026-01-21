import { NextResponse } from 'next/server';
import { validateEnvironment } from '@/lib/env-validation';

export async function GET() {
  try {
    const validation = validateEnvironment();
    
    if (!validation.isValid) {
      return NextResponse.json({
        status: 'error',
        message: 'Environment validation failed',
        details: {
          missing: validation.missing,
          invalid: validation.invalid,
          warnings: validation.warnings
        }
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Environment validation passed',
      warnings: validation.warnings
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Environment validation error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
