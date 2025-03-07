import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import CompanyHeader from "./CompanyHeader";
import CompanyTabs from "./CompanyTabs";
import CompanyInfo from "./CompanyInfo";
import JobList from "./JobList";
import ReviewList from "./ReviewList";

const CompanyDetail = () => {
    const {companyId} = useParams();

    const [company, setCompany] = useState(null);
    const [jobPosts, setJobPosts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("info");
    const [showReviewModal, setShowReviewModal] = useState(false);

    // 페이지네이션 상태
    const [jobPage, setJobPage] = useState(1);
    const [reviewPage, setReviewPage] = useState(1);
    // 현재 페이지에서 몇 개씩 데이터를 보여줄 것인지 설정 현재는 페이지별로 5개씩 보여준다 설정한 상태
    const itemsPerPage = 5;

    // 각 컴포넌트 별로 필요한 endpoint 로딩 후 컴포넌트별로 사용할 수 있도록 설정
    useEffect(() => {
        axios.get(`/api/companies/${companyId}`)
            .then(res => setCompany(res.data))
            .catch(() => setError("회사 정보를 불러오는 중 오류가 발생했습니다."));

        axios.get(`/api/jobs/company/${companyId}`)
            .then(res => setJobPosts(res.data))
            .catch(() => setError("채용 정보를 불러오는 중 오류가 발생했습니다."));

        axios.get(`/api/companies/${companyId}/reviews`)
            .then(res => setReviews(res.data))
            .catch(() => setError("리뷰 정보를 불러오는 중 오류가 발생했습니다."))
            .finally(() => setLoading(false));
    }, [companyId]);

    if (loading) return <div className="text-center py-10">로딩 중...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <CompanyHeader company={company}/>
            <CompanyTabs activeTab={activeTab}
                         setActiveTab={setActiveTab}/>

            {activeTab === "info"
                             &&  <CompanyInfo company={company}/>
            }
            {activeTab === "jobs" && (
                <JobList jobPosts={jobPosts}
                         currentPage={jobPage}
                         setCurrentPage={setJobPage}
                         itemsPerPage={itemsPerPage}/>
            )}
            {activeTab === "reviews" && (
                <ReviewList reviews={reviews}
                            currentPage={reviewPage}
                            setCurrentPage={setReviewPage}
                            itemsPerPage={itemsPerPage}
                            onReviewClick={() => setShowReviewModal(true)}
                />
            )}
        </div>
    );
};

export default CompanyDetail;
