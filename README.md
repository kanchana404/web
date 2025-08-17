# 🚀 Product Management System

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

A comprehensive, full-stack product management application built with Next.js 15, React 19, TypeScript, and MongoDB. Features include product CRUD operations, CSV import/export, inventory tracking, authentication, and responsive design.

## ✨ Features

### 🔐 Authentication & Security
- **User Registration & Login** - Secure sign-up and sign-in with JWT tokens
- **Cookie-based Authentication** - HTTP-only cookies for enhanced security
- **Protected Routes** - Middleware protection for all API endpoints
- **Role-based Access** - Admin and user role management

### 📦 Product Management
- **CRUD Operations** - Create, read, update, and delete products
- **Real-time Search** - Instant product search with name and category filtering
- **Category Management** - Dynamic category filtering and organization
- **Stock Tracking** - Automatic status updates based on inventory levels

### 📊 Data Import/Export
- **CSV Import** - Bulk product upload with duplicate detection
- **CSV Export** - Download complete product catalog
- **Validation** - File type and data format validation
- **Error Handling** - Comprehensive error reporting and user feedback

### 📱 Responsive Design
- **Mobile-First Approach** - Optimized for all screen sizes
- **Adaptive Layouts** - Different views for mobile and desktop
- **Touch-Friendly** - Mobile-optimized controls and interactions

### 🔍 Advanced Features
- **Inventory History** - Track all stock changes with timestamps
- **Pagination** - Efficient product browsing (10 products per page)
- **Toast Notifications** - User-friendly feedback system
- **Alert Dialogs** - Confirmation dialogs for destructive actions

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features and hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT Authentication** - Secure token-based auth
- **bcryptjs** - Password hashing and security

### Development Tools
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing and optimization
- **Lucide React** - Beautiful, customizable icons

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js 18+** installed on your system
- **MongoDB** running locally or MongoDB Atlas account
- **Git** for version control
- **npm** or **yarn** package manager

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kanchana404/web
cd web
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/product-management?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Environment
NODE_ENV=development
```

### 4. Database Setup

#### Option A: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and update `.env.local`
4. Whitelist your IP address

#### Option B: Local MongoDB
1. Install MongoDB Community Server
2. Start the MongoDB service
3. Use connection string: `mongodb://localhost:27017/product-management`

### 5. Run the Application

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user info

### Products
- `GET /api/products` - Fetch all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/search` - Search products
- `GET /api/products/export` - Export products to CSV
- `POST /api/products/import` - Import products from CSV

### Inventory History
- `GET /api/products/:id/history` - Get product inventory history

## 📁 CSV Format

### Import Format
Your CSV file should contain the following columns:

```csv
name,unit,category,brand,stock,status,image
Product Name,pieces,Electronics,Brand Name,10,In Stock,https://example.com/image.jpg
```

### Column Descriptions
- **name** - Product name (required, must be unique)
- **unit** - Unit of measurement (e.g., pieces, kg, liters)
- **category** - Product category
- **brand** - Brand name
- **stock** - Current stock quantity (numeric)
- **status** - Stock status (auto-calculated if not provided)
- **image** - Product image URL

## 🎯 Usage Guide

### 1. Getting Started
1. **Sign Up** - Create a new account
2. **Sign In** - Access your dashboard
3. **Add Products** - Use the "Add New Product" button or import CSV

### 2. Product Management
- **Search** - Use the search bar to find specific products
- **Filter** - Select categories to narrow down results
- **Edit** - Click the edit button to modify product details
- **Delete** - Remove products with confirmation dialog

### 3. Bulk Operations
- **Import** - Upload CSV files for bulk product creation
- **Export** - Download your complete product catalog
- **Sample CSV** - Download template for proper formatting

### 4. Inventory Tracking
- **View History** - Click the eye icon to see stock changes
- **Real-time Updates** - Stock status updates automatically
- **Change Logs** - Track all inventory modifications

## 🧪 Testing

### Manual Testing
1. **Authentication Flow**
   - Test user registration
   - Test login/logout
   - Verify protected route access

2. **Product Operations**
   - Create, edit, delete products
   - Test search and filtering
   - Verify pagination

3. **Import/Export**
   - Test CSV import with sample data
   - Verify export functionality
   - Check error handling

### Automated Testing
```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push

### Other Platforms
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS deployment

## 🔒 Security Features

- **JWT Token Security** - Secure token generation and validation
- **Password Hashing** - bcrypt with 12 salt rounds
- **HTTP-Only Cookies** - XSS protection
- **Input Validation** - Server-side data validation
- **CORS Protection** - Cross-origin request handling

## 📱 Responsive Design

### Mobile View
- **Card Layout** - Touch-friendly product cards
- **Simplified Navigation** - Optimized for small screens
- **Mobile Pagination** - Swipe-friendly controls

### Desktop View
- **Table Layout** - Full-featured data table
- **Advanced Controls** - Comprehensive navigation options
- **Keyboard Shortcuts** - Enhanced productivity

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure responsive design compatibility
- Add proper error handling
- Include user feedback mechanisms

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Issues** - Report bugs or request features on GitHub
- **Discussions** - Ask questions in GitHub Discussions
- **Documentation** - Check this README and code comments

### Common Issues
1. **MongoDB Connection** - Verify connection string and network access
2. **Authentication Errors** - Check JWT secret and cookie settings
3. **Import Failures** - Validate CSV format and column names
4. **Build Errors** - Ensure Node.js version compatibility

## 📈 Roadmap

### Upcoming Features
- [ ] **Advanced Analytics** - Product performance metrics
- [ ] **Barcode Integration** - QR code generation and scanning
- [ ] **Multi-language Support** - Internationalization
- [ ] **Advanced Search** - Full-text search with filters
- [ ] **API Rate Limiting** - Enhanced security measures

### Performance Improvements
- [ ] **Database Indexing** - Optimized query performance
- [ ] **Caching Layer** - Redis integration for speed
- [ ] **Image Optimization** - Automatic image compression
- [ ] **Lazy Loading** - Progressive data loading

## 🏗️ Architecture

### Project Structure
```
product-management-system/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utility functions
│   └── page.tsx           # Main application page
├── db/                    # Database configuration
│   ├── models/            # Mongoose schemas
│   └── index.ts           # Database connection
├── components/            # shadcn/ui components
├── public/                # Static assets
└── middleware.ts          # Authentication middleware
```

### Data Flow
1. **User Authentication** → JWT token generation
2. **API Requests** → Middleware validation
3. **Database Operations** → Mongoose ODM
4. **State Management** → React hooks and context
5. **UI Updates** → Real-time component rendering

## 🎨 UI Components

### Built with shadcn/ui
- **Button** - Various button styles and variants
- **Input** - Form input components
- **Dialog** - Modal dialogs and forms
- **Table** - Data table with sorting
- **Badge** - Status indicators
- **Toast** - Notification system
- **Alert Dialog** - Confirmation dialogs

### Custom Components
- **Product Card** - Mobile-optimized product display
- **Inventory History** - Stock change tracking
- **Pagination Controls** - Page navigation
- **Search Interface** - Advanced search functionality

## 🔄 State Management

### React Hooks
- **useState** - Local component state
- **useEffect** - Side effects and lifecycle
- **useContext** - Global authentication state
- **Custom Hooks** - Reusable logic extraction

### Context Providers
- **AuthContext** - User authentication state
- **ToastProvider** - Notification management

## 📊 Performance

### Optimization Techniques
- **Code Splitting** - Automatic route-based splitting
- **Image Optimization** - Next.js Image component
- **Lazy Loading** - Component and data lazy loading
- **Database Indexing** - Optimized query performance

### Monitoring
- **Console Logging** - Development debugging
- **Error Boundaries** - Graceful error handling
- **Performance Metrics** - Core Web Vitals tracking

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **shadcn/ui** - Beautiful component library
- **MongoDB** - Robust database solution
- **Tailwind CSS** - Utility-first CSS framework

---

**Made with ❤️ by kanchana404**

For questions, issues, or contributions, please visit our [GitHub repository](https://github.com/kanchana404/web).