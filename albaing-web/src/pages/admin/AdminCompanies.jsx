import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AdminCompanies = () => {

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [companyOwnerName, setCompanyOwnerName] = useState("");
    const [companyPhone, setCompanyPhone] = useState("");
    const [sortOrderBy, setSortOrderBy] = useState("");
    const [isDESC, setIsDESC] = useState(false);

    useEffect(() => {
        axios.get(`/api/admin/companies`, {
            params: {companyName, companyOwnerName, companyPhone, sortOrderBy, isDESC}
        })
            .then((res) => {
                setCompanies(res.data);
            })
    })

    return (
        <div className="container">
            {companies.map((item, index) => (
                <li key={index}>
                    <ul>{item.companyId}</ul>
                    <ul>{item.companyName}</ul>
                    <ul>{item.companyEmail}</ul>
                </li>
            ))}
        </div>
    )
}

export default AdminCompanies;