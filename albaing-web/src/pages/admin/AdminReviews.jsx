import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AdminReviews = () => {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [reviewTitle, setReviewTitle] = useState("");
    const [userName, setUserName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [sortOrderBy, setSortOrderBy] = useState("");
    const [isDESC, setIsDESC] = useState(false);

    useEffect(() => {
        axios.get(`/api/admin/review`, {
                params: {reviewTitle, userName, companyName, sortOrderBy, isDESC}
            })
            .then((res) => {
                setReviews(res.data);
            })
    })

    return (
        <div className="container">
            {reviews.map((item, index) => (
            <li key={index}>
                <ul>{item.reviewId}</ul>
                <ul>{item.reviewTitle}</ul>
                <ul>{item.userName}</ul>
            </li>
            ))}
        </div>
    )
}

export default AdminReviews;