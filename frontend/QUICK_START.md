# 🚀 Frontend Quick Start Guide

## ⚡ 3-Step Quick Start

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Setup Environment
```bash
cp .env.example .env
```
Make sure your `.env` has the correct backend API URL:
```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### Step 3: Start Development Server
```bash
npm start
```
Your app will open at `http://localhost:3000` 🎉

---

## 📁 Project Structure Overview

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/        # Button, Input, Card, Loader, Modal
│   │   ├── layout/        # Navbar, Footer, Layout wrapper
│   │   └── auth/          # ProtectedRoute component
│   │
│   ├── pages/             # Page components
│   │   ├── auth/          # Login, Register pages
│   │   ├── Dashboard.jsx  # Main dashboard
│   │   ├── Profile.jsx    # User profile
│   │   └── Home.jsx       # Landing page
│   │
│   ├── services/          # API & business logic
│   │   ├── api.js         # Axios instance
│   │   └── authService.js # Auth API calls
│   │
│   ├── context/           # React Context
│   │   └── AuthContext.jsx # Auth state management
│   │
│   ├── utils/             # Utilities & constants
│   │   └── constants.js   # App-wide constants
│   │
│   ├── App.jsx            # Main app with routing
│   ├── index.jsx          # React DOM render
│   └── index.css          # Global Tailwind styles
│
├── index.html             # HTML entry point
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── Dockerfile             # Docker configuration
└── README.md              # Full documentation
```

---

## 🔄 Data Flow Architecture

```
User Interaction
       ↓
   Component
       ↓
   authService (API call)
       ↓
    api.js (axios)
       ↓
   Backend API
       ↓
   Response
       ↓
   AuthContext (state update)
       ↓
   Component Re-render
```

---

## 🧩 Component Hierarchy

```
App
├── Router
│   ├── Home (public)
│   ├── Login (public)
│   ├── Register (public)
│   ├── Dashboard (protected)
│   └── Profile (protected)
│
├── Layout (wrapper)
│   ├── Navbar
│   ├── Main Content
│   └── Footer
│
└── AuthProvider (context)
    └── useAuth hook
```

---

## 📋 Common Tasks

### Add a New Page

1. Create file in `src/pages/YourPage.jsx`:
```jsx
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

export const YourPage = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <h1>Your Page Content</h1>
      </Layout>
    </ProtectedRoute>
  );
};
export default YourPage;
```

2. Add route in `src/App.jsx`:
```jsx
<Route path="/your-page" element={<YourPage />} />
```

### Add a New Component

1. Create in `src/components/common/YourComponent.jsx`:
```jsx
export const YourComponent = ({ prop1, prop2 }) => {
  return <div>{/* Your JSX */}</div>;
};
export default YourComponent;
```

2. Import and use:
```jsx
import YourComponent from '../components/common/YourComponent';

<YourComponent prop1="value" />
```

### Make API Calls

1. Add method to `src/services/authService.js`:
```jsx
yourFunction: async (data) => {
  const response = await api.post('/your-endpoint', data);
  return response.data;
}
```

2. Use in component:
```jsx
import authService from '../services/authService';

const response = await authService.yourFunction(data);
```

---

## 🎨 Tailwind Custom Classes

Use these custom Tailwind classes in your components:

```css
.btn-primary       /* Primary button style */
.btn-secondary     /* Secondary button style */
.btn-danger        /* Danger button style */
.input-field       /* Input field style */
.card              /* Card container */
.error-text        /* Error message text */
.label-text        /* Form label text */
```

Example:
```jsx
<button className="btn-primary">Click Me</button>
<input className="input-field" />
<div className="card">Content</div>
```

---

## 🔐 Authentication Flow

### Registration
```
1. User fills register form
2. handleSubmit calls authService.register()
3. API returns token + user data
4. AuthContext.register() saves to localStorage
5. Redirect to /dashboard
```

### Login
```
1. User enters credentials
2. handleSubmit calls authService.login()
3. API returns token + user data
4. AuthContext.login() saves to localStorage
5. Redirect to /dashboard
```

### Protected Routes
```
1. User navigates to protected page
2. ProtectedRoute checks isAuthenticated
3. If authenticated → render page
4. If not → redirect to /login
```

---

## 📝 Form Validation Example

```jsx
const validateForm = () => {
  const newErrors = {};
  if (!formData.email) {
    newErrors.email = 'Email is required';
  }
  if (formData.password.length < 6) {
    newErrors.password = 'Min 6 characters';
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  // Proceed with API call
};
```

---

## 🎯 Testing the App

### 1. Test Registration
```
1. Go to http://localhost:3000/register
2. Fill the form with valid data
3. Submit
4. Should redirect to dashboard
```

### 2. Test Login
```
1. Go to http://localhost:3000/login
2. Use registered email and password
3. Submit
4. Should redirect to dashboard
```

### 3. Test Protected Routes
```
1. Logout from dashboard
2. Try to access http://localhost:3000/profile
3. Should redirect to login
```

### 4. Test Profile Update
```
1. Login
2. Go to /profile
3. Update profile fields
4. Click "Save Changes"
5. Should show success toast
```

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### API connection errors
Check your `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```
Restart dev server after changing .env

### Tailwind styles not showing
Rebuild Tailwind:
```bash
npm run build
```

### localhost:3000 not responding
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
npm start
```

---

## 🚀 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

To test production build locally:
```bash
npm install -g serve
serve -s build -l 3000
```

---

## 🐳 Docker Usage

### Build image
```bash
docker build -t innovatex-frontend .
```

### Run container
```bash
docker run -p 3000:3000 innovatex-frontend
```

Visit `http://localhost:3000`

---

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [TailwindCSS](https://tailwindcss.com)
- [Axios](https://axios-http.com)
- [Lucide Icons](https://lucide.dev)
- [React Hot Toast](https://react-hot-toast.com)

---

## 🔗 API Reference

See `/backend/API_PAYLOADS.md` for complete API documentation.

Quick endpoints:
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /profile` - Get profile (protected)
- `PUT /profile` - Update profile (protected)

---

## 💡 Tips

✅ Use React DevTools browser extension for debugging  
✅ Check Network tab in DevTools to inspect API calls  
✅ Use console.log for debugging  
✅ Keep components small and focused  
✅ Use TypeScript for larger projects  
✅ Test responsive design with DevTools device toolbar  

---

## 🆘 Need Help?

1. Check the `README.md` for detailed documentation
2. Review code comments in components
3. Check browser console for errors
4. Verify backend is running on port 5000
5. Ensure `.env` file is correctly configured

---

**Happy Coding! 🎉**

For full documentation, see `README.md`
