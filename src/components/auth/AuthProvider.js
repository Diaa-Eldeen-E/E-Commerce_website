import {useNavigate} from 'react-router';
import {useState, useContext, createContext, useEffect} from "react";
import axios from "axios";

import SweetAlert from 'react-bootstrap-sweetalert';


const AuthContext = createContext(null);

// Create custom Hook (consists of built-in React Hooks)
export const useAuth = () => {
    return useContext(AuthContext);
};


// Set the authorization header with the token value for all axios requests
axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('auth_token');
    config.headers.Authorization = 'Bearer ' + token;
    return config;
})

// Another way
// export const authAxios = axios.create({
//     baseURL: 'http://localhost:8000',
//     headers: {
//         Authorization: 'Bearer ' + getToken()
//     }
// });

const AlertTimeout = 100;

const AuthProvider = function ({children}) {

    // In react-router-dom v6 useHistory() is replaced by useNavigate().
    const navigate = useNavigate();

    // TODO: Change to store token, store both auth_token and auth_name in single function
    const getToken = () => localStorage.getItem('auth_token');
    const setToken = (token) => localStorage.setItem('auth_token', token);
    const clearToken = () => localStorage.removeItem('auth_token');

    // const [isAdmin, setIsAdmin] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState('');
    const [alert, setAlert] = useState({'show': false, 'message': ''});


    const handleLogin = async (formData) => {

        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.post('/api/login', formData).then((res) => {
                if (res.data.status === 200) {
                    localStorage.setItem('auth_name', res.data.username);
                    setToken(res.data.token);
                    // if (res.data.isAdmin == 1)
                    //     setIsAdmin(true);

                    setAlert({'show': true, 'message': res.data.message});
                    navigate('/')

                } else if (res.data.status === 401) {
                    setErrorMessage(res.data.message);
                } else {
                    console.log('Login error');
                    setErrorMessage(res.data.message);
                    navigate('/login');
                }
            })
        })

    };


    const handleLogout = (e) => {

        e.preventDefault();

        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.post('/api/logout').then((res) => {
                if (res.data.status === 200) {
                    localStorage.removeItem('auth_name');
                    clearToken();
                    // setIsAdmin(false);

                    // setAlert({'show': true, 'message': res.data.message});
                    navigate('/');
                } else {
                    console.log('Logout error, ' + res.data.message);
                    navigate('/');
                }
            })
        })

    };


    const handleRegister = async (formData) => {

        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.post('/api/register', formData).then((res) => {
                if (res.data.status === 200) {
                    localStorage.setItem('auth_name', res.data.username);
                    setToken(res.data.token);

                    setAlert({'show': true, 'message': res.data.message});
                    navigate('/');
                } else if (res.data.status === 401) {
                    setErrorMessage(res.data.message);

                } else {
                    console.log('Register error, ' + res.data.message);
                    setErrorMessage(res.data.message);
                    setValidationErrors(res.data.validation_errors);
                    navigate('/register');
                }
            })
        })

    };

    const value = {
        setToken,
        getToken,
        // isAdmin,
        // username,
        // errorMessage,
        // validationErrors,
        onLogin: handleLogin,
        onLogout: handleLogout,
        onRegister: handleRegister
    };

    return (
        <AuthContext.Provider value={value}>
            <SweetAlert show={alert.show} title='Success' success
                        onConfirm={() => setAlert({...alert, 'show': false})}>{alert.message}</SweetAlert>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;