import { NextResponse } from 'next/server';
import { getMarketDataSummary, getMarketDataForSymbols } from '@/services/marketDataService';
import { validateRequestSize, SECURITY_CONFIG } from '@/lib/security';

export async function GET(request: Request) {
  // Validate request size
  const contentLength = request.headers.get('content-length');
  if (!validateRequestSize(contentLength, SECURITY_CONFIG.maxRequestSize)) {
    return NextResponse.json(
      { error: 'Request too large' },
      { status: 413 }
    );
  }
  try {
    const summary = await getMarketDataSummary();
    const sampleData = await getMarketDataForSymbols(['AAPL', 'MSFT', 'GOOGL']);
    
    return NextResponse.json({
      summary,
      sampleData,
      message: 'Market data loaded successfully'
    });
  } catch (error) {
    console.error('Error testing market data:', error);
    return NextResponse.json({ error: 'Failed to load market data' }, { status: 500 });
  }
}
