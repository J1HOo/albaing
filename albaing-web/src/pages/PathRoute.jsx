import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';


import Home from './home/Home';
import CompanyDetail from './company/CompanyDetail';
import CompanyMain from './company/CompanyMain';
import ReviewDetail from './review/user/ReviewDetail';
import JobpostAdd from './jobpost/JobpostAdd';
import JobpostDetail from './jobpost/JobpostDetail';
import JobpostEdit from './jobpost/JobpostEdit';
import JobpostList from './jobpost/JobpostList';
import Login from './login/Login';
import RegisterCompany from './register/RegisterCompany';
import RegisterPerson from './register/RegisterPerson';
import Resume from './resume/Resume';
import ResumeEdit from './resume/ResumeEdit';
import UserEdit from "./mypage/UserEdit";
import NotFound from "../components/ NotFound";
import RegisterPage from "./register/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import ReviewManagement from "./review/company/ReviewManagement";
import MyPage from "./mypage/MyPage";
import MyApplication from "./mypage/MyApplication";
import MyScrap from "./mypage/MyScrap";
import MyReviews from "./mypage/MyReviews";

// 메인 레이아웃 컴포넌트
const MainLayout = ({ children }) => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
            <div className="content-container">
                {children}
            </div>
        </main>
        <Footer />
    </div>
);

function PathRoute() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 모든 사용자 접근 가능 */}
                <Route path="/" element={<MainLayout><Home /></MainLayout>} /> {/* 메인 홈페이지 */}
                <Route path="/login" element={<MainLayout><Login /></MainLayout>} /> {/* 로그인 페이지 */}
                <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} /> {/* 회원가입 선택 페이지 */}
                {/*<Route path="/register/success" element={<MainLayout><RegistrationSuccess /></MainLayout>} /> /!* 회원가입 성공 페이지 *!/*/}
                <Route path="/register/person" element={<MainLayout><RegisterPerson /></MainLayout>} /> {/* 개인 회원가입 페이지 */}
                <Route path="/register/company" element={<MainLayout><RegisterCompany /></MainLayout>} /> {/* 기업 회원가입 페이지 */}
                {/*<Route path="/find/id" element={<MainLayout><FindId /></MainLayout>} /> /!* 아이디 찾기 페이지 *!/*/}
                {/*<Route path="/find/id/result" element={<MainLayout><FindIdResult /></MainLayout>} /> /!* 아이디 찾기 결과 페이지 *!/*/}
                {/*<Route path="/find/password" element={<MainLayout><FindPassword /></MainLayout>} /> /!* 비밀번호 찾기 페이지 *!/*/}
                {/*<Route path="/find/password/result" element={<MainLayout><FindPasswordResult /></MainLayout>} /> /!* 비밀번호 찾기 결과 페이지 *!/*/}
                <Route path="/companies/:companyId" element={<MainLayout><CompanyDetail /></MainLayout>} /> {/* 회사 상세 정보 페이지 */}
                <Route path="/jobs" element={<MainLayout><JobpostList /></MainLayout>} /> {/* 채용공고 목록 페이지 */}
                <Route path="/jobs/:id" element={<MainLayout><JobpostDetail /></MainLayout>} /> {/* 채용공고 상세 페이지 */}

                {/* 일반 사용자만 접근 가능 */}
                <Route element={<ProtectedRoute userTypeRequired="personal"/> }>
                <Route path="/mypage" element={<MainLayout><MyPage /></MainLayout>} /> {/* 일반 사용자 마이페이지 메인 */}
                <Route path="/mypage/applications" element={<MainLayout><MyApplication /></MainLayout>} /> {/* 일반 사용자 지원 내역 페이지 */}
                <Route path="/mypage/scraps" element={<MainLayout><MyScrap /></MainLayout>} /> {/* 일반 사용자 스크랩 목록 페이지 */}
                <Route path="/mypage/reviews" element={<MainLayout><MyReviews /></MainLayout>} /> {/* 일반 사용자 작성 리뷰 목록 페이지 */}
                <Route path="/mypage/user/edit" element={<MainLayout><UserEdit /></MainLayout>} /> {/* 사용자 정보 수정 페이지*/}
                <Route path="/resumes" element={<MainLayout><Resume /></MainLayout>} /> {/* 이력서 조회 페이지 */}
                <Route path="/resumes/edit" element={<MainLayout><ResumeEdit /></MainLayout>} /> {/* 이력서 편집 페이지 */}
                </Route>

                {/* 기업 사용자만 접근 가능 */}
                <Route element={<ProtectedRoute userTypeRequired="company"/> }>
                <Route path="/company/manage/:companyId" element={<CompanyMain />} /> {/* 회사 관리 메인 페이지 */}
                <Route path="/company/:companyId/reviews/manage" element={<ReviewManagement />} /> {/* 회사 리뷰 관리 페이지 */}
                <Route path="/company/:companyId/reviews/:reviewId" element={<ReviewDetail />} /> {/* 회사 리뷰 상세 페이지 */}
                <Route path="/jobs/new" element={<MainLayout><JobpostAdd /></MainLayout>} /> {/* 채용공고 등록 페이지 */}
                <Route path="/jobs/:jobPostId" element={<MainLayout><JobpostDetail /></MainLayout>} /> {/* 채용공고 상세 페이지 */}
                <Route path="/jobs/edit/:jobPostId" element={<MainLayout><JobpostEdit /></MainLayout>} /> {/* 채용공고 수정 페이지 */}
                {/*<Route path="/jobs/:id/applications" element={<MainLayout><JobApplicationManager /></MainLayout>} /> /!* 채용공고 지원자 관리 페이지 *!/*/}
                </Route>

                {/* 로그인한 모든 사용자 접근 가능 - ProtectedRoute 사용(타입 제한 없음) */}
                <Route element={<ProtectedRoute /> }>
                    <Route path="/companies/:companyId/reviews/:reviewId" element={<MainLayout><ReviewDetail /></MainLayout>} /> {/* 회사 리뷰 목록 페이지 */}
                </Route>

                {/* 관리자만 접근 가능 */}
                {/*<Route path="/admin" element={<MainLayout><AdminMain /></MainLayout>} /> /!* 관리자 대시보드 페이지 *!/*/}


                {/* 모든 정의되지 않은 경로 */}
                <Route path="*" element={<NotFound />} /> {/* 404 Not Found 페이지 */}
            </Routes>
        </BrowserRouter>
    );
}

export default PathRoute;