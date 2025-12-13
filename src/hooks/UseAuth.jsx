import React, { useContext } from 'react';
import { AuthContext } from '../authentication/AuthContext';

const UseAuth = () => {

    const AuthInfo = useContext(AuthContext)
    return AuthInfo;
};

export default UseAuth;