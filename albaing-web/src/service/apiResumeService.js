import axios from 'axios';
import { getErrorMessage } from '../components/ErrorHandler';

// API 기본 URL 설정
const API_URL = process.env.REACT_APP_API_URL || '';

const apiResumeService = {
    // 이력서 ID로 조회
    getResume: function(resumeId) {
        return axios.get(`${API_URL}/api/resume/${resumeId}`, { withCredentials: true })
            .then(response => response.data)
            .catch(error => {
                console.error('이력서 조회 오류:', getErrorMessage(error));
                throw error;
            });
    },


    // 사용자 ID로 이력서 조회
    getResumeByUserId: (userId) => {
        return axios.get(`${API_URL}/api/resume/user/${userId}`, { withCredentials: true })
            .then(response => response.data)
            .catch(error => {
                console.error('이력서 조회 오류:', getErrorMessage(error));
                throw error;
            });
    },


    // 이력서 업데이트
    updateResume: (resumeId, resumeData) => {
        return axios
            .put(`${API_URL}/api/resume/update/${resumeId}`, resumeData, { withCredentials: true })
            .then(response => response.data)
            .catch(error => {
                console.error('이력서 업데이트 오류:', getErrorMessage(error));
                throw error;  // 예외를 던져 호출한 곳에서 처리하도록 함
            });
    },
};

export default apiResumeService;