import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AdminResumes = () => {

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [resumeTitle, setResumeTitle] = useState("");
    const [resumeCategory, setResumeCategory] = useState("");
    const [sortOrderBy, setSortOrderBy] = useState("");
    const [isDESC, setIsDESC] = useState(false);

    useEffect(() => {
        axios.get(`/api/admin/resumes`, {
            params: {userName, resumeTitle, resumeCategory, sortOrderBy, isDESC}
        })
            .then((res) => {
                setResumes(res.data);
            })
    })

    return (
        <div className="container">
            {resumes.map((item, index) => (
            <li key={index}>
                <ul>{item.resumeId}</ul>
                <ul>{item.userId}</ul>
                <ul>{item.resumeTitle}</ul>
            </li>
            ))}
        </div>
    )
}

export default AdminResumes;