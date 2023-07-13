import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

import AppRouter from './routes/AppRouter';
import { baseURL } from './constants';

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { authCheck } from './redux/actions/authActions';
import Loading from './components/Loading';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = baseURL;



// Handle axios error responses
// https://stackoverflow.com/questions/48990632/how-to-manage-axios-errors-globally-or-from-one-point
// https://medium.com/@ejjay/a-short-ajax-story-on-error-handlers-8baeeccbc062

// errorComposer will compose a handleGlobally function
const errorComposer = (error) =>
{
    return () =>
    {
        const statusCode = error.response ? error.response.status : null;

        if (statusCode === 404)
            window.location.href = '/notfound';

        // Not authenticated, login to access this resource
        if (statusCode === 401)
            console.log('401');
        // window.location.href = '/login';

        // Forbidden
        if (statusCode === 403)
            window.location.href = '/forbidden';
    }
}

axios.interceptors.response.use(undefined, function (error)
{

    const statusCode = error.response ? error.response.status : null;

    if (statusCode === 404)
        window.location.href = '/notfound';

    // Bad practice (It makes the page reloads and we lose the app state)
    if (statusCode === 401)
        // window.location.href = '/login';

        if (statusCode === 403)
            window.location.href = '/forbidden';

    throw error;

    // error.handleGlobally = errorComposer(error);
    // return Promise.reject(error);
})

// For ensuring running app initialization once
let didInit = false;

function App()
{
    const dispatch = useDispatch()
    const { initLoading } = useSelector((state) => state.auth)


    // Application initializtion
    useEffect(() =>
    {
        if (!didInit)
        {
            // Check user authorization
            dispatch(authCheck())
            didInit = true
        }

    }, [])
    // Empty array -> Run the effect at the initial render only

    return (

        initLoading ? <Loading /> :

            <div className="App">
                {/* <AuthProvider> */}
                <AppRouter />
                {/* </AuthProvider> */}
            </div>

    );
}

export default App;
