import axios from "axios";

// 학교 API URL 목록
const API_URLS = {
    middle: "https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=cdd817e14883a15964aff585352a4b8f&svcType=api&svcCode=SCHOOL&contentType=json&gubun=midd_list&thisPage=1&perPage=1000000",
    high: "https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=cdd817e14883a15964aff585352a4b8f&svcType=api&svcCode=SCHOOL&contentType=json&gubun=high_list&thisPage=1&perPage=1000000",
    university: "https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=cdd817e14883a15964aff585352a4b8f&svcType=api&svcCode=SCHOOL&contentType=json&gubun=univ_list&thisPage=1&perPage=1000000",
};

// 전공 API URL 목록
const MAJOR_API_URLS = {
    high: "https://www.career.go.kr/cnet/openapi/getOpenApi.json?apiKey=cdd817e14883a15964aff585352a4b8f&svcType=api&svcCode=MAJOR&contentType=json&gubun=high_list&thisPage=1&perPage=1000",
    university: "https://www.career.go.kr/cnet/openapi/getOpenApi.json?apiKey=cdd817e14883a15964aff585352a4b8f&svcType=api&svcCode=MAJOR&contentType=json&gubun=univ_list&thisPage=1&perPage=1000",
};

// API 호출 함수
const fetchData = (url) => {
    return axios
        .get(url)
        .then((response) => {
            return response.data.dataSearch?.content || [];
        })
        .catch((error) => {
            console.error("API 호출 오류:", error);
            return [];
        });
};

// 학교 목록 가져오기
export const getAllSchools = () => {
    return Promise.all([
        fetchData(API_URLS.middle),
        fetchData(API_URLS.high),
        fetchData(API_URLS.university),
    ])
        .then(([middleSchools, highSchools, universities]) => {
            return [
                ...middleSchools.map((school) => ({ name: school.schoolName, type: "중학교" })),
                ...highSchools.map((school) => ({ name: school.schoolName, type: "고등학교" })),
                ...universities.map((school) => ({ name: school.schoolName, type: "대학교" })),
            ];
        })
        .catch((error) => {
            console.error("학교 목록 가져오기 오류:", error);
            return [];
        });
};

// 전공 목록 가져오기 (facilName을 ',' 기준으로 분리)
export const getAllMajors = () => {
    return Promise.all([
        fetchData(MAJOR_API_URLS.high),
        fetchData(MAJOR_API_URLS.university),
    ])
        .then(([highMajors, universityMajors]) => {
            const highMajorList = highMajors.flatMap((major) =>
                major.facilName ? major.facilName.split(',').map((name) => ({ name: name.trim(), type: "고등학교 전공" })) : []
            );

            const universityMajorList = universityMajors.flatMap((major) =>
                major.facilName ? major.facilName.split(',').map((name) => ({ name: name.trim(), type: "대학교 전공" })) : []
            );

            return [...highMajorList, ...universityMajorList];
        })
        .catch((error) => {
            console.error("전공 목록 가져오기 오류:", error);
            return [];
        });
};