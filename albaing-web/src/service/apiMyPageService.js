import axios from "axios";

const API_MYPAGE_URL = "http://localhost:8080/api";

// API 서비스
const apiMyPageService = {

    getUserById: function (userId,setUser) {
        return axios
            .get(`${API_MYPAGE_URL}/user/${userId}`)
            .then(
                (res) => {
                    setUser(res.data);
                })
            .catch((err) => {
                console.error("사용자 정보 조회 실패", err);
            });
    },

    // 이력서 정보 가져오기
    getResumeById: function (userId,setResume) {
        return axios
            .get(`http://localhost:8080/api/resume/user/${userId}`)
            .then((res) => {
                setResume(res.data);
            })
            .catch((err) => {
                console.error("사용자 이력서 조회 실패", err);
            });
    },
    // 사용자 정보 수정
    updateUser: function (userId,setUsers) {
        return axios
            .put(`${API_MYPAGE_URL}/user/update/${userId}`, setUsers, {
                headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                setUsers(res.data);

            })
            .catch((err) => {
                console.error("사용자 정보 수정 실패", err);
            });
    },


};

export default apiMyPageService;