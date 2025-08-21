import React, { useEffect, useState } from 'react';
import { enquiryService } from '../../services/enquiryService';
import '../../scss/components/admin/EnquiryManagement.scss';
import Loading from '../Loading';

const statusOptions = ['new', 'in-progress', 'completed', 'archived'];

function EnquiryManagement() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');
    const [wishlists, setWishlists] = useState({}); // { enquiryId: [wishlistItems] }
    const [responseMessages, setResponseMessages] = useState({}); // { enquiryId: message }
    const [savingResponse, setSavingResponse] = useState({}); // { enquiryId: bool }

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        setLoading(true);
        try {
            const response = await enquiryService.getAllEnquiries();
            if (response && response.success) {
                setEnquiries(response.data);
                // Fetch wishlists for all enquiries with userId
                response.data.forEach(async (enq) => {
                    if (enq.userId) {
                        const wlRes = await enquiryService.getWishlistEnquiries(enq.userId);
                        setWishlists(prev => ({ ...prev, [enq._id]: wlRes.data }));
                    }
                });
            } else {
                setEnquiries([]);
            }
        } catch (err) {
            setError('Failed to load enquiries');
            setEnquiries([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await enquiryService.updateEnquiryStatus(id, newStatus);
            setEnquiries(enquiries =>
                enquiries.map(enq =>
                    enq._id === id ? { ...enq, status: newStatus } : enq
                )
            );
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleResponseChange = (id, value) => {
        setResponseMessages(prev => ({ ...prev, [id]: value }));
    };

    const handleResponseSubmit = async (id) => {
        setSavingResponse(prev => ({ ...prev, [id]: true }));
        try {
            await enquiryService.respondToEnquiry(id, responseMessages[id] || '');
            setEnquiries(enquiries =>
                enquiries.map(enq =>
                    enq._id === id ? { ...enq, responseMessage: responseMessages[id] || '' } : enq
                )
            );
        } catch (err) {
            alert('Failed to save response message');
        } finally {
            setSavingResponse(prev => ({ ...prev, [id]: false }));
        }
    };

    const filteredEnquiries = filter
        ? enquiries.filter(enq => enq.status === filter)
        : enquiries;

    return (
        <div className="enquiry-management clean-admin">
            <h2>All Enquiries</h2>
            <div className="product-controls">
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="category-filter"
                >
                    <option value="">All Statuses</option>
                    {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
            {loading ? (
                <Loading text="Loading enquiries..." />
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : filteredEnquiries.length === 0 ? (
                <div className="empty-message">No enquiries found.</div>
            ) : (
                <div className="enquiry-cards">
                    {filteredEnquiries.map(enq => (
                        <div className="enquiry-card" key={enq._id}>
                            <div className="enquiry-header">
                                <div className="enquiry-title">
                                    <strong>{enq.firstName} {enq.lastName}</strong> &middot; <span>{enq.email}</span>
                                </div>
                                <div className={`enquiry-status status-${enq.status}`}>{enq.status}</div>
                            </div>
                            <div className="enquiry-details">
                                <div><strong>Product:</strong> {enq.productName}</div>
                                <div><strong>Type:</strong> {enq.enquiryType}</div>
                                <div><strong>Company:</strong> {enq.company || 'N/A'}</div>
                                <div><strong>Phone:</strong> {enq.phone || 'N/A'}</div>
                                <div><strong>Submitted:</strong> {new Date(enq.createdAt).toLocaleString()}</div>
                            </div>
                            {enq.userId && wishlists[enq._id] && (
                                <div className="enquiry-wishlist">
                                    <strong>User Wishlist:</strong>
                                    {wishlists[enq._id].length === 0 ? (
                                        <div>No wishlist items.</div>
                                    ) : (
                                        <ul>
                                            {wishlists[enq._id].map(item => (
                                                <li key={item.id}>
                                                    {item.title} ({item.modelNumber})
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                            <div className="enquiry-actions">
                                <label>Status: </label>
                                <select
                                    value={enq.status}
                                    onChange={e => handleStatusChange(enq._id, e.target.value)}
                                    className="category-filter"
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="enquiry-response">
                                <label>Admin Response:</label>
                                <textarea
                                    value={responseMessages[enq._id] !== undefined ? responseMessages[enq._id] : (enq.responseMessage || '')}
                                    onChange={e => handleResponseChange(enq._id, e.target.value)}
                                    rows={2}
                                    placeholder="Type your response to the user here..."
                                />
                                <button
                                    onClick={() => handleResponseSubmit(enq._id)}
                                    disabled={savingResponse[enq._id]}
                                >
                                    {savingResponse[enq._id] ? 'Saving...' : 'Save Response'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EnquiryManagement; 