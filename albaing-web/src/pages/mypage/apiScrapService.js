import axios from "axios";


const API_MYPAGE_URL = "http://localhost.8080/api/scrap";

const apiScrapService = {

    insertScrap : function (){
        axios.post(`${API_MYPAGE_URL}/add/${userId}/${jobPostId}`)
            .then(


            )
            .catch()
    },

    deleteScrap : function (){
        axios.delete(`${API_MYPAGE_URL}/remove/${userId}/${jobPostId}`)
    },

    getScrapsByUser : function (){
        axios.get(`${API_MYPAGE_URL}/${userId}`)
    },



}
export default apiScrapService;