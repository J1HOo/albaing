import axios from "axios";


const API_RESUME_URL = "http://localhost:8080/api/resume";

const apiResumeService = {

    //user 정보 get
    getUserInfoById : function (userId,setUser){
        axios.get(`http://localhost:8080/api/user/${userId}`)
            .then(
                (res)=> {
                    setUser(res.data);
                    console.log("백엔드 연결 성공");
                }
            )
            .catch((err)=>{
                alert("정보를 불러오는데 에러가 발생했습니다.");
                console.error("user정보 불러오기 에러 : ",err);
            })
    },

    //이력서 생성
    createResumeForUser: function (postResume,callback){
        axios.post(`${API_RESUME_URL}/create`,postResume)
            .then(
                (res)=>{
                    console.log("resume_백엔드 연결 성공");
                    callback(res.data);
                }
            )
            .catch((err)=>{
                console.error("backend error: ",err);
            })

    },

    //이력서 수정
    updateResume:function (resumeId,updateResume,callback){
        axios.put(`${API_RESUME_URL}/update/${resumeId}`,updateResume)
            .then(
                (res)=>{
                    if(res.data){
                        alert(callback);
                    } else {
                        alert("변경된 내용이 없습니다.");
                    }
                }
            )
            .catch((err)=>{
                console.error("updateResume error : ",err);
                alert("수정중 에러가 발생했습니다.");
            })

    },



    //이력서 조회
    resumeDetails:function (resumeId, setResumes){
      axios
          .get(`${API_RESUME_URL}/${resumeId}`)
          .then(
              (res)=>{
                  setResumes(res.data);
              }
          )
          .catch((err)=>{
              alert("이력서 정보를 불러오는데 에러가 발생했습니다.");
              console.error("resumeDetail error : ", err);
          })
    },



}
export default apiResumeService;