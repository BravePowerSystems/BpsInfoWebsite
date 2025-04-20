import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

function Register() {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/', { replace: true });
    };

    return (
        <AuthModal 
            onClose={handleClose}
            initialMode="register"
        />
    );
}

export default Register;


