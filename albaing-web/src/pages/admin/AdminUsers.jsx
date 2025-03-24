import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AdminUsers = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [sortOrderBy, setSortOrderBy] = useState("");
    const [isDESC, setIsDESC] = useState(false);

    useEffect(() => {
        axios.get(`/api/admin/users`, {
            params: {userName, userEmail, userPhone, sortOrderBy, isDESC}
        })
            .then((res) => {
                setUsers(res.data);
            })
    })

    return (
        <div className="container">
            {users.map((item, index) => (
            <li key={index}>
                <ul>{item.userId}</ul>
                <ul>{item.userName}</ul>
                <ul>{item.userEmail}</ul>
            </li>
            ))}
        </div>
    )
}

export default AdminUsers;