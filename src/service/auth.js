import axios from 'axios';
import getAPIUrl from '../constants/apiUrl';

const url = getAPIUrl();

const handleEmployeeLogin = (values) => {
    const { phone, password } = values;
    console.log(password);
    return axios.post(`${url}/auth/employee/login`, {
        phone, password
    });
}

const AuthServices = {
    handleEmployeeLogin
};


export default AuthServices;

