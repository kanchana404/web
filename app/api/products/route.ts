import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/db';
import Product from '@/db/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const category = searchParams.get('category');
    
    let query: any = {};
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    console.log('Received product data:', body);
    
    const { name, unit, category, brand, stock, status, image } = body;
    
    if (!name || !unit || !category || !brand) {
      console.log('Missing fields:', { name, unit, category, brand });
      const missingFields = [];
      if (!name) missingFields.push('Name');
      if (!unit) missingFields.push('Unit');
      if (!category) missingFields.push('Category');
      if (!brand) missingFields.push('Brand');
      
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return NextResponse.json(
        { error: `A product with the name "${name}" already exists. Please use a different name.` },
        { status: 409 }
      );
    }
    
    const product = new Product({
      name,
      unit,
      category,
      brand,
      stock: stock || 0,
      status: stock > 0 ? 'In Stock' : 'Out of Stock',
      image: image || ''
    });
    
    await product.save();
    
 
    if (stock > 0) {
      const InventoryHistory = (await import('@/db/models/InventoryHistory')).default;
      const historyEntry = new InventoryHistory({
        productId: product._id,
        oldQuantity: 0,
        newQuantity: stock,
        userId: 'system',
        userName: 'System',
        changeDate: new Date()
      });
      await historyEntry.save();
    }
    
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
