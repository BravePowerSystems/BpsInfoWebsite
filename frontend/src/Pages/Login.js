import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleClose = () => {
        navigate(from, { replace: true });
    };

    return (
        <AuthModal 
            onClose={handleClose}
            initialMode="login"
        />
    );
}


export default Login;