import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  unit: string;
  category: string;
  brand: string;
  stock: number;
  status: 'In Stock' | 'Out of Stock';
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['In Stock', 'Out of Stock'],
    default: 'Out of Stock'
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

ProductSchema.pre('save', function(next) {
  if (this.stock > 0) {
    this.status = 'In Stock';
  } else {
    this.status = 'Out of Stock';
  }
  next();
});

ProductSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  if (update.stock !== undefined) {
    update.status = update.stock > 0 ? 'In Stock' : 'Out of Stock';
  }
  next();
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
