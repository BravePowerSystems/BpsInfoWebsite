import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../scss/pages/Dashboard.scss';
import ProductManagement from '../components/admin/ProductManagement';
import ProductForm from '../components/admin/ProductForm';
import { AnimatePresence } from 'framer-motion';
import EnquiryManagement from '../components/admin/EnquiryManagement';
import Loading from '../components/Loading';

function AdminDashboard() {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('products');
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productCategories, setProductCategories] = useState([]);
    
    // Redirect if not admin
    if (!loading && (!user || user.role !== 'admin')) {
        return <Navigate to="/login" />;
    }
    
    if (loading) {
        return <Loading text="Loading..." />;
    }

    const handleShowProductForm = (product, categories) => {
        setEditingProduct(product);
        setProductCategories(categories);
        setShowProductForm(true);
    };

    const handleHideProductForm = () => {
        setShowProductForm(false);
        setEditingProduct(null);
    };
    
    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p className="welcome-message">Welcome back, {user.firstName}!</p>
            </div>
            
            <div className="admin-tabs">
                <button 
                    className={activeTab === 'products' ? 'active' : ''}
                    onClick={() => setActiveTab('products')}
                >
                    Products
                </button>
                <button 
                    className={activeTab === 'enquiries' ? 'active' : ''}
                    onClick={() => setActiveTab('enquiries')}
                >
                    Enquiries
                </button>
               
            </div>
            
            <div className="admin-content">
                {activeTab === 'products' && 
                    <ProductManagement 
                        onShowProductForm={handleShowProductForm}
                    />
                }
                {activeTab === 'enquiries' && <EnquiryManagement />}
                {/* {activeTab === 'users' && <UserManagement />} */}
            </div>

            <AnimatePresence>
                {showProductForm && (
                    <ProductForm
                        product={editingProduct}
                        categories={productCategories}
                        onSave={(productData) => {
                            // Pass the save event back to ProductManagement
                            if (activeTab === 'products') {
                                const productManagementElement = document.querySelector('.product-management');
                                if (productManagementElement) {
                                    const event = new CustomEvent('product-save', { 
                                        detail: { product: editingProduct, productData } 
                                    });
                                    productManagementElement.dispatchEvent(event);
                                }
                            }
                            handleHideProductForm();
                        }}
                        onCancel={handleHideProductForm}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default AdminDashboard;
