import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AdminNotices = () => {

    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/admin/notices`)
            .then((res) => {
                setNotices(res.data);
            })
    })

    return (
        <div className="container">
            {notices.map((item, index) => (
            <li key={index}>
                <ul>{item.noticeId}</ul>
                <ul>{item.noticeTitle}</ul>
                <ul>{item.noticeCreatedAt}</ul>
            </li>
            ))}
        </div>
    )
}

export default AdminNotices;