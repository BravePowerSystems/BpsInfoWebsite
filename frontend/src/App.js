import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./Layout/Layout";
import Products from "./Pages/Products";
import Home from "./Pages/Home";
import Blog from "./Pages/Blog";
import CaseStudy from "./Pages/CaseStudy";
import Product from "./Pages/Product";
import Wishlist from "./Pages/Wishlist";
import CategoryPage from "./Pages/CategoryPage";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import UserDashboard from "./Pages/UserDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import "./scss/main.scss";

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <Layout>
                    <div className="App">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/Products" element={<Products />} />
                            <Route
                                path="/Products/:categoryName"
                                element={<CategoryPage />}
                            />
                            <Route
                                path="/Products/:categoryName/:productName"
                                element={<Product />}
                            />
                            <Route path="/Blog" element={<Blog />} />
                            <Route
                                path="/case-studies"
                                element={<CaseStudy />}
                            />

                            {/* Protected Routes (Requires Authentication) */}
                            <Route
                                path="/wishlist"
                                element={
                                    <ProtectedRoute>
                                        <Wishlist />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <UserDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="/admin/*"
                                element={
                                    <ProtectedRoute requireAdmin>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* 404 Route */}
                            <Route
                                path="*"
                                element={<div>Page not found</div>}
                            />
                        </Routes>
                    </div>
                </Layout>
            </Router>
        </AuthProvider>
    );
}

export default App;
