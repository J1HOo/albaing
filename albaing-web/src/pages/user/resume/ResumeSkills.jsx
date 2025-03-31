import React from 'react';

const ResumeSkills = ({ skills, onChange }) => {
    const skillArray = skills?.split(',')?.map(skill => skill.trim()).filter(Boolean);

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">보유 스킬</h2>

            <textarea
                name="resumeJobSkill"
                value={skills}
                onChange={onChange}
                placeholder="쉼표로 구분하여 입력하세요. 예: Photoshop, 영어회화, Java"
                rows={4}
                className="w-full p-3 border rounded-lg shadow-sm"
            />

            {skillArray?.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold mb-2">등록된 스킬</h4>
                    <div className="flex flex-wrap gap-2">
                        {skillArray.map((skill, idx) => (
                            <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeSkills;
