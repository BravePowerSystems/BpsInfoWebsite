import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { Navigate } from 'react-router-dom';
import '../scss/pages/Dashboard.scss';
import ProductManagement from '../components/admin/ProductManagement';
import ProductForm from '../components/admin/ProductForm';
import { AnimatePresence } from 'framer-motion';
import EnquiryManagement from '../components/admin/EnquiryManagement';
import ContentManagement from '../components/admin/ContentManagement';
import ContentForm from '../components/admin/ContentForm';
import Loading from '../components/Loading';
import Notify from 'simple-notify';
import { ContentService } from '../services/contentService';

function AdminDashboard() {
    const { user, loading } = useAuth();
    const { addProduct, updateProduct, addCategory, categories } = useProducts();
    const [activeTab, setActiveTab] = useState('products');
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showContentForm, setShowContentForm] = useState(false);
    const [editingContent, setEditingContent] = useState(null);
    const [contentOptions, setContentOptions] = useState({});
    const [contentRefreshTrigger, setContentRefreshTrigger] = useState(0);
    
    // Redirect if not admin
    if (!loading && (!user || user.role !== 'admin')) {
        return <Navigate to="/login" />;
    }
    
    if (loading) {
        return <Loading text="Loading..." />;
    }

    const handleShowProductForm = (product) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };

    const handleHideProductForm = () => {
        setShowProductForm(false);
        setEditingProduct(null);
    };

    const handleShowContentForm = (content, options) => {
        setEditingContent(content);
        setContentOptions(options);
        setShowContentForm(true);
    };

    const handleHideContentForm = () => {
        setShowContentForm(false);
        setEditingContent(null);
    };

    const handleSaveProduct = async (productData) => {
        try {
            if (editingProduct) {
                // Update existing product
                await updateProduct(editingProduct._id, productData);
                new Notify({
                    status: "success",
                    title: "Success",
                    text: "Product updated successfully",
                    effect: "fade",
                    speed: 300,
                    autoclose: true,
                    autotimeout: 3000,
                    position: "right top",
                });
            } else {
                // Create new product
                await addProduct(productData);
                new Notify({
                    status: "success",
                    title: "Success",
                    text: "Product created successfully",
                    effect: "fade",
                    speed: 300,
                    autoclose: true,
                    autotimeout: 3000,
                    position: "right top",
                });
            }
            handleHideProductForm();
        } catch (error) {
            console.error('Error saving product:', error);
            new Notify({
                status: "error",
                title: "Error",
                text: "Failed to save product",
                effect: "fade",
                speed: 300,
                autoclose: true,
                autotimeout: 3000,
                position: "right top",
            });
        }
    };

    const handleSaveContent = async (contentData) => {
        try {
            if (editingContent) {
                // Update existing content
                await ContentService.updateContent(editingContent._id, contentData);
                new Notify({
                    status: "success",
                    title: "Success",
                    text: "Content updated successfully",
                    effect: "fade",
                    speed: 300,
                    autoclose: true,
                    autotimeout: 3000,
                    position: "right top",
                });
            } else {
                // Create new content
                await ContentService.createContent(contentData);
                new Notify({
                    status: "success",
                    title: "Success",
                    text: "Content created successfully",
                    effect: "fade",
                    speed: 300,
                    autoclose: true,
                    autotimeout: 3000,
                    position: "right top",
                });
            }
            handleHideContentForm();
            // Trigger content refresh
            setContentRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Error saving content:', error);
            new Notify({
                status: "error",
                title: "Error",
                text: "Failed to save content",
                effect: "fade",
                speed: 300,
                autoclose: true,
                autotimeout: 3000,
                position: "right top",
            });
        }
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
                <button 
                    className={activeTab === 'content' ? 'active' : ''}
                    onClick={() => setActiveTab('content')}
                >
                    Content
                </button>
               
            </div>
            
            <div className="admin-content">
                {activeTab === 'products' && 
                    <ProductManagement 
                        onShowProductForm={handleShowProductForm}
                    />
                }
                {activeTab === 'enquiries' && <EnquiryManagement />}
                {activeTab === 'content' && 
                    <ContentManagement 
                        onShowContentForm={handleShowContentForm}
                        refreshTrigger={contentRefreshTrigger}
                    />
                }
                {/* {activeTab === 'users' && <UserManagement />} */}
            </div>

            <AnimatePresence>
                {showProductForm && (
                    <ProductForm
                        product={editingProduct}
                        categories={categories ? categories.map(cat => {
                            const [catName] = Object.entries(cat)[0];
                            return catName;
                        }) : []}
                        onSave={handleSaveProduct}
                        onCancel={handleHideProductForm}
                        onAddCategory={addCategory}
                    />
                )}
                {showContentForm && (
                    <ContentForm
                        content={editingContent}
                        options={contentOptions}
                        onSave={handleSaveContent}
                        onCancel={handleHideContentForm}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default AdminDashboard;
