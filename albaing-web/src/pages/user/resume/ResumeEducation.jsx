import React from 'react';

const ResumeEducation = ({ educationHistory, onEditClick }) => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-xl font-semibold text-gray-900">학력 정보</h2>
                <button onClick={onEditClick} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    {educationHistory ? '수정' : '추가'}
                </button>
            </div>

            {educationHistory ? (
                <div className="bg-white border rounded-lg p-4">
                    <h3 className="text-lg font-bold">{educationHistory.eduSchool || '학교명 없음'}</h3>
                    <p>{educationHistory.eduDegree} - {educationHistory.eduMajor}</p>
                    <p>{educationHistory.eduStatus} / {educationHistory.eduAdmissionYear} ~ {educationHistory.eduGraduationYear || '현재'}</p>
                </div>
            ) : (
                <div className="text-gray-500">학력 정보가 없습니다. 추가 버튼을 눌러 등록해주세요.</div>
            )}
        </div>
    );
};

export default ResumeEducation;
