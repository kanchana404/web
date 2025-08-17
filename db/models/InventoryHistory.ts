import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryHistory extends Document {
  productId: mongoose.Types.ObjectId;
  oldQuantity: number;
  newQuantity: number;
  changeDate: Date;
  userId?: string;
  userName?: string;
}

const InventoryHistorySchema = new Schema<IInventoryHistory>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  oldQuantity: {
    type: Number,
    required: true
  },
  newQuantity: {
    type: Number,
    required: true
  },
  changeDate: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    default: 'system'
  },
  userName: {
    type: String,
    default: 'System'
  }
}, {
  timestamps: true
});

InventoryHistorySchema.index({ productId: 1, changeDate: -1 });

export default mongoose.models.InventoryHistory || mongoose.model<IInventoryHistory>('InventoryHistory', InventoryHistorySchema);
