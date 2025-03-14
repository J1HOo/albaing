import axios from "axios";

const API_APPLICATION_URL = "http://localhost:8080/api/applications";

const apiMyApplicationService = {
    // 지원한 공고 리스트 가져오기
    getJobApplicationsByResume: function (resumeId, setApplications) {
        return axios
            .get(`${API_APPLICATION_URL}/resume/${resumeId}`)
            .then((res) => {
                setApplications(res.data);
                console.log("지원 목록 가져오기 성공", res.data);
            })
            .catch((err) => {
                console.error("지원 목록 불러오기 에러 발생:", err);
            });
    },

    // 지원한 개수 & 승인 상태 개수 가져오기
    getApplicationStatsByResume: function (resumeId, setApplicationStats) {
        return axios
            .get(`${API_APPLICATION_URL}/status/${resumeId}`)
            .then((res) => {
                setApplicationStats(res.data);
                console.log("지원 현황 가져오기 성공", res.data);
            })
            .catch((err) => {
                console.error("지원 현황 불러오기 에러 발생:", err);
            });
    },


};

export default apiMyApplicationService;
