import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/db';
import Product from '@/db/models/Product';
import { generateCSV } from '@/app/lib/csv-utils';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const products = await Product.find({}).sort({ createdAt: -1 });
    const csvContent = generateCSV(products);
    
    const response = new NextResponse(csvContent);
    response.headers.set('Content-Type', 'text/csv');
    response.headers.set('Content-Disposition', 'attachment; filename="products.csv"');
    
    return response;
  } catch (error) {
    console.error('Error exporting products:', error);
    return NextResponse.json(
      { error: 'Failed to export products' },
      { status: 500 }
    );
  }
}
