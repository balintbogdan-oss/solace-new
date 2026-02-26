import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Simple in-memory cache with TTL
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute

function getCachedData(key: string): unknown {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  try {
    const { file: fileName } = await params;
    
    // Security: Only allow specific JSON files
    const allowedFiles = ['clients.json', 'accounts.json', 'holdings.json', 'households.json'];
    if (!allowedFiles.includes(fileName)) {
      return NextResponse.json({ error: 'File not allowed' }, { status: 403 });
    }

    // Check cache first
    const cacheKey = `data_${fileName}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const filePath = path.join(process.cwd(), 'src', 'data', fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read and return file contents
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContents);

    // Cache the result
    setCachedData(cacheKey, data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return NextResponse.json(
      { error: 'Failed to read data file' },
      { status: 500 }
    );
  }
}

