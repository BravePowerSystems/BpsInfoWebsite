import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../scss/components/CustomDropdown.scss';

const CustomDropdown = ({
    options = [],
    value = '',
    onChange = () => {},
    placeholder = 'Categories',
    disabled = false,
    multiSelect = false,
    className = '',
    triggerClassName = '',
    dropdownClassName = '',
    optionClassName = '',
    ...props
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState(
        multiSelect ? (Array.isArray(value) ? value : []) : value
    );
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (event) => {
        if (disabled) return;

        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                setIsOpen(!isOpen);
                break;
            case 'Escape':
                setIsOpen(false);
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                }
                break;
            default:
                break;
        }
    };

    const handleOptionClick = (option) => {
        if (multiSelect) {
            const newValues = selectedValues.includes(option.value)
                ? selectedValues.filter(v => v !== option.value)
                : [...selectedValues, option.value];
            
            setSelectedValues(newValues);
            onChange(newValues);
        } else {
            setSelectedValues(option.value);
            onChange(option.value);
            setIsOpen(false);
        }
    };

    const getDisplayText = () => {
        if (multiSelect) {
            if (selectedValues.length === 0) return placeholder;
            if (selectedValues.length === 1) {
                const option = options.find(opt => opt.value === selectedValues[0]);
                return option ? option.label : placeholder;
            }
            return `${selectedValues.length} selected`;
        } else {
            const option = options.find(opt => opt.value === selectedValues);
            return option ? option.label : placeholder;
        }
    };

    const isSelected = (optionValue) => {
        if (multiSelect) {
            return selectedValues.includes(optionValue);
        }
        return selectedValues === optionValue;
    };

    const dropdownVariants = {
        hidden: {
            opacity: 0,
            y: -10,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.2,
                ease: 'easeOut',
            },
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.15,
                ease: 'easeIn',
            },
        },
    };

    return (
        <div 
            className={`custom-dropdown ${className}`}
            ref={dropdownRef}
            {...props}
        >
            {/* Trigger Button */}
            <button
                ref={triggerRef}
                type="button"
                className={`custom-dropdown__trigger ${triggerClassName} ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={placeholder}
            >
                <span className="custom-dropdown__trigger-text">
                    {getDisplayText()}
                </span>
                <span className={`custom-dropdown__arrow ${isOpen ? 'is-open' : ''}`}>
                    ▼
                </span>
            </button>

            {/* Dropdown Options */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={`custom-dropdown__options ${dropdownClassName}`}
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        role="listbox"
                        aria-label="Dropdown options"
                    >
                        {options.length === 0 ? (
                            <div className="custom-dropdown__no-options">
                                No options available
                            </div>
                        ) : (
                            options.map((option, index) => (
                                <div
                                    key={option.value}
                                    className={`custom-dropdown__option ${optionClassName} ${isSelected(option.value) ? 'is-selected' : ''}`}
                                    onClick={() => handleOptionClick(option)}
                                    role="option"
                                    aria-selected={isSelected(option.value)}
                                    tabIndex={-1}
                                >
                                    {multiSelect && (
                                        <span className="custom-dropdown__checkbox">
                                            {isSelected(option.value) ? '✓' : ''}
                                        </span>
                                    )}
                                    <span className="custom-dropdown__option-text">
                                        {option.label}
                                    </span>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomDropdown;
