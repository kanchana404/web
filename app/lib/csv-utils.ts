import Papa from 'papaparse';

export interface CSVProduct {
  name: string;
  unit: string;
  category: string;
  brand: string;
  stock: number;
  status: string;
  image: string;
}

export interface ImportResult {
  success: CSVProduct[];
  skipped: CSVProduct[];
  errors: string[];
}

export const parseCSV = (csvText: string): ImportResult => {
  const result: ImportResult = {
    success: [],
    skipped: [],
    errors: []
  };

  try {
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transform: (value) => value.trim()
    });

    if (parsed.errors.length > 0) {
      result.errors.push('CSV parsing errors found');
      return result;
    }

    const requiredColumns = ['name', 'unit', 'category', 'brand', 'stock', 'status', 'image'];
    const headers = Object.keys(parsed.data[0] || {});

    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      result.errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
      return result;
    }

    parsed.data.forEach((row: any, index: number) => {
      try {
        const product: CSVProduct = {
          name: row.name || '',
          unit: row.unit || '',
          category: row.category || '',
          brand: row.brand || '',
          stock: parseInt(row.stock) || 0,
          status: row.status || 'Out of Stock',
          image: row.image || ''
        };

        if (!product.name || !product.unit || !product.category || !product.brand) {
          result.errors.push(`Row ${index + 1}: Missing required fields`);
          return;
        }

        if (isNaN(product.stock) || product.stock < 0) {
          result.errors.push(`Row ${index + 1}: Invalid stock value`);
          return;
        }

        result.success.push(product);
      } catch (error) {
        result.errors.push(`Row ${index + 1}: Invalid data format`);
      }
    });
  } catch (error) {
    result.errors.push('Failed to parse CSV file');
  }

  return result;
};

export const generateCSV = (products: any[]): string => {
  const csvData = products.map(product => ({
    name: product.name,
    unit: product.unit,
    category: product.category,
    brand: product.brand,
    stock: product.stock,
    status: product.status,
    image: product.image
  }));

  return Papa.unparse(csvData);
};
