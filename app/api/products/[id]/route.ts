import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/db';
import Product from '@/db/models/Product';
import InventoryHistory from '@/db/models/InventoryHistory';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { name, unit, category, brand, stock, image } = body;
    
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    const oldStock = product.stock;
    
    if (name && name !== product.name) {
      const existingProduct = await Product.findOne({ name });
      if (existingProduct) {
        return NextResponse.json(
          { error: `A product with the name "${name}" already exists. Please use a different name.` },
          { status: 409 }
        );
      }
    }
    
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (unit !== undefined) updateData.unit = unit;
    if (category !== undefined) updateData.category = category;
    if (brand !== undefined) updateData.brand = brand;
    if (stock !== undefined) updateData.stock = stock;
    if (image !== undefined) updateData.image = image;
    
    // Always update status when stock changes
    if (stock !== undefined) {
      updateData.status = stock > 0 ? 'In Stock' : 'Out of Stock';
    }
    
    if (stock !== undefined && stock !== oldStock) {
      const historyEntry = new InventoryHistory({
        productId: product._id,
        oldQuantity: oldStock,
        newQuantity: stock,
        userId: 'system',
        userName: 'System'
      });
      await historyEntry.save();
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
