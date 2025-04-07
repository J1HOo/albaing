import React from 'react';

const ResumeIntroduction = ({ introduction, onChange }) => {
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">✨ 자기소개</h2>
            <textarea
                name="resumeIntroduction"
                value={introduction}
                onChange={onChange}
                placeholder="자신의 경험과 역량을 작성해주세요."
                rows={6}
                className="w-full p-3 border rounded-lg shadow-sm"
            />

            <div className="mt-4 text-sm text-gray-600">
                <ul className="list-disc pl-5 space-y-1">
                    <li>경험을 구체적으로 작성하세요.</li>
                    <li>지원 동기와 성격을 나타내세요.</li>
                    <li>길지 않게 핵심 내용을 위주로 작성하세요.</li>
                </ul>
            </div>
        </div>
    );
};

export default ResumeIntroduction;
