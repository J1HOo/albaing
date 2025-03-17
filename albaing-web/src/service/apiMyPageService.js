import axios from "axios";

const API_MYPAGE_URL = "http://localhost:8080/api";

// API 서비스
const apiMyPageService = {

    getUserById: function (userId, setUser) {
        return axios
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
    getResumeById: function (userId, setResume) {
        return axios
            .get(`${API_MYPAGE_URL}/resume/user/${userId}`)
            .then((res) => {
                setResume(res.data);
                console.log("사용자 이력서 조회 성공", res.data);

            })
            .catch((err) => {
                console.error("사용자 이력서 조회 실패", err);
            });
    },
    // 사용자 정보 수정
    updateUser: function (userId, setUsers, userProfileImage) {
        const formData = new FormData();

        formData.append("user", JSON.stringify(user));
        if (userProfileImage) {
            formData.append("userProfileImage", userProfileImage); // 이미지 파일 추가
        }

        return axios
            .put(`${API_MYPAGE_URL}/user/update/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            })
            .then((res) => {
                console.log("사용자 정보 수정 성공 : ", res.data);
                return res.data;  // 수정된 사용자 정보 반환
            })
            .catch((err) => {
                console.error("사용자 정보 수정 실패", err);
                throw err;  // 에러 전달
            });
    },


};

export default apiMyPageService;