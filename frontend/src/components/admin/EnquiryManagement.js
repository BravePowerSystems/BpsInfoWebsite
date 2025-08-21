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
            const response = await enquiryService.getEnquiries();
            console.log('Fetched enquiries response:', response);
            
            if (response.data && response.data.success) {
                const enquiriesData = response.data.data;
                console.log('Enquiries data:', enquiriesData);
                
                setEnquiries(enquiriesData);
                
                // Fetch wishlists for all enquiries with userId
                enquiriesData.forEach(async (enq) => {
                    if (enq.userId) {
                        try {
                            const wlRes = await enquiryService.getUserWishlist(enq.userId);
                            setWishlists(prev => ({ ...prev, [enq._id]: wlRes.data.data }));
                        } catch (wishlistErr) {
                            console.error('Error fetching wishlist for user:', enq.userId, wishlistErr);
                        }
                    }
                });
            } else {
                setEnquiries([]);
            }
        } catch (err) {
            console.error('Error fetching enquiries:', err);
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
        console.log('Response message changed for enquiry:', id, 'Value:', value);
        setResponseMessages(prev => {
            const newState = { ...prev, [id]: value };
            console.log('New response messages state:', newState);
            return newState;
        });
    };

    const handleResponseSubmit = async (id) => {
        setSavingResponse(prev => ({ ...prev, [id]: true }));
        try {
            const responseMessage = responseMessages[id] || '';
            console.log('Saving response for enquiry:', id, 'Message:', responseMessage);
            
            const response = await enquiryService.updateEnquiryResponseMessage(id, responseMessage);
            console.log('Response from server:', response);
            
            if (response.data && response.data.success) {
                // Update local state with the new response message
                setEnquiries(enquiries =>
                    enquiries.map(enq =>
                        enq._id === id ? { ...enq, responseMessage: responseMessage } : enq
                    )
                );
                
                // Clear the response message from the local state since it's now saved
                setResponseMessages(prev => {
                    const newState = { ...prev };
                    delete newState[id];
                    return newState;
                });
                
                // Show success message
                alert('Response message saved successfully!');
                
                // Refresh the enquiries to ensure we have the latest data
                await fetchEnquiries();
            } else {
                throw new Error('Server response indicates failure');
            }
        } catch (err) {
            console.error('Error saving response message:', err);
            alert(`Failed to save response message: ${err.message || 'Unknown error'}`);
        } finally {
            setSavingResponse(prev => ({ ...prev, [id]: false }));
        }
    };

    const filteredEnquiries = filter
        ? enquiries.filter(enq => enq.status === filter)
        : enquiries;

    // Debug: Log current state
    console.log('Current enquiries:', enquiries);
    console.log('Current response messages:', responseMessages);
    console.log('Current saving response:', savingResponse);

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
                                
                                {/* Show existing response if any */}
                                {enq.responseMessage && (
                                    <div className="existing-response">
                                        <strong>Current Response:</strong>
                                        <p>{enq.responseMessage}</p>
                                    </div>
                                )}
                                
                                <textarea
                                    value={responseMessages[enq._id] !== undefined ? responseMessages[enq._id] : ''}
                                    onChange={e => handleResponseChange(enq._id, e.target.value)}
                                    rows={3}
                                    placeholder={enq.responseMessage ? "Update the response message..." : "Type your response to the user here..."}
                                    onFocus={() => {
                                        // Initialize the response message if it doesn't exist
                                        if (responseMessages[enq._id] === undefined && enq.responseMessage) {
                                            setResponseMessages(prev => ({ ...prev, [enq._id]: enq.responseMessage }));
                                        }
                                    }}
                                />
                                
                                <div className="response-actions">
                                    <button
                                        onClick={() => handleResponseSubmit(enq._id)}
                                        disabled={savingResponse[enq._id] || (responseMessages[enq._id] === undefined || responseMessages[enq._id] === '')}
                                        className="save-response-btn"
                                    >
                                        {savingResponse[enq._id] ? 'Saving...' : 'Save Response'}
                                    </button>
                                    
                                    {responseMessages[enq._id] && (
                                        <button
                                            onClick={() => setResponseMessages(prev => {
                                                const newState = { ...prev };
                                                delete newState[enq._id];
                                                return newState;
                                            })}
                                            className="clear-response-btn"
                                            disabled={savingResponse[enq._id]}
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EnquiryManagement; 