import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LandingPage, Login, Signup } from '../pages/Auth';
import {
  Wishlist,
  Cart,
  CategoryBrowse,
  Checkout,
  Orders,
  ProductDetail,
  Profile,
} from '../pages/User';
import { useAppSelector } from '../app/hooks';
import { Dashboard } from '../pages/Admin';
import BulkInquiry from '../pages/User/BulkInquiry';
import { AboutPage, FaqPage } from '../pages/User/InfoPages';
import BulkInquiriesAdmin from '../pages/Admin/BulkInquiries';
import {
  ProductManagement,
  ProductList,
  AddProduct,
  EditProduct,
  CategoriesManagement,
  InventoryManagement,
  ProductVariants,
  SKUManagement,
  BulkUpload,
  ProductImageUpload,

  OrderManagement,
  OrderList,
  OrderDetails,
  InvoiceGeneration,
  ReturnRequests,
  ShipmentManagement,

  CustomerManagement,
  CustomerList,
  CustomerDetails,
  ReviewsManagement,

  MarketingManagement,
  BannerManagement,
  CouponsDiscount,
  EmailMarketing,
  FlashSale,
  PushNotification,
  SocialCampaignLink,
  BusinessSettings,
  CMSPages,
  ContactDetails,
  PaymentGateway,
  ReportsAnalytics,
  ShippingCharges,
  TaxSettings,
} from '../pages/Admin';
import ProtectedRoute from './ProtectedRoute';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { COLORS, FONTS } from '../constant/style';

function AdminRouteWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    return localStorage.getItem('sidebar-minimized') === 'true';
  });

  const toggleMinimize = () => {
    setIsMinimized((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-minimized', String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F8F9FB', color: COLORS.text, fontFamily: FONTS.main }}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMinimized={isMinimized}
        onToggleMinimize={toggleMinimize}
      />

      <div className={`flex-1 flex flex-col min-h-screen overflow-hidden transition-all duration-300 ease-in-out ${isMinimized ? 'lg:ml-[80px]' : 'lg:ml-[260px]'}`}>
        <Navbar onMenuClick={() => setSidebarOpen(true)} isSidebarMinimized={isMinimized} />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function CustomerProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ message: "Please log in to continue." }} />;
  }
  return <>{children}</>;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:categorySlug" element={<CategoryBrowse />} />
        <Route path="/category/:categorySlug/:subCategorySlug" element={<CategoryBrowse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/bulk-inquiry" element={<BulkInquiry />} />
        <Route path="/faqs" element={<FaqPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Customer Routes (Protected) */}
        <Route path="/wishlist" element={<CustomerProtectedRoute><Wishlist /></CustomerProtectedRoute>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CustomerProtectedRoute><Checkout /></CustomerProtectedRoute>} />
        <Route path="/orders" element={<CustomerProtectedRoute><Orders /></CustomerProtectedRoute>} />
        <Route path="/profile" element={<CustomerProtectedRoute><Profile /></CustomerProtectedRoute>} />

        {/* Admin routes (protected) */}
        <Route path="/admin" element={<ProtectedRoute><AdminRouteWrapper /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/list" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/categories" element={<CategoriesManagement />} />
          <Route path="products/inventory" element={<InventoryManagement />} />
          <Route path="products/variants" element={<ProductVariants />} />
          <Route path="products/sku" element={<SKUManagement />} />
          <Route path="products/upload" element={<BulkUpload />} />
          <Route path="products/images" element={<ProductImageUpload />} />

          <Route path="orders" element={<OrderManagement />} />
          <Route path="orders/list" element={<OrderList />} />
          <Route path="orders/details" element={<OrderDetails />} />
          <Route path="orders/invoices" element={<InvoiceGeneration />} />
          <Route path="orders/returns" element={<ReturnRequests />} />
          <Route path="orders/shipments" element={<ShipmentManagement />} />

          <Route path="customers" element={<CustomerManagement />} />
          <Route path="customers/list" element={<CustomerList />} />
          <Route path="customers/details" element={<CustomerDetails />} />
          <Route path="customers/reviews" element={<ReviewsManagement />} />

          <Route path="marketing" element={<MarketingManagement />} />
          <Route path="marketing/banners" element={<BannerManagement />} />
          <Route path="marketing/coupons" element={<CouponsDiscount />} />
          <Route path="marketing/email" element={<EmailMarketing />} />
          <Route path="marketing/flash-sale" element={<FlashSale />} />
          <Route path="marketing/notifications" element={<PushNotification />} />
          <Route path="marketing/social" element={<SocialCampaignLink />} />
          <Route path="bulk-inquiries" element={<BulkInquiriesAdmin />} />
          <Route path="settings" element={<BusinessSettings />} />
          <Route path="settings/cms" element={<CMSPages />} />
          <Route path="settings/contact" element={<ContactDetails />} />
          <Route path="settings/payment" element={<PaymentGateway />} />
          <Route path="settings/reports" element={<ReportsAnalytics />} />
          <Route path="settings/shipping" element={<ShippingCharges />} />
          <Route path="settings/tax" element={<TaxSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
