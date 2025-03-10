import axios from "axios";

const API_MYPAGE_URL = "http://localhost:8080/api";

// API 서비스
const apiMyPageService = {
    getUserById: function (userId,setUser) {
        axios
            .get(`${API_MYPAGE_URL}/user/${userId}`)
    .then(
            (res) => {
                setUser(res.data);
                console.log("사용자 정보 조회 성공", res.data);
            })
            .catch((err) => {
                console.error("사용자 정보 조회 실패", err);
            });
    },

    // 이력서 정보 가져오기
    getResumeById: function (userId,setResume) {
        axios
            .get(`http://localhost:8080/api/resume/user/${userId}`)
    .then((res) => {
            setResume(res.data);
            console.log("사용자 이력서 조회 성공", res.data);
        })
            .catch((err) => {
                console.error("사용자 이력서 조회 실패", err);
            });
    },
    // 사용자 정보 수정
    updateUser: function (userId,setUsers) {
        axios
            .put(`${API_MYPAGE_URL}/user/update/${userId}`, setUsers)
    .then((res) => {
           setUsers(res.data);
           console.log("사용자 정보 수정 성공 : ",res.data);

        })
            .catch((err) => {
                console.error("사용자 정보 수정 실패", err);
            });
    },
    // 특정 사용자의 스크랩 상태 카운트 조회
    getScrapStatusCount: function (userId) {
        return axios.get(`${API_MYPAGE_URL}/status/${userId}`)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error("스크랩 상태 카운트 조회 실패", err);
            });
    },

    // 특정 사용자의 스크랩 목록 조회
    getScrapsByUser: function (userId) {
        return axios.get(`${API_MYPAGE_URL}/${userId}`)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error("스크랩 목록 조회 실패", err);
            });
    },

};

export default apiMyPageService;
