import React from 'react';

const ResumeEducation = ({ educationHistory, onEditClick }) => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-xl font-semibold text-gray-900">🎓 학력 정보</h2>
                <button onClick={onEditClick}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20"
                         fill="currentColor">
                        <path fillRule="evenodd"
                              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                              clipRule="evenodd"/>
                    </svg>
                    {educationHistory ? '수정' : '추가'}
                </button>
            </div>

            {educationHistory ? (
                <div className="bg-white border rounded-lg p-4">
                    <h3 className="text-lg font-bold mt-2">{educationHistory.eduSchool || '학교명 없음'} </h3>
                    <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">

                        <p className="text-gray-600 mt-1">{educationHistory.eduDegree} </p>
                        <p className="text-gray-600 mt-1">{educationHistory.eduMajor}</p>
                        <p className="text-gray-600 mt-1">{educationHistory.eduStatus} </p>
                        <p className="text-gray-600 mt-1">{educationHistory.eduAdmissionYear} ~ {educationHistory.eduGraduationYear || '현재'}</p>
                    </div>
                </div>
            ) : (
                <div className="text-gray-500">학력 정보가 없습니다. 추가 버튼을 눌러 등록해주세요.</div>
                    )}
                </div>
            );
            };

            export default ResumeEducation;
