import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AdminJobPosts = () => {

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [jobPostTitle, setJobPostTitle] = useState("");
    const [jobPostStatus, setJobPostStatus] = useState("");
    const [sortOrderBy, setSortOrderBy] = useState("");
    const [isDESC, setIsDESC] = useState(false);

    useEffect(() => {
        axios.get(`/api/admin/job-posts`, {
            params: {companyName, jobPostTitle, jobPostStatus, sortOrderBy, isDESC}
        })
            .then((res) => {
                setCompanies(res.data);
            })
    })

    return (
        <div className="container">
            {companies.map((item, index) => (
                <li key={index}>
                    <ul>{item.jobPostId}</ul>
                    <ul>{item.companyId}</ul>
                    <ul>{item.jobPostTitle}</ul>
                </li>
            ))}
        </div>
    )
}

export default AdminJobPosts;