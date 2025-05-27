import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../scss/pages/Dashboard.scss';
import { Loading } from './Product';

function UserDashboard() {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    // Show loading state while auth is being initialized
    if (loading) {
        return <Loading />
    }

    // Redirect or show error if no user (though ProtectedRoute should prevent this)
    if (!user) {
        return <div>Please log in to access your dashboard</div>;
    }

    // Mock data - In real app, this would come from API
    const mockData = {
        wishlist: {
            total: 3,
            recent: [
                { name: 'Gas Flow Pulse Transmitter', category: 'Transmitters' },
                { name: 'IOT Energy Meter', category: 'Power-Monitors' },
                { name: 'AC Dimmer', category: 'IOT-and-PLC-Modules' }
            ]
        },
        recentViews: {
            total: 5,
            items: [
                { name: 'Gas Leak Transmitter', timestamp: '2024-03-20 14:30' },
                { name: 'Battery Monitor', timestamp: '2024-03-19 16:45' },
                { name: 'Pump Controller', timestamp: '2024-03-18 09:15' }
            ]
        },
        enquiries: {
            total: 2,
            items: [
                { 
                    productName: 'Water Flow Transmitter',
                    status: 'Pending',
                    date: '2024-03-17'
                },
                {
                    productName: 'UPS Monitor',
                    status: 'Responded',
                    date: '2024-03-15'
                }
            ]
        },
        downloads: {
            total: 4,
            recent: [
                { name: 'Gas Flow Transmitter Datasheet.pdf', date: '2024-03-16' },
                { name: 'IOT Energy Meter Manual.pdf', date: '2024-03-14' }
            ]
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <div className="greeting">
                    <h2>{getGreeting()}, {user.username}!</h2>
                    <p>Welcome to your personal dashboard</p>
                </div>
            </div>

            <div className="dashboard-nav">
                <button 
                    className={activeTab === 'overview' ? 'active' : ''} 
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={activeTab === 'enquiries' ? 'active' : ''} 
                    onClick={() => setActiveTab('enquiries')}
                >
                    My Enquiries
                </button>
                <button 
                    className={activeTab === 'downloads' ? 'active' : ''} 
                    onClick={() => setActiveTab('downloads')}
                >
                    Downloads
                </button>
            </div>
            
            {activeTab === 'overview' && (
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>My Wishlist</h3>
                        <span className="count">{mockData.wishlist.total} items</span>
                        <div className="card-content">
                            {mockData.wishlist.recent.map((item, index) => (
                                <div key={index} className="list-item">
                                    <span>{item.name}</span>
                                    <small>{item.category}</small>
                                </div>
                            ))}
                            <Link to="/wishlist" className="view-all">View Wishlist →</Link>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <h3>Recent Views</h3>
                        <span className="count">{mockData.recentViews.total} products</span>
                        <div className="card-content">
                            {mockData.recentViews.items.map((item, index) => (
                                <div key={index} className="list-item">
                                    <span>{item.name}</span>
                                    <small>{item.timestamp}</small>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <h3>Active Enquiries</h3>
                        <span className="count">{mockData.enquiries.total} enquiries</span>
                        <div className="card-content">
                            {mockData.enquiries.items.map((item, index) => (
                                <div key={index} className="list-item">
                                    <span>{item.productName}</span>
                                    <small className={`status ${item.status.toLowerCase()}`}>
                                        {item.status}
                                    </small>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <h3>Downloads</h3>
                        <span className="count">{mockData.downloads.total} files</span>
                        <div className="card-content">
                            {mockData.downloads.recent.map((item, index) => (
                                <div key={index} className="list-item">
                                    <span>{item.name}</span>
                                    <small>{item.date}</small>
                                </div>
                            ))}
                            <button className="download-all">Download All</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'enquiries' && (
                <div className="detailed-view">
                    <h3>Enquiry History</h3>
                    <div className="table-container">
                        {/* Detailed enquiries table */}
                    </div>
                </div>
            )}

            {activeTab === 'downloads' && (
                <div className="detailed-view">
                    <h3>Available Downloads</h3>
                    <div className="downloads-grid">
                        {/* Detailed downloads grid */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserDashboard;

