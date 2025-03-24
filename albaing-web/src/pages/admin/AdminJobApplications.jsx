import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AdminJobApplications = () => {

    const [jobApplications, setJobApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const {userName, setUserName} = useState("");
    const {companyName, setCompanyName} = useState("");
    const {jobPostTitle, setJobPostTitle} = useState("");
    const [sortOrderBy, setSortOrderBy] = useState("");
    const [isDESC, setIsDESC] = useState(false);

    useEffect(() => {
        axios.get(`/api/admin/job-applications`, {
            params: {userName, companyName, jobPostTitle, sortOrderBy, isDESC}
        })
            .then((res) => {
                setJobApplications(res.data);
            })
    })

    return (
        <div className="container">
            {jobApplications.map((item, index) => (
                <li key={index}>
                    <ul>{item.jobApplicationId}</ul>
                    <ul>{item.jobPostId}</ul>
                    <ul>{item.resumeId}</ul>
                </li>
            ))}
        </div>
    )
}

export default AdminJobApplications;