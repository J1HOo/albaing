import axios from "axios";


const apiMyPageService = {

    getUserById: function (userId) {
        axios.get(`api/user/${userId}`)
            .then(
                (res) => {
                    if (res.data) {
                        console.log("사용자 정보 조회 성공", res.data);
                    }
                })
            .catch((err) => {
                console.error("사용자 정보 조회 실패", err);
            })

    },

    getResumeById: function (resumeId) {
        return axios.get(`/api/resume/${resumeId}`)
            .then(
                (res) => {
                    if(res.data) {
                        console.log("사용자 이력서 조회: ", res.data);
                        return res.data;
                    }
                }
            )
            .catch((err) => {
                console.error("사용자 이력서 조회 실패 : ", err);
            })


    },

}

export default apiMyPageService;

