'use client';

import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Product {
  _id: string;
  name: string;
  unit: string;
  category: string;
  brand: string;
  stock: number;
  status: 'In Stock' | 'Out of Stock';
  image: string;
}

interface InventoryHistoryEntry {
  _id: string;
  productId: string;
  oldQuantity: number;
  newQuantity: number;
  changeDate: string;
  userId: string;
  userName: string;
}

interface InventoryHistoryProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InventoryHistory({ product, open, onOpenChange }: InventoryHistoryProps) {
  const [history, setHistory] = useState<InventoryHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && product._id) {
      fetchHistory();
    }
  }, [open, product._id]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${product._id}/history`);
      const data = await response.json();
      
      if (response.ok) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Failed to fetch inventory history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getChangeType = (oldQty: number, newQty: number) => {
    if (oldQty === 0 && newQty > 0) return 'initial';
    if (newQty > oldQty) return 'increase';
    if (newQty < oldQty) return 'decrease';
    return 'no-change';
  };

  const getChangeAmount = (oldQty: number, newQty: number) => {
    const diff = newQty - oldQty;
    return diff > 0 ? `+${diff}` : diff.toString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[80vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Inventory History - {product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Stock</p>
              <p className="text-xl sm:text-2xl font-bold">{product.stock} {product.unit}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <Badge variant={product.status === 'In Stock' ? 'default' : 'destructive'}>
                {product.status}
              </Badge>
            </div>
          </div>
          
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <h3 className="text-base sm:text-lg font-semibold">Change History</h3>
              {history.length > 0 && (
                <div className="text-xs sm:text-sm text-gray-500">
                  {history.length} change{history.length !== 1 ? 's' : ''} recorded
                </div>
              )}
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="mb-2">
                  <p className="text-sm text-gray-400">This product was created with {product.stock} {product.unit}</p>
                  <p className="text-sm text-gray-400">No stock changes have been recorded yet</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Mobile Card View */}
                <div className="block sm:hidden space-y-3">
                  {history.map((entry) => {
                    const changeType = getChangeType(entry.oldQuantity, entry.newQuantity);
                    const changeAmount = getChangeAmount(entry.oldQuantity, entry.newQuantity);
                    
                    return (
                      <div key={entry._id} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(entry.changeDate)}
                          </span>
                          <Badge 
                            variant={
                              changeType === 'initial' ? 'secondary' :
                              changeType === 'increase' ? 'default' : 
                              changeType === 'decrease' ? 'destructive' : 
                              'secondary'
                            }
                            className="text-xs"
                          >
                            {changeType === 'initial' ? 'Initial Stock' : changeAmount} {product.unit}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Previous:</span> {entry.oldQuantity} {product.unit}
                          </div>
                          <div>
                            <span className="font-medium">New:</span> {entry.newQuantity} {product.unit}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Updated by: {entry.userName}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Previous Stock</TableHead>
                        <TableHead>New Stock</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Updated By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((entry) => {
                        const changeType = getChangeType(entry.oldQuantity, entry.newQuantity);
                        const changeAmount = getChangeAmount(entry.oldQuantity, entry.newQuantity);
                        
                        return (
                          <TableRow key={entry._id}>
                            <TableCell className="text-sm">{formatDate(entry.changeDate)}</TableCell>
                            <TableCell className="text-sm">{entry.oldQuantity} {product.unit}</TableCell>
                            <TableCell className="text-sm">{entry.newQuantity} {product.unit}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  changeType === 'initial' ? 'secondary' :
                                  changeType === 'increase' ? 'default' : 
                                  changeType === 'decrease' ? 'destructive' : 
                                  'secondary'
                                }
                                className="text-xs"
                              >
                                {changeType === 'initial' ? 'Initial Stock' : changeAmount} {product.unit}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{entry.userName}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
