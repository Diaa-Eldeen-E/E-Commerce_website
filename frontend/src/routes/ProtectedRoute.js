
import { Navigate, Outlet, useLocation } from "react-router-dom";


const ProtectedRoute = function ({ isAllowed, redirectPath = '/', children })
{
    const location = useLocation();

    if (!isAllowed)
    {
        console.log("Redirected (Protected route)");
        return (<Navigate to={redirectPath} replace state={{ path: location.pathname }} />)
    }

    //TODO: Admin authorization (Role attribute in users table, abilities attribute in tokens table)

    return (
        children ? children : <Outlet />
    );
}


export default ProtectedRoute;