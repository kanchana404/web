'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Download, Upload, Edit, Trash2, Eye, LogOut, User } from 'lucide-react';
import { useAuth } from '@/app/contexts/auth-context';

import { useToast } from '@/app/hooks/use-toast';
import { InventoryHistory } from '@/app/components/inventory-history';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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

export default function ProductsPage() {
  const { user, signOut, loading } = useAuth();
  
  console.log('Main page render - user:', user, 'loading:', loading);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [importing, setImporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const { toast } = useToast();

  const [newProduct, setNewProduct] = useState({
    name: '',
    unit: '',
    category: '',
    brand: '',
    stock: 0,
    image: ''
  });

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm || selectedCategory !== 'all') {
      searchProducts(searchTerm, selectedCategory);
    } else {
      setFilteredProducts(products);
      setCurrentPage(1);
    }
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products);
        const uniqueCategories = [...new Set(data.products.map((p: Product) => p.category))] as string[];
        setCategories(uniqueCategories);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch products',
          variant: 'destructive'
        });
      }
          } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch products',
          variant: 'destructive'
        });
      } finally {
        setProductsLoading(false);
      }
  };

  const searchProducts = async (searchTerm: string, category: string = 'all') => {
    try {
      setProductsLoading(true);
      let url = '/api/products/search?';
      
      if (searchTerm) {
        url += `name=${encodeURIComponent(searchTerm)}`;
      }
      
      if (category && category !== 'all') {
        url += searchTerm ? `&category=${encodeURIComponent(category)}` : `category=${encodeURIComponent(category)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setFilteredProducts(data.products);
        setCurrentPage(1);
      } else {
        toast({
          title: 'Search Error',
          description: 'Failed to search products',
          variant: 'destructive'
        });
      }
          } catch (error) {
        toast({
          title: 'Search Error',
          description: 'Failed to search products',
          variant: 'destructive'
        });
      } finally {
        setProductsLoading(false);
      }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };



  const handleCreateProduct = async () => {
    try {
      console.log('Sending product data:', newProduct);
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Product created successfully'
        });
        setNewProduct({ name: '', unit: '', category: '', brand: '', stock: 0, image: '' });
        fetchProducts();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to create product',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    try {
      const response = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Product updated successfully'
        });
        setEditingProduct(null);
        fetchProducts();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update product',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Product deleted successfully'
        });
        fetchProducts();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete product',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive'
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleImport called with event:', event);
    const file = event.target.files?.[0];
    console.log('Selected file:', file);
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please select a CSV file',
        variant: 'destructive'
      });
      event.target.value = '';
      return;
    }
    
    setImporting(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/products/import', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Import Complete',
          description: `Successfully imported ${result.results.added} products, skipped ${result.results.skipped} duplicates`
        });
        fetchProducts();
      } else {
        const error = await response.json();
        toast({
          title: 'Import Failed',
          description: error.error || 'Failed to import products',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import Failed',
        description: 'Network error occurred while importing products',
        variant: 'destructive'
      });
    }
    
    
    event.target.value = '';
    setImporting(false);
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/products/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export products',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access the product management system.</p>
          <div className="space-x-4">
            <a
              href="/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In
          </a>
          <a
              href="/signup"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-3 sm:p-4 md:p-6 border-b">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Product Management</h1>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Welcome, {user?.name}</span>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file"
                  aria-label="Import CSV file"
                  ref={(input) => {
                    if (input) {
                      input.setAttribute('data-testid', 'import-file-input');
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs sm:text-sm cursor-pointer"
                  disabled={importing}
                  onClick={() => {
                    console.log('Import button clicked');
                    const fileInput = document.getElementById('import-file') as HTMLInputElement;
                    if (fileInput) {
                      console.log('File input found, triggering click');
                      fileInput.click();
                    } else {
                      console.error('File input not found');
                    }
                  }}
                >
                  {importing ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-600 mr-1 sm:mr-2"></div>
                      <span className="hidden sm:inline">Importing...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Import</span>
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={handleExport}>
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs sm:text-sm"
                  onClick={() => {
                    const sampleCSV = 'name,unit,category,brand,stock,status,image\nSample Product,pieces,Electronics,Sample Brand,10,In Stock,https://example.com/image.jpg';
                    const blob = new Blob([sampleCSV], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'sample-products.csv';
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Sample CSV</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={signOut}
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            </div>
            
          
          
            
            {/* Products Count */}
            <div className="text-sm text-gray-600 mb-2">
              {filteredProducts.length > 0 ? (
                <span>
                  Showing {currentProducts.length} of {filteredProducts.length} products
                  {filteredProducts.length > productsPerPage && ` (Page ${currentPage} of ${totalPages})`}
                </span>
              ) : (
                <span>No products found</span>
              )}
            </div>
            
            {/* Search and Filter Section */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-4 mb-6">
              <div className="flex-1 min-w-0">
                <div className="relative flex">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        searchProducts(searchTerm, selectedCategory);
                      }
                    }}
                    className="pl-10 pr-20 text-sm"
                  />
                  <Button
                    onClick={() => searchProducts(searchTerm, selectedCategory)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-2 sm:px-3 text-xs sm:text-sm"
                    disabled={!searchTerm && selectedCategory === 'all'}
                  >
                    <span className="hidden sm:inline">Search</span>
                    <span className="sm:hidden">🔍</span>
                  </Button>
                  {(searchTerm || selectedCategory !== 'all') && (
                    <Button
                      onClick={clearSearch}
                      variant="outline"
                      className="absolute right-16 sm:right-20 top-1/2 transform -translate-y-1/2 h-8 px-2 sm:px-3 text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">Clear</span>
                      <span className="sm:hidden">✕</span>
                    </Button>
                  )}
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48 text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="w-full lg:w-auto text-xs sm:text-sm">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Add New Product</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                          id="unit"
                          value={newProduct.unit}
                          onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={newProduct.brand}
                          onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                          className="text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                          id="image"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <Button onClick={handleCreateProduct} className="w-full">
                      Create Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
                      {/* Mobile Card View */}
            <div className="block lg:hidden p-4 space-y-4">
              {productsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading products...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No products found</div>
              ) : (
                currentProducts.map((product) => (
                <div key={product._id} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Unit:</span>
                          <span>{product.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Category:</span>
                          <span>{product.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Brand:</span>
                          <span>{product.brand}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Stock:</span>
                          <span>{product.stock}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Status:</span>
                          <Badge variant={product.status === 'In Stock' ? 'default' : 'destructive'} className="text-xs">
                            {product.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowHistory(true);
                      }}
                      title="View inventory history"
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingProduct({ ...product })}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteProduct(product)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{product.name}&quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteProduct(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleDeleteProduct(product._id);
                              setDeleteProduct(null);
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )}
            
            {/* Mobile Pagination Controls */}
            {filteredProducts.length > productsPerPage && (
              <div className="px-4 py-3 border-t bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                  <div className="text-sm text-gray-700 text-center">
                    Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="h-8 px-3"
                    >
                      ← Previous
                    </Button>
                    
                    {/* Page Numbers - Simplified for mobile */}
                    <div className="flex items-center gap-1">
                      {currentPage > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(1)}
                          className="h-8 w-8 p-0"
                        >
                          1
                        </Button>
                      )}
                      
                      {currentPage > 3 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (currentPage <= 2) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 1) {
                          pageNumber = totalPages - 2 + i;
                        } else {
                          pageNumber = currentPage - 1 + i;
                        }
                        
                        if (pageNumber > 0 && pageNumber <= totalPages) {
                          return (
                            <Button
                              key={pageNumber}
                              variant={currentPage === pageNumber ? "default" : "outline"}
                              size="sm"
                              onClick={() => goToPage(pageNumber)}
                              className="h-8 w-8 p-0"
                            >
                              {pageNumber}
                            </Button>
                          );
                        }
                        return null;
                      })}
                      
                      {currentPage < totalPages - 2 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      
                      {currentPage < totalPages && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(totalPages)}
                          className="h-8 w-8 p-0"
                        >
                          {totalPages}
                        </Button>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="h-8 px-3"
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium max-w-xs truncate">{product.name}</TableCell>
                      <TableCell className="max-w-24 truncate">{product.unit}</TableCell>
                      <TableCell className="max-w-32 truncate">{product.category}</TableCell>
                      <TableCell className="max-w-32 truncate">{product.brand}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge variant={product.status === 'In Stock' ? 'default' : 'destructive'}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowHistory(true);
                            }}
                            title="View inventory history"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingProduct({ ...product })}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteProduct(product)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;{product.name}&quot;? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteProduct(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    handleDeleteProduct(product._id);
                                    setDeleteProduct(null);
                                  }}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Pagination Controls */}
            {filteredProducts.length > productsPerPage && (
              <div className="px-4 py-3 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="h-8 px-2"
                    >
                      Previous
                    </Button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(pageNumber)}
                            className="h-8 w-8 p-0"
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="h-8 px-2"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-unit">Unit</Label>
                  <Input
                    id="edit-unit"
                    value={editingProduct.unit}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-brand">Brand</Label>
                  <Input
                    id="edit-brand"
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="edit-image">Image URL</Label>
                  <Input
                    id="edit-image"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleUpdateProduct} className="flex-1">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showHistory && selectedProduct && (
        <InventoryHistory
          product={selectedProduct}
          open={showHistory}
          onOpenChange={setShowHistory}
        />
      )}
    </div>
  );
}
