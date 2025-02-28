import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import AdminMain from './pages/admin/AdminMain';

import CompanyDetail from './pages/company/CompanyDetail';
import CompanyMain from './pages/company/CompanyMain';
import CompanyReview from './pages/company/CompanyReview';
import CompanyReviewPost from './pages/company/CompanyReviewPost';

import FindId from './pages/find/FindId';
import FindIdResult from './pages/find/FindIdResult';
import FindPassword from './pages/find/FindPassword';
import FindPasswordResult from './pages/find/FindPasswordResult';

import JobpostAdd from './pages/jobpost/JobpostAdd';
import JobpostDetail from './pages/jobpost/JobpostDetail';
import JobpostEdit from './pages/jobpost/JobpostEdit';
import JobpostList from './pages/jobpost/JobpostList';

import Login2 from './pages/login/Login2';

import MyApplication from './pages/mypage/MyApplication';
import MyPage from './pages/mypage/MyPage';
import MyScrap from './pages/mypage/MyScrap';
import MyReviews from './pages/mypage/MyReviews';

import RegistrationSuccess from './pages/register/success/RegistrationSuccess';
import RegisterCompany from './pages/register/RegisterCompany';
import RegisterPerson from './pages/register/RegisterPerson';

import Resume from './pages/resume/Resume';
import ResumeEdit from './pages/resume/ResumeEdit';

import Home from '/pages/home/Home';

function PathRoute() {

    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                {/* 메인페이지 */}
                <Route path="/" element={<Home/>} />

                {/* 로그인 관련 페이지 */}
                <Route path="/login" element={<Login2/>} />

                {/* 회사 관련 페이지 */}
                <Route path="/company" element={<CompanyMain/>} />
                <Route path="/company/detail/:id" element={<CompanyDetail/>} />
                <Route path="/company/review" element={<CompanyReview/>} />
                <Route path="/company/review/post" element={<CompanyReviewPost/>} />

                {/* 채용 공고 관련 페이지 */}
                <Route path="/jobpost/add" element={<JobpostAdd/>} />
                <Route path="/jobpost/detail/:id" element={<JobpostDetail/>} />
                <Route path="/jobpost/edit/:id" element={<JobpostEdit/>} />
                <Route path="/jobpost/list" element={<JobpostList/>} />

                {/* 마이페이지 관련 페이지 */}
                <Route path="/mypage" element={<MyPage/>} />
                <Route path="/mypage/my-application" element={<MyApplication/>} />
                <Route path="/mypage/my-scrap" element={<MyScrap/>} />
                <Route path="/mypage/my-reviews" element={<MyReviews/>} />

                {/* 회원가입 관련 페이지 */}
                <Route path="/register/success" element={<RegistrationSuccess/>} />
                <Route path="/register/company" element={<RegisterCompany/>} />
                <Route path="/register/person" element={<RegisterPerson/>} />

                {/* 비밀번호/아이디 찾기 페이지 */}
                <Route path="/find/id" element={<FindId/>} />
                <Route path="/find/id/result" element={<FindIdResult/>} />
                <Route path="/find/password" element={<FindPassword/>} />
                <Route path="/find/password/result" element={<FindPasswordResult/>} />

                {/* 이력서 관련 페이지 */}
                <Route path="/resume" element={<Resume/>} />
                <Route path="/resume/edit" element={<ResumeEdit/>} />

                {/* 어드민 관련 페이지 */}
                <Route path="/admin" element={<AdminMain/>} />
            </Routes>
            <Footer/>
        </BrowserRouter>
    )
}

export default PathRoute;