import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import rollbarConfig from './rollbar'

import Layout from './components/layout/Layout'
import Home from './components/Home/Home'
import Collection from './components/Collection/Collection'
import ProductDetails from './components/Collection/ProductDetails'
import CheckOut from './components/Order/CheckOut'
import Profile from './components/Profile/Profile'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import AdminGuard from './components/Admin/AdminGuard'
import AdminLogin from './components/Admin/AdminLogin'
import NotFound from './components/Auth/NotFound'
import OurStory from './components/OurStory/OurStory'
import BottlesPage from './components/Collection/BottlesPage'
import BottleDetails from './components/Collection/BottleDetails'
import Offers from './components/Offers/Offers'
import Admin from './components/Admin/Admin'



const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <Layout><Home /></Layout> },
      { path: '/products', element: <Layout><Collection /></Layout> },
      { path: '/bottles', element: <Layout><BottlesPage /></Layout> },
      { path: '/bottles/:id', element: <Layout><BottleDetails /></Layout> },
      { path: '/product-details/:id', element: <Layout><ProductDetails /></Layout> },
      { path: '/offers', element: <Layout><Offers /></Layout> },
      { path: '/checkout', element: <Layout><CheckOut /></Layout> },
      { path: '/profile', element: <Layout><Profile /></Layout> },
    ],
  },
  { path: '/login', element: <Layout><Login /></Layout> },
  { path: '/signup', element: <Layout><Signup /></Layout> },
  { path: '/ourstory', element: <Layout><OurStory/></Layout> },
  { path: '/not-found', element: <Layout><NotFound /></Layout> },
  { path: '/admin/login', element: <Layout><AdminLogin /></Layout> },
  {
    path: '/admin',
    element: <Layout><AdminGuard /></Layout>,
    children: [
      { path: '/admin', element: <Admin /> },
    ],
  },
  { path: '*', element: <Layout><NotFound /></Layout> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </RollbarProvider>
  </StrictMode>,
)