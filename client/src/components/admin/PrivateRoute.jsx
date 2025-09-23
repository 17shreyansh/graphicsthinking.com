import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const PrivateRoute = () => {
    const { isAuthenticated } = useContext(AppContext);
    return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
