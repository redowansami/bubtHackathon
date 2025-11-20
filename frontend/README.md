# INNOVATEX Frontend

A modern React frontend for the AI-Powered Food Management & Sustainability Platform.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your API URL:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api/v1
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## 📦 Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Notification system

## 🏗️ Project Structure

```
frontend/src/
├── components/
│   ├── common/          # Reusable components (Button, Input, Card, etc.)
│   ├── layout/          # Layout components (Navbar, Footer, Layout)
│   └── auth/            # Auth-related components (ProtectedRoute)
├── pages/
│   ├── auth/            # Authentication pages (Login, Register)
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Profile.jsx      # User profile page
│   └── Home.jsx         # Landing page
├── services/
│   ├── api.js           # Axios instance with interceptors
│   └── authService.js   # Authentication API calls
├── context/
│   └── AuthContext.jsx  # Authentication context and provider
├── utils/
│   └── constants.js     # Constants and utility functions
├── App.jsx              # Main app component
└── index.css            # Global styles with Tailwind
```

## 📄 Pages

### Authentication
- **Login** (`/login`) - User login with email and password
- **Register** (`/register`) - User registration with 2-step form

### Protected Pages (require authentication)
- **Dashboard** (`/dashboard`) - Overview with stats and quick actions
- **Profile** (`/profile`) - User profile management

### Public Pages
- **Home** (`/`) - Landing page with features and CTA

## 🔐 Authentication

The app uses JWT-based authentication:
- Tokens are stored in localStorage
- API calls automatically include the token in headers
- Expired tokens redirect to login
- Protected routes use ProtectedRoute component

## 🎨 Styling

All styling is done with **TailwindCSS**:
- Green primary color theme (#22c55e)
- Orange accent color for food items (#fb923c)
- Responsive design with mobile-first approach
- Custom components with `@apply` directives

### Custom Component Classes
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.input-field` - Input field style
- `.card` - Card container style

## 🔌 API Integration

The frontend connects to the backend at `/api/v1`:

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Profile Endpoints
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update user profile (protected)

### Error Handling
- All API errors display as toast notifications
- 401 errors automatically redirect to login
- Form validation errors display inline

## 🛠️ Development

### Available Scripts

```bash
# Start development server with hot reload
npm start

# Build for production
npm build

# Run tests
npm test

# Eject configuration (one-way operation)
npm eject
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

## 📱 Responsive Design

The frontend is fully responsive:
- **Mobile** - Single column layout, hamburger menu
- **Tablet** - 2-column grid for cards
- **Desktop** - 3-4 column grid for optimal spacing

## 🎯 Features Implemented (Phase 1)

✅ User Registration with validation  
✅ User Login with JWT  
✅ Protected Routes  
✅ User Profile View & Edit  
✅ Responsive Navbar & Footer  
✅ Dashboard with stat cards  
✅ Landing page with features  
✅ Form validation  
✅ Error handling & notifications  
✅ Mobile-responsive design  

## 🚀 Future Enhancements (Phase 2)

- Inventory management
- Consumption logging
- Image uploads
- Sustainability resources
- Dashboard analytics
- AI-powered recommendations

## 📝 Notes

- All components are functional components using React Hooks
- State management uses React Context API
- No additional state management library needed for Phase 1
- Follow React and Tailwind best practices
- Code is well-commented and organized

## 🤝 Contributing

When adding new features:
1. Keep components modular and reusable
2. Follow the existing folder structure
3. Use TailwindCSS for styling
4. Add proper error handling
5. Update documentation

## 📞 Support

For issues or questions, please refer to:
- Backend documentation: `../backend/README.md`
- API Payloads: `../backend/API_PAYLOADS.md`
- Project specification: `../agent.md`

---

**Version:** 1.0.0  
**Status:** Phase 1 Complete  
**Last Updated:** February 18, 2025
