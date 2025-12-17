
import UseAuth from '../hooks/UseAuth';
import { Navigate, useNavigate } from 'react-router';

const UserChecking = ({children}) => {

    const Navigate = useNavigate()

    const {user} = UseAuth();

    if(user){
        return Navigate("/")
    }

    return children

};

export default UserChecking;