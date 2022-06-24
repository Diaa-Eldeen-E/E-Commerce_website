import {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router";
import {Outlet} from "react-router-dom";
import Register from "./Register";
import Page404 from "../Page404";
import axios from "axios";
import {useAuth} from "./AuthProvider";
import Loading from "../Loading";

const RequireAuth = function ({allowedRole}) {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {

        //    Backend authorization

        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/checkAuth').then((res) => {
                // Status OK The user is allowed
                if (res.data.user_role == allowedRole) {
                    setIsAllowed(() => {
                        setIsLoading(false);
                        return true;
                    })
                }
                // Not allowed (Forbidden)
                else {
                    setIsLoading(false);
                }


            }).catch((reason) => {
                console.log("Not authorized, " + reason);
                setIsLoading(false);
            })
        })

    }, []);


    return (
        isLoading ? <Loading/> :
            isAllowed ? <Outlet/> : <Navigate to='/notfound' replace/>

        //    You can further check user login and implement specific reaction on being logged in but not authorized
    )

}


export default RequireAuth;