import axios from "axios";

//resume api
const API_RESUME_URL = "http://localhost:8080/api/resume";

// 학교 API URL 목록
const API_URLS = {
    middle: "https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=cdd817e14883a15964aff585352a4b8f&svcType=api&svcCode=SCHOOL&contentType=json&gubun=midd_list&thisPage=1&perPage=1000000",
    high: "https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=cdd817e14883a15964aff585352a4b8f&svcType=api&svcCode=SCHOOL&contentType=json&gubun=high_list&thisPage=1&perPage=1000000",
    university: "https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=cdd817e14883a15964aff585352a4b8f&svcType=api&svcCode=SCHOOL&contentType=json&gubun=univ_list&thisPage=1&perPage=1000000",
};

// 전공 API URL 목록
const MAJOR_API_URLS = {
    high: "https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=cdd817e14883a15964aff585352a4b8f&svcType=api&svcCode=MAJOR&contentType=json&gubun=high_list",
    university: "https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=cdd817e14883a15964aff585352a4b8f&svcType=api&svcCode=MAJOR&contentType=json&gubun=univ_list",
};

const apiResumeService = {

    // API 호출 함수
   fetchData : function(url){
        return axios
            .get(url)
            .then((response) => {
                return response.data.dataSearch?.content || [];
            })
            .catch((error) => {
                console.error("API 호출 오류:", error);
                return [];
            });
    },

// 학교 목록 가져오기
    getAllSchools: () => {
        return axios.get(API_URLS.middle)
            .then(response => {
                const middleSchools = response.data;
                return axios.get(API_URLS.high).then(response => ({
                    middleSchools,
                    highSchools: response.data
                }));
            })
            .then(({ middleSchools, highSchools }) => {
                return axios.get(API_URLS.university).then(response => ({
                    middleSchools,
                    highSchools,
                    universities: response.data
                }));
            })
            .then(({ middleSchools, highSchools, universities }) => {
                return [
                    ...middleSchools.map((school) => ({ name: school.schoolName, type: "중학교" })),
                    ...highSchools.map((school) => ({ name: school.schoolName, type: "고등학교" })),
                    ...universities.map((school) => ({ name: school.schoolName, type: "대학교" })),
                ];
            })
            .catch(error => {
                console.error("학교 목록을 가져오는 중 오류 발생:", error);
                return [];
            });
    },



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
    updateResume:function (resumeId,resumeData){
        axios.put(`${API_RESUME_URL}/update/${resumeId}`,resumeData)
            .then(
                (res)=>{
                    if(res.data){
                      alert("이력서가 수정되었습니다.");
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