import axios from "axios";


const API_SCRAP_URL = "http://localhost:8080/api/scrap";

const apiScrapService = {
    // 스크랩 추가
    addScrap: function (userId, jobPostId) {
       return axios
            .post(`${API_SCRAP_URL}/add/${userId}/${jobPostId}`)
            .then((res) => {
                console.log("스크랩 추가 성공");
                return jobPostId;
            })
            .catch((err) => {
                console.error("스크랩 추가 실패:", err);
                throw err;
            });
    },

    // 스크랩 삭제
    removeScrap: function (userId, jobPostId)  {
        return axios
            .delete(`${API_SCRAP_URL}/remove/${userId}/${jobPostId}`)
            .then((res) => {
                console.log("스크랩 삭제 성공");
                return jobPostId;
            })
            .catch((err) => {
                console.error("스크랩 삭제 실패:", err);
                throw err;
            });
    },

    // 특정 사용자의 스크랩 목록 조회
    getScrapsByUser: function (userId, setScrap) {
        return axios
            .get(`${API_SCRAP_URL}/${userId}`)
            .then((res) => {
                setScrap(res.data);
                console.log("스크랩 목록 가져오기 성공",res.data);
            })
            .catch((err) => {
                console.error("스크랩 목록 조회 실패:", err);
                throw err;
            });
    },
};

export default apiScrapService;
