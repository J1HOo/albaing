import React from 'react';

const ResumeCareer = ({careerHistory, onAdd, onEdit, onDelete}) => {
    const careers = Array.isArray(careerHistory)
        ? careerHistory
        : careerHistory
            ? [careerHistory]
            : [];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">경력 정보</h2>
                <button onClick={onAdd} className="bg-blue-500 text-white px-4 py-2 rounded-md">추가</button>
            </div>

            {careers.length === 0 ? (
                <div className="text-gray-500">등록된 경력이 없습니다.</div>
            ) : (
                careers.map((career, idx) => {
                    console.log("career", career);
                        return (


                            <div key={idx} className="mb-4 p-4 bg-white rounded border">
                                <h3 className="text-lg font-semibold">{career.careerCompanyName}</h3>
                                <p>{career.careerJoinDate} ~ {career.careerQuitDate || '재직중'}</p>
                                <p>{career.careerJobDescription}</p>
                                <div className="mt-2 flex gap-2">
                                    <button onClick={() => onEdit(career.careerId)}
                                            className="text-sm bg-gray-100 px-3 py-1 rounded">수정
                                    </button>
                                    <button onClick={() => onDelete(idx)}
                                            className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded">삭제
                                    </button>
                                </div>
                            </div>
                        )
                    }
                )
            )}
        </div>
    );
};

export default ResumeCareer;
