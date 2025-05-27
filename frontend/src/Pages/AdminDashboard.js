import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../scss/pages/Dashboard.scss';
import { Loading } from './Product';

function AdminDashboard() {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    if (loading) {
        return <Loading />
    }

    if (!user) {
        return <div>Please log in to access the admin dashboard</div>;
    }

    const mockData = {
        totalUsers: 150,
        totalProducts: 42,
        totalCategories: 4,
        recentUsers: [
            { id: 1, username: 'user1', role: 'user', createdAt: '2024-03-15' },
            { id: 2, username: 'user2', role: 'user', createdAt: '2024-03-14' },
            { id: 3, username: 'user3', role: 'admin', createdAt: '2024-03-13' },
        ]
    };

    return (
        <div className="dashboard-container admin">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome, Admin {user.username}</p>
            </div>

            <div className="admin-nav">
                <button 
                    className={activeTab === 'overview' ? 'active' : ''} 
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={activeTab === 'users' ? 'active' : ''} 
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button 
                    className={activeTab === 'products' ? 'active' : ''} 
                    onClick={() => setActiveTab('products')}
                >
                    Products
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>Total Users</h3>
                        <span className="count">{mockData.totalUsers}</span>
                    </div>

                    <div className="dashboard-card">
                        <h3>Total Products</h3>
                        <span className="count">{mockData.totalProducts}</span>
                    </div>

                    <div className="dashboard-card">
                        <h3>Categories</h3>
                        <span className="count">{mockData.totalCategories}</span>
                    </div>

                    <div className="dashboard-card">
                        <h3>Quick Actions</h3>
                        <div className="button-group">
                            <button className="dashboard-button">Add Product</button>
                            <button className="dashboard-button">Add User</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="table-container">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockData.recentUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>{user.createdAt}</td>
                                    <td>
                                        <button className="table-button">Edit</button>
                                        <button className="table-button delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'products' && (
                <div className="coming-soon">
                    <h2>Products Management Coming Soon</h2>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
