import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import About from "../pages/home/About";
import Home from "../pages/home/Home";
import FAQ from "../pages/home/FAQ";
import Contact from "../pages/home/Contact";
import Terms from "../pages/home/Terms";
import Privacy from "../pages/home/Privacy";
import Login from "../pages/auth/login/Login";
import RegisterPage from "../pages/auth/register/RegisterPage";
import RegisterPerson from "../pages/auth/register/RegisterPerson";
import BusinessValidation from "../pages/auth/register/BusinessValidation";
import RegisterCompany from "../pages/auth/register/RegisterCompany";
import Find from "../pages/auth/find/Find";
import FindId from "../pages/auth/find/FindId";
import FindPassword from "../pages/auth/find/FindPassword";
import ChangePassword from "../pages/auth/find/ChangePassword";
import JobPostSearchResults from "../pages/jobpost/JobPostSearchResults";
import ProtectedRoute from "./ProtectedRoute";
import Resume from "../pages/user/resume/Resume";
import Companies from "../pages/company/public/Companies";
import CompanyDetail from "../pages/company/public/CompanyDetail";
import JobpostList from "../pages/jobpost/JobpostList";
import MyPage from "../pages/user/mypage/MyPage";
import MyApplication from "../pages/user/mypage/MyApplication";
import ReviewDetail from "../pages/review/ReviewDetail";
import MyScrap from "../pages/user/mypage/MyScrap";
import MyReviews from "../pages/user/mypage/MyReviews";
import UserEdit from "../pages/user/mypage/UserEdit";
import ResumeEdit from "../pages/user/resume/ResumeEdit";
import CompanyManage from "../pages/company/manage/CompanyManage";
import CompanyProfileEdit from "../pages/company/manage/profile/CompanyProfileEdit";
import JobpostAdd from "../pages/company/manage/jobposts/JobpostAdd";
import JobpostEdit from "../pages/company/manage/jobposts/JobpostEdit";
import ResumeView from "../pages/company/manage/applications/resume/ResumeView";
import NotFound from "../components/layout/NotFound";
import AdminSideBar from "../pages/admin/AdminSideBar";
import AdminResumes from "../pages/admin/AdminResumes";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminJobApplications from "../pages/admin/AdminJobApplications";
import AdminCompanies from "../pages/admin/AdminCompanies";
import AdminJobPosts from "../pages/admin/AdminJobPosts";
import AdminReviews from "../pages/admin/AdminReviews";
import AdminNotices from "../pages/admin/AdminNotices";
import AdminMain from "../pages/admin/AdminMain";

// 메인 레이아웃 컴포넌트
const MainLayout = ({children}) => (
    <div className="flex flex-col min-h-screen">
        <Header/>
        <main className="flex-grow">
            <div className="content-container">
                {children}
            </div>
        </main>
        <Footer/>
    </div>
);

function JobpostDetail() {
    return null;
}

function PathRoute() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 모든 사용자 접근 가능 */}
                <Route path="/" element={<MainLayout><Home /></MainLayout>} /> {/* 메인 홈페이지 */}
                <Route path="/about" element={<MainLayout><About /></MainLayout>} /> {/* 회사 소개 페이지 */}
                <Route path="/customer/faq" element={<MainLayout><FAQ /></MainLayout>} /> {/* 자주 하는 문의 페이지 */}
                <Route path="/customer/contact" element={<MainLayout><Contact /></MainLayout>} /> {/* 문의 페이지 */}
                {/*<Route path="/customer/notice" element={<MainLayout><Notice /></MainLayout>} /> /!* 공지사항 페이지 *!/*/}
                <Route path="/terms" element={<MainLayout><Terms /></MainLayout>} /> {/* 이용약관 페이지 */}
                <Route path="/privacy" element={<MainLayout><Privacy /></MainLayout>} /> {/* 개인정보처리방침 페이지 */}
                <Route path="/login" element={<MainLayout><Login /></MainLayout>} /> {/* 로그인 페이지 */}
                <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} /> {/* 회원가입 선택 페이지 */}
                <Route path="/register/person" element={<MainLayout><RegisterPerson /></MainLayout>} /> {/* 개인 회원가입 페이지 */}
                <Route path="/register/validate" element={<MainLayout><BusinessValidation /></MainLayout>} /> {/* 기업 회원가입 페이지 */}
                <Route path="/register/company" element={<MainLayout><RegisterCompany /></MainLayout>} /> {/* 기업 회원가입 페이지 */}
                <Route path="/find" element={<MainLayout><Find /></MainLayout>} /> {/* 아이디 찾기 페이지 */}
                <Route path="/find/id" element={<MainLayout><FindId /></MainLayout>} /> {/* 아이디 찾기 페이지 */}
                <Route path="/find/password" element={<MainLayout><FindPassword /></MainLayout>} /> {/* 비밀번호 변경 페이지 */}
                <Route path="/change/password" element={<MainLayout><ChangePassword /></MainLayout>} /> {/* 비밀번호 변경 페이지 */}
                <Route path="/search/:regionSelect?/:jobCategorySelect?/:searchKeyword?" element={<MainLayout><JobPostSearchResults /></MainLayout>} /> {/* 검색 결과 페이지 */}

                {/* 로그인한 모든 사용자 접근 가능 */}
                <Route element={<ProtectedRoute/>}>
                    <Route path="/resumes" element={<MainLayout><Resume/></MainLayout>}/> {/* 이력서 조회 페이지 */}
                    <Route path="/companies" element={<MainLayout><Companies/></MainLayout>}/> {/* 회사 목록 페이지 */}
                    <Route path="/companies/:companyId" element={<MainLayout><CompanyDetail/></MainLayout>}/> {/* 회사 상세 정보 페이지 */}
                    <Route path="/jobs" element={<MainLayout><JobpostList/></MainLayout>}/> {/* 채용공고 목록 페이지 */}
                    <Route path="/jobs/:jobPostId" element={<MainLayout><JobpostDetail/></MainLayout>}/> {/* 채용공고 상세 페이지 */}
                    <Route path="/companies/:companyId/reviews/:reviewId" element={<MainLayout><ReviewDetail/></MainLayout>}/> {/* 회사 리뷰 목록 페이지 */}
                </Route>

                {/* 일반 사용자만 접근 가능 */}
                <Route element={<ProtectedRoute userTypeRequired="personal"/>}>
                    <Route path="/mypage/:userId" element={<MainLayout><MyPage /></MainLayout>} /> {/* 일반 사용자 마이페이지 메인 */}
                    <Route path="/mypage/applications/:resumeId" element={<MainLayout><MyApplication /></MainLayout>} /> {/* 일반 사용자 지원 내역 페이지 */}
                    <Route path="/mypage/scraps/:userId" element={<MainLayout><MyScrap /></MainLayout>} /> {/* 일반 사용자 스크랩 목록 페이지 */}
                    <Route path="/mypage/reviews/:userId" element={<MainLayout><MyReviews /></MainLayout>} /> {/* 일반 사용자 작성 리뷰 목록 페이지 */}
                    <Route path="/mypage/user/:userId/edit" element={<MainLayout><UserEdit /></MainLayout>} /> {/* 사용자 정보 수정 페이지*/}
                    <Route path="/resumes/edit" element={<MainLayout><ResumeEdit /></MainLayout>} /> {/* 이력서 편집 페이지 */}
                </Route>

                {/* 기업 사용자만 접근 가능 */}
                <Route element={<ProtectedRoute userTypeRequired="company"/>}>
                    <Route path="/company/manage/:companyId" element={<CompanyManage/>}/> {/* 회사 관리 메인 페이지 */}
                    <Route path="/company/:companyId/reviews/:reviewId" element={<ReviewDetail/>}/> {/* 회사 리뷰 상세 페이지 */}
                    <Route path="/company/edit/:companyId" element={<CompanyProfileEdit/>}/> {/* 회사 상세 정보 페이지 수정*/}
                    <Route path="/jobs/new" element={<MainLayout><JobpostAdd/></MainLayout>}/> {/* 채용공고 등록 페이지 */}
                    <Route path="/jobs/edit/:jobPostId" element={<MainLayout><JobpostEdit/></MainLayout>}/> {/* 채용공고 수정 페이지 */}
                    <Route path="/resumes/:resumeId/user/:userId" element={<MainLayout><ResumeView /></MainLayout>}/> {/* 지원자 이력서 상세 보기 */}
                </Route>

                {/* 관리자만 접근 가능 */}
                {/*<Route element={<ProtectedRoute userTypeRequired="admin"/>}>*/}
                    <Route path="/admin" element={<MainLayout><AdminMain/></MainLayout>} /> {/* 관리자 대시보드 페이지 */}
                    <Route path="/admin/users" element={<MainLayout><AdminUsers/></MainLayout>} />
                    <Route path="/admin/resumes" element={<MainLayout><AdminResumes/></MainLayout>} />
                    <Route path="/admin/applications" element={<MainLayout><AdminJobApplications/></MainLayout>} />
                    <Route path="/admin/companies" element={<MainLayout><AdminCompanies/></MainLayout>} />
                    <Route path="/admin/job-posts" element={<MainLayout><AdminJobPosts/></MainLayout>} />
                    <Route path="/admin/reviews" element={<MainLayout><AdminReviews/></MainLayout>} />
                    <Route path="/admin/notices" element={<MainLayout><AdminNotices/></MainLayout>} />
                {/*</Route>*/}

                {/* 모든 정의되지 않은 경로 */}
                <Route path="*" element={<NotFound/>}/> {/* 404 Not Found 페이지 */}
            </Routes>
        </BrowserRouter>
    );
}

export default PathRoute;