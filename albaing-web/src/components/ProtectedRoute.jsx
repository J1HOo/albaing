import {Navigate} from "react-router-dom";


const ProtectedRoute = ({children}) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    // return 내에 코드가 하나이기때문에 ( <div> { }  </div> ) 모두 생략 가능
    return  user ? children : <Navigate to="/login"/>

}

const ProtectedRouteOne = ({children}) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    return (
        <>
            {
                user ? children : <Navigate to="/login"/>
            }
        </>
    )
}

export default ProtectedRoute;