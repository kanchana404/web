import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/db';
import Product from '@/db/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const category = searchParams.get('category');
    
    if (!name && !category) {
      return NextResponse.json(
        { error: 'Please provide a search term or select a category' },
        { status: 400 }
      );
    }
    
    let query: any = {};
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    if (category && category !== 'all') {
      query.category = { $regex: category, $options: 'i' };
    }
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(100);
    
    return NextResponse.json({ 
      products,
      searchQuery: { name, category },
      totalResults: products.length
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
