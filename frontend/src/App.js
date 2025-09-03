import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./Layout/Layout";
import Products from "./Pages/Products";
import Home from "./Pages/Home";
import Blog from "./Pages/Blog";
import BlogPost from "./Pages/BlogPost";
import CaseStudy from "./Pages/CaseStudy";
import CaseStudiesPreview from "./Pages/CaseStudiesPreview";
import Product from "./Pages/Product";
import Wishlist from "./Pages/Wishlist";
import CategoryPage from "./Pages/CategoryPage";

import About from "./Pages/About";
import FAQ from "./Pages/FAQ";
import UserProfile from "./Pages/UserProfile";
import NotFound from "./Pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import UserDashboard from "./Pages/UserDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import "./scss/main.scss";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <ErrorBoundary>
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
                                <Route path="/blog/:slug" element={<BlogPost />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/faqs" element={<FAQ />} />
                                <Route
                                    path="/case-studies"
                                    element={<CaseStudiesPreview />}
                                />
                                <Route
                                    path="/case-studies/:caseStudySlug"
                                    element={<CaseStudy />}
                                />


                                {/* Protected Routes (Requires Authentication) */}
                                <Route
                                    path="/wishlist"
                                    element={
                                        <ProtectedRoute requireUser>
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
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <UserProfile />
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
                                    element={<NotFound />}
                                />
                            </Routes>
                        </div>
                    </Layout>
                </ErrorBoundary>
            </Router>
        </AuthProvider>
    );
}

export default App;
