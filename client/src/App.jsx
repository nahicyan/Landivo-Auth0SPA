// client/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Layout from "./components/Layout/Layout";
import AdminLayout from "./components/Layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import Site from "./pages/Site";
import Properties from "./pages/Properties/Properties";
import PropertyWithTracking from "./pages/Property/PropertyWithTracking";
import OfferTable from "./components/OfferTable/OfferTable";
import AddProperty from "./pages/AddProperty/AddProperty";
import { UserProvider } from "./utils/UserContext";
import { VipBuyerProvider } from "./utils/VipBuyerContext";
import EditProperty from "./pages/EditProperty/EditProperty";
import DFW from "./pages/DFW/DFW";
import Austin from "./pages/Austin/Austin";
import Houston from "./pages/Houston/Houston";
import SanAntonio from "./pages/SanAntonio/SanAntonio";
import OtherLands from "./pages/OtherLands/OtherLands";
import Financing from "./pages/Financing/Financing";
import AboutUs from "./pages/AboutUs/AboutUs";
import Support from "./pages/Support/Support";
import Admin from "./pages/Admin/Admin";
import CreateUser from "./pages/CreateUser/CreateUser";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Sell from "./pages/Sell/Sell";
import Qualify from "./pages/Qualify/Qualify";
import QualificationsDashboard from "./components/QualificationsDashboard/QualificationsDashboard";
import Subscription from "./pages/Subscription/Subscription";
import VipSignupForm from "./pages/Subscription/VipSignupForm";
import AdminUsers from "./pages/AdminUsers/AdminUsers";
import UserDetail from "./components/UserDetail/UserDetail";
import AdminBuyers from "./pages/AdminBuyers/AdminBuyers";
import BuyerDetail from "./components/BuyerDetail/BuyerDetail";
import CreateBuyer from "./components/CreateBuyer/CreateBuyer";
import EditBuyer from "./components/EditBuyer/EditBuyer";
import BuyerOffers from "./components/BuyerOffers/BuyerOffers";
import BuyerLists from "./components/BuyerLists/BuyerLists";
import Profile from "./pages/Profile/Profile";
import VipSignupSuccess from "./pages/Subscription/VipSignupSuccess";
import AdminDeals from "./pages/AdminDeals/AdminDeals";
import CreateDealForm from "@/components/Deal/CreateDealForm";
import DealDetail from "@/components/Deal/DealDetail";
import DealFinancialSummary from "@/components/Deal/DealFinancialSummary";
import DealsList from "@/components/Deal/DealsList";
import PaymentList from "@/components/Deal/PaymentList";
import { Auth0ProviderWithNavigate } from "./components/Auth0/Auth0Provider";
import { PermissionsProvider } from "./components/Auth0/PermissionsContext";
import { PERMISSIONS } from "./utils/permissions";
import { ActivityTrackingProvider } from "./components/ActivityTracking/ActivityTrackingProvider";

import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Auth0ProviderWithNavigate>
              <PermissionsProvider>
                {/* Add VipBuyerProvider to make VIP status available throughout the app */}
                <VipBuyerProvider>
                  {/* Wrap with ActivityTrackingProvider to enable tracking for VIP buyers */}
                  <ActivityTrackingProvider>
                    <ScrollToTop />
                    <Routes>
                      {/* Public routes - accessible to all */}
                      <Route element={<Layout />}>
                        <Route path="/" element={<Site />} />
                        <Route path="/properties">
                          <Route index element={<Properties />} />
                          {/* Use PropertyWithTracking instead of the original Property */}
                          <Route path=":propertyId" element={<PropertyWithTracking />} />
                          <Route path=":propertyId/offers" element={<OfferTable />} />
                          {/* Protected route - only accessible to authenticated users */}
                          <Route
                            path=":propertyId/qualify"
                            element={
                              <ProtectedRoute>
                                <Qualify />
                              </ProtectedRoute>
                            }
                          />
                        </Route>
                        <Route path="/sell" element={<Sell />} />
                        <Route path="/financing" element={<Financing />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/subscription" element={<Subscription />} />
                        <Route path="/vip-signup" element={<VipSignupForm />} />
                        <Route path="/vip-signup-success" element={<VipSignupSuccess />} />
                        <Route path="/DFW" element={<DFW />} />
                        <Route path="/Austin" element={<Austin />} />
                        <Route path="/Houston" element={<Houston />} />
                        <Route path="/SanAntonio" element={<SanAntonio />} />
                        <Route path="/OtherLands" element={<OtherLands />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        {/* Protected route for profile */}
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/qualify"
                          element={
                            <ProtectedRoute>
                              <Qualify />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/CreateUservbtwP44jbX0FKKYUdHBGGCcYqenvNlYdH1Sj7K1dSD3kRo1Pib5VXQWb59a7CkQZ4DiQuu5r1t9I0uXVUbYjvvj4E1djRIkXRh40Uvbz2jSz6PZKguOjGhi7avF1b"
                          element={<CreateUser />}
                        />
                      </Route>

                      {/* Admin routes - using permissions instead of roles */}
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute
                            requiredPermissions={[PERMISSIONS.ACCESS_ADMIN]}
                            fallbackToRoles={true}
                            allowedRoles={['Admin']}
                          >
                            <AdminLayout />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<Admin />} />
                        {/* Testing Deals */}
                        <Route path="/admin/deals" element={<AdminDeals />} />
                        <Route path="/admin/deals/list" element={<DealsList />} />
                        <Route path="/admin/deals/create" element={<CreateDealForm />} />
                        <Route path="/admin/deals/:id" element={<DealDetail />} />
                        <Route path="/admin/deals/:id/payments" element={<PaymentList />} />
                        <Route path="/admin/deals/:id/summary" element={<DealFinancialSummary />} />
                        <Route
                          path="users"
                          element={
                            <ProtectedRoute
                              requiredPermissions={[PERMISSIONS.READ_USERS]}
                              fallbackToRoles={true}
                              allowedRoles={['Admin']}
                            >
                              <AdminUsers />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="users/:userId"
                          element={
                            <ProtectedRoute
                              requiredPermissions={[PERMISSIONS.READ_USERS]}
                              fallbackToRoles={true}
                              allowedRoles={['Admin']}
                            >
                              <UserDetail />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="buyers"
                          element={
                            <ProtectedRoute
                              requiredPermissions={[PERMISSIONS.READ_BUYERS]}
                              fallbackToRoles={true}
                              allowedRoles={['Admin']}
                            >
                              <AdminBuyers />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="buyers/create"
                          element={
                            <ProtectedRoute
                              requiredPermissions={[PERMISSIONS.WRITE_BUYERS]}
                              fallbackToRoles={true}
                              allowedRoles={['Admin']}
                            >
                              <CreateBuyer />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="buyers/:buyerId"
                          element={
                            <ProtectedRoute
                              requiredPermissions={[PERMISSIONS.READ_BUYERS]}
                              fallbackToRoles={true}
                              allowedRoles={['Admin']}
                            >
                              <BuyerDetail />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="buyers/:buyerId/edit"
                          element={
                            <ProtectedRoute
                              requiredPermissions={[PERMISSIONS.WRITE_BUYERS]}
                              fallbackToRoles={true}
                              allowedRoles={['Admin']}
                            >
                              <EditBuyer />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="buyers/:buyerId/offers"
                          element={
                            <ProtectedRoute
                              requiredPermissions={[PERMISSIONS.READ_OFFERS]}
                              fallbackToRoles={true}
                              allowedRoles={['Admin']}
                            >
                              <BuyerOffers />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="buyer-lists"
                          element={
                            <ProtectedRoute
                              requiredPermissions={[PERMISSIONS.READ_BUYERS]}
                              fallbackToRoles={true}
                              allowedRoles={['Admin']}
                            >
                              <BuyerLists />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="qualifications"
                          element={
                            <ProtectedRoute
                              requiredPermissions={[PERMISSIONS.READ_QUALIFICATIONS]}
                              fallbackToRoles={true}
                              allowedRoles={['Admin']}
                            >
                              <QualificationsDashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="financing/applications"
                          element={
                            <ProtectedRoute
                              requiredPermissions={[PERMISSIONS.READ_OFFERS]}
                              fallbackToRoles={true}
                              allowedRoles={['Admin']}
                            >
                              <OfferTable />
                            </ProtectedRoute>
                          }
                        />
                      </Route>

                      {/* Agent routes - using permissions instead of roles */}
                      <Route
                        path="/agent"
                        element={
                          <ProtectedRoute
                            requiredPermissions={[PERMISSIONS.WRITE_PROPERTIES]}
                            fallbackToRoles={true}
                            allowedRoles={['Admin', 'Agent']}
                          >
                            <AdminLayout />
                          </ProtectedRoute>
                        }
                      >
                        <Route path="add-property" element={<AddProperty />} />
                        <Route path="edit-property/:propertyId" element={<EditProperty />} />
                      </Route>
                    </Routes>
                  </ActivityTrackingProvider>
                </VipBuyerProvider>
              </PermissionsProvider>
            </Auth0ProviderWithNavigate>
          </BrowserRouter>
        </ThemeProvider>
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </UserProvider>
  );
}

export default App;
