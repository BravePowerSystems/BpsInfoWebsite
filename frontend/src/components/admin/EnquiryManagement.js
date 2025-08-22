import React, { useEffect, useState } from 'react';
import { enquiryService } from '../../services/enquiryService';
import '../../scss/components/admin/EnquiryManagement.scss';
import Loading from '../Loading';

const statusOptions = ['new', 'in-progress', 'completed', 'archived'];

// Custom Status Selector Component
const StatusSelector = ({ options, selectedValue, onValueChange, placeholder, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(!isOpen);
    const handleSelect = (value) => {
        onValueChange(value);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.status-selector')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`status-selector ${className}`}>
            <button 
                className="status-selector__trigger"
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span className="status-selector__selected">
                    {selectedValue || placeholder}
                </span>
                <span className={`status-selector__arrow ${isOpen ? 'rotated' : ''}`}>
                    <img src="/arrow_down.svg" alt="" />
                </span>
            </button>
            
            {isOpen && (
                <div className="status-selector__dropdown">
                    <ul className="status-selector__list" role="listbox">
                        {options.map((option) => (
                            <li key={option} role="option">
                                <button
                                    className={`status-selector__option ${
                                        selectedValue === option ? 'selected' : ''
                                    }`}
                                    onClick={() => handleSelect(option)}
                                    role="option"
                                    aria-selected={selectedValue === option}
                                >
                                    {option}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

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
            console.log('Raw API response:', response); // Debug log
            
            // The API client wraps the response in a 'data' property
            const responseData = response.data;
            console.log('Response data:', responseData); // Debug log
            
            if (responseData && responseData.success) {
                setEnquiries(responseData.data);
                // Fetch wishlists for all enquiries with userId
                responseData.data.forEach(async (enq) => {
                    if (enq.userId) {
                        const wlRes = await enquiryService.getWishlistEnquiries(enq.userId);
                        if (wlRes && wlRes.data && wlRes.data.success) {
                            setWishlists(prev => ({ ...prev, [enq._id]: wlRes.data.data }));
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
            console.log('Updating status for enquiry:', id, 'to:', newStatus);
            const response = await enquiryService.updateEnquiryStatus(id, newStatus);
            console.log('Status update response:', response);
            
            setEnquiries(enquiries =>
                enquiries.map(enq =>
                    enq._id === id ? { ...enq, status: newStatus } : enq
                )
            );
        } catch (err) {
            console.error('Status update error:', err);
            alert('Failed to update status: ' + (err.message || 'Unknown error'));
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
                <StatusSelector
                    options={statusOptions}
                    selectedValue={filter}
                    onValueChange={setFilter}
                    placeholder="All Statuses"
                />
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
                                <StatusSelector
                                    options={statusOptions}
                                    selectedValue={enq.status}
                                    onValueChange={(newStatus) => handleStatusChange(enq._id, newStatus)}
                                    className="status-change-selector"
                                />
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