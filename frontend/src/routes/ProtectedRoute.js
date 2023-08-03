
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = function ({ isAllowed, redirectPath = '/', children })
{
    if (!isAllowed)
        return (<Navigate to={redirectPath} replace />)

    //TODO: Admin authorization (Role attribute in users table, abilities attribute in tokens table)

    return (
        children ? children : <Outlet />
    );
}


export default ProtectedRoute;