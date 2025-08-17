import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/db';
import InventoryHistory from '@/db/models/InventoryHistory';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const history = await InventoryHistory.find({ productId: params.id })
      .sort({ changeDate: -1 })
      .limit(50);
    
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching inventory history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory history' },
      { status: 500 }
    );
  }
}
