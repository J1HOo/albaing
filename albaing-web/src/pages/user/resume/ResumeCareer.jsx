import React from 'react';

const ResumeCareer = ({ careerHistory, onAdd, onEdit, onDelete }) => {
    const careers = Array.isArray(careerHistory)
        ? careerHistory
        : careerHistory
            ? [careerHistory]
            : [];

    const hasNewbie = careers.some(career => career.careerIsCareer === '신입');

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-xl font-semibold text-gray-900">💼 경력 정보</h2>
                <button
                    onClick={onAdd}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    경력 추가
                </button>
            </div>

            {careers.length === 0 ? (
                <div className="bg-gray-50 p-10 rounded-lg border border-gray-200 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 mb-2">등록된 경력이 없습니다.</p>
                    <p className="text-sm text-gray-400">위 '경력 추가' 버튼을 클릭하여 경력 정보를 추가해보세요.</p>
                </div>
            ) : hasNewbie ? (
                <div className="mb-4 p-6 bg-blue-50 rounded-lg border border-blue-100 text-center">
                    <div className="text-5xl mb-3">🌱</div>
                    <p className="text-blue-800 font-medium text-lg">신입으로 설정되었습니다.</p>
                    <p className="text-blue-600 text-sm mt-1 mb-4">첫 직장에서 새로운 시작을 응원합니다!</p>
                    <div className="mt-4">
                        <button
                            onClick={() => onEdit(careers.find(c => c.careerIsCareer === '신입').careerId)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            설정 변경
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {careers.map((career, idx) => (
                        <div key={idx} className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold">{career.careerCompanyName || "회사명 미입력"}</h3>
                                    <p className="text-gray-600 mt-1">
                                        {career.careerJoinDate}
                                        {career.careerJoinDate && (career.careerQuitDate ? ` ~ ${career.careerQuitDate}` : ' ~ 현재 재직중')}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEdit(career.careerId)}
                                        className="text-sm bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => onDelete(idx)}
                                        className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>

                            {career.careerJobDescription && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                                    <div className="text-sm text-gray-500 mb-1">직무 내용</div>
                                    <div className="whitespace-pre-line text-gray-800">
                                        {career.careerJobDescription}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResumeCareer;