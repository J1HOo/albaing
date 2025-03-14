import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BuildingOfficeIcon,
    UserIcon,
    CalendarIcon,
    PhoneIcon,
    AtSymbolIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';

const CompanyProfile = ({ companyData }) => {
    const navigate = useNavigate();

    if (!companyData) return null;

    // 날짜 포맷 함수
    const formatDate = (dateString) => {
        if (!dateString) return '정보 없음';

        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">회사 정보</h1>
                <button
                    onClick={() => navigate(`/companies/${companyData.companyId}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    공개 페이지 보기
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* 회사 프로필 헤더 */}
                <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
                            {companyData.companyLogo ? (
                                <img
                                    src={companyData.companyLogo}
                                    alt={`${companyData.companyName} 로고`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <BuildingOfficeIcon className="h-12 w-12 text-blue-500" />
                            )}
                        </div>

                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold">{companyData.companyName}</h2>
                            <p className="mt-1 text-blue-100">
                                <span className="bg-blue-700 bg-opacity-50 px-2 py-1 rounded text-xs">
                                    {companyData.companyApprovalStatus === 'approved' ? '승인됨' :
                                        companyData.companyApprovalStatus === 'approving' ? '승인 대기중' : '숨김'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 회사 정보 내용 */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem
                            icon={<UserIcon className="h-5 w-5 text-blue-500" />}
                            label="대표자명"
                            value={companyData.companyOwnerName || '정보 없음'}
                        />

                        <InfoItem
                            icon={<CalendarIcon className="h-5 w-5 text-blue-500" />}
                            label="설립일"
                            value={formatDate(companyData.companyOpenDate)}
                        />

                        <InfoItem
                            icon={<PhoneIcon className="h-5 w-5 text-blue-500" />}
                            label="연락처"
                            value={companyData.companyPhone || '정보 없음'}
                        />

                        <InfoItem
                            icon={<AtSymbolIcon className="h-5 w-5 text-blue-500" />}
                            label="이메일"
                            value={companyData.companyEmail || '정보 없음'}
                        />

                        <InfoItem
                            icon={<BuildingOfficeIcon className="h-5 w-5 text-blue-500" />}
                            label="사업자등록번호"
                            value={companyData.companyRegistrationNumber || '정보 없음'}
                            className="md:col-span-2"
                        />

                        <InfoItem
                            icon={<MapPinIcon className="h-5 w-5 text-blue-500" />}
                            label="회사 주소"
                            value={companyData.companyLocalAddress || '정보 없음'}
                            className="md:col-span-2"
                        />
                    </div>

                    {/* 회사 소개 */}
                    {companyData.companyDescription && (
                        <div className="mt-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">회사 소개</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700 whitespace-pre-line">
                                    {companyData.companyDescription}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 회사 정보 수정 버튼 */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={() => navigate(`/company/edit/${companyData.companyId}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            회사 정보 수정
                        </button>
                    </div>
                </div>
            </div>

            {/* 가입 및 수정 정보 */}
            <div className="bg-white rounded-lg shadow p-4 text-center text-sm text-gray-500">
                <p>
                    가입일: {formatDate(companyData.companyCreatedAt)} |
                    최종 수정일: {formatDate(companyData.companyUpdatedAt)}
                </p>
            </div>
        </div>
    );
};

// 정보 항목 컴포넌트
const InfoItem = ({ icon, label, value, className = '' }) => (
    <div className={`border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center mb-2">
            {icon}
            <span className="ml-2 text-sm font-medium text-gray-500">{label}</span>
        </div>
        <p className="text-gray-900">{value}</p>
    </div>
);

export default CompanyProfile;