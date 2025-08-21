import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../scss/pages/Dashboard.scss';
import Loading from '../components/Loading';    
import { enquiryService } from '../services/enquiryService';

function UserDashboard() {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [enquiries, setEnquiries] = useState([]);
    const [enquiriesLoading, setEnquiriesLoading] = useState(true);

    useEffect(() => {
        const fetchEnquiries = async () => {
            if (!user) return;
            setEnquiriesLoading(true);
            try {
                const response = await enquiryService.getMyEnquiries();
                console.log(response);
                if (response && response.success) {
                    setEnquiries(response.data);
                } else {
                    setEnquiries([]);
                }
            } catch (err) {
                setEnquiries([]);
            } finally {
                setEnquiriesLoading(false);
            }
        };
        fetchEnquiries();
    }, [user]);

    // Show loading state while auth is being initialized
    if (loading) {
        return <Loading text="Loading dashboard..." />
    }

    // Redirect or show error if no user (though ProtectedRoute should prevent this)
    if (!user) {
        return <div>Please log in to access your dashboard</div>;
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    if (enquiriesLoading) return <Loading text="Loading enquiries..." />;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <div className="greeting">
                    <h2>{getGreeting()}, {user.username}!</h2>
                    <p>Welcome to your personal dashboard</p>
                </div>
            </div>

            <div className="admin-tabs">
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
            </div>
            
            {activeTab === 'overview' && (
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>All Enquiries</h3>
                        <span className="count">{enquiries.length} enquiries</span>
                        <div className="card-content">
                            {enquiries.length === 0 ? (
                                <div>No enquiries.</div>
                            ) : (
                                enquiries.map((item, index) => (
                                    <div key={index} className="list-item">
                                        <span>{item.productName}</span>
                                        <small className={`status ${item.status.toLowerCase()}`}>{item.status}</small>
                                        {item.responseMessage && (
                                            <div className="admin-response">
                                                <strong>Admin Response:</strong> {item.responseMessage}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'enquiries' && (
                <div className="tab-content">
                    <h2>All My Enquiries</h2>
                    {enquiries.length === 0 ? (
                        <p>No enquiries.</p>
                    ) : (
                        <ul>
                            {enquiries.map((item, index) => (
                                <li key={index}>
                                    <div>
                                        <strong>{item.productName}</strong> - <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span> {item.date && `(${item.date})`}
                                    </div>
                                    {item.responseMessage && (
                                        <div className="admin-response">
                                            <strong>Admin Response:</strong> {item.responseMessage}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserDashboard;

