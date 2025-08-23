import React, { useState, useEffect, useRef } from 'react';
import '../scss/components/CustomDropdown.scss';

const CustomDropdown = ({ 
    options, 
    selectedValue, 
    onSelect, 
    placeholder = "Select option",
    className = "",
    disabled = false,
    width = "auto",
    allowCreate = false,
    onCreateNew = null,
    createPlaceholder = "Create new..."
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newItemText, setNewItemText] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef(null);

    // Update filtered options when options change
    useEffect(() => {
        if (searchTerm) {
            const filtered = options.filter(option => 
                option.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(options);
        }
    }, [options, searchTerm]);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
                setSearchTerm('');
                setFilteredOptions(options);
            }
        }
    };

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
        setSearchTerm('');
        setIsCreating(false);
        setNewItemText('');
    };

    const handleCreateNew = () => {
        if (newItemText.trim() && onCreateNew) {
            onCreateNew(newItemText.trim());
            setNewItemText('');
            setIsCreating(false);
            setIsOpen(false);
        }
    };

    const handleStartCreate = () => {
        setIsCreating(true);
        setNewItemText('');
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setNewItemText('');
        setSearchTerm('');
        setFilteredOptions(options);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value) {
            const filtered = options.filter(option => 
                option.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(options);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isCreating) {
                handleCreateNew();
            }
        } else if (e.key === 'Escape') {
            if (isCreating) {
                handleCancelCreate();
            } else {
                setIsOpen(false);
            }
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.custom-dropdown')) {
                setIsOpen(false);
                setIsCreating(false);
                setNewItemText('');
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close dropdown on escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                if (isCreating) {
                    handleCancelCreate();
                } else {
                    setIsOpen(false);
                }
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, isCreating]);

    return (
        <div className={`custom-dropdown ${className} ${disabled ? 'disabled' : ''}`} style={{ width }}>
            <button 
                className="custom-dropdown__trigger"
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                disabled={disabled}
                type="button"
            >
                <span className="custom-dropdown__selected">
                    {selectedValue || placeholder}
                </span>
                <span className={`custom-dropdown__arrow ${isOpen ? 'rotated' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
            </button>
            
            {isOpen && (
                <div className="custom-dropdown__dropdown">
                    {/* Search input */}
                    <div className="custom-dropdown__search">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            className="custom-dropdown__search-input"
                        />
                    </div>

                    {/* Create new option */}
                    {allowCreate && onCreateNew && (
                        <div className="custom-dropdown__create-section">
                            {isCreating ? (
                                <div className="custom-dropdown__create-form">
                                    <input
                                        type="text"
                                        placeholder={createPlaceholder}
                                        value={newItemText}
                                        onChange={(e) => setNewItemText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="custom-dropdown__create-input"
                                        autoFocus
                                    />
                                    <div className="custom-dropdown__create-actions">
                                        <button 
                                            onClick={handleCreateNew}
                                            disabled={!newItemText.trim()}
                                            className="custom-dropdown__create-btn"
                                        >
                                            Create
                                        </button>
                                        <button 
                                            onClick={handleCancelCreate}
                                            className="custom-dropdown__cancel-btn"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleStartCreate}
                                    className="custom-dropdown__create-trigger"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    {createPlaceholder}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Options list */}
                    <ul className="custom-dropdown__list" role="listbox">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li key={option} role="option">
                                    <button
                                        className={`custom-dropdown__option ${
                                            selectedValue === option ? 'selected' : ''
                                        }`}
                                        onClick={() => handleSelect(option)}
                                        role="option"
                                        aria-selected={selectedValue === option}
                                    >
                                        {option}
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="custom-dropdown__no-results">
                                <span>No options found</span>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
