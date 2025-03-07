import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

export default function JobApplicationManager() {
    const { id: jobPostId } = useParams();
    const [jobPost, setJobPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!jobPostId) {
            console.error("jobPostId가 존재하지 않습니다.");
            setError("잘못된 접근입니다.");
            setLoading(false);
            return;
        }

        axios
            .get(`http://localhost:8080/api/jobs/${jobPostId}`)
            .then((response) => {
                setJobPost(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("채용 공고 정보를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [jobPostId]);
}