import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/db';
import Product from '@/db/models/Product';
import { parseCSV } from '@/app/lib/csv-utils';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Please select a CSV file to import' },
        { status: 400 }
      );
    }
    
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Please select a valid CSV file. Only .csv files are supported.' },
        { status: 400 }
      );
    }
    
    const csvText = await file.text();
    const parseResult = parseCSV(csvText);
    
    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { error: 'CSV file contains errors. Please check the file format and try again.', details: parseResult.errors },
        { status: 400 }
      );
    }
    
    const results = {
      added: 0,
      skipped: 0,
      duplicates: [] as any[]
    };
    
    for (const productData of parseResult.success) {
      try {
        const existingProduct = await Product.findOne({ name: productData.name });
        
        if (existingProduct) {
          results.skipped++;
          results.duplicates.push({
            ...productData,
            reason: 'Product name already exists'
          });
          continue;
        }
        
        const product = new Product({
          name: productData.name,
          unit: productData.unit,
          category: productData.category,
          brand: productData.brand,
          stock: productData.stock,
          status: productData.stock > 0 ? 'In Stock' : 'Out of Stock',
          image: productData.image
        });
        
        await product.save();
        results.added++;
      } catch (error) {
        results.skipped++;
        results.duplicates.push({
          ...productData,
          reason: 'Validation error'
        });
      }
    }
    
    return NextResponse.json({
      message: 'Import completed',
      results
    });
  } catch (error) {
    console.error('Error importing products:', error);
    return NextResponse.json(
      { error: 'Failed to import products' },
      { status: 500 }
    );
  }
}
