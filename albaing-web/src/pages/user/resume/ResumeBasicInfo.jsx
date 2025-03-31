import React from 'react';

const ResumeBasicInfo = ({
                             resumeData,
                             preferredLocation,
                             jobCategories,
                             jobTypes,
                             workingPeriods,
                             workSchedules,
                             shiftHours,
                             onChange,
                             onAddressClick,
                             formErrors
                         }) => {
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">기본 정보</h2>

            <div className="mb-6">
                <label htmlFor="resumeTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    이력서 제목 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="resumeTitle"
                    name="resumeTitle"
                    value={resumeData.resumeTitle || ''}
                    onChange={onChange}
                    placeholder="이력서 제목을 입력하세요"
                    className="w-full p-3 border rounded-lg shadow-sm"
                />
                {formErrors.resumeTitle && (
                    <p className="text-sm text-red-600">{formErrors.resumeTitle}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">희망 근무지</label>
                    <input
                        type="text"
                        name="resumeLocation"
                        value={preferredLocation}
                        onClick={onAddressClick}
                        readOnly
                        className="w-full p-3 border rounded-lg shadow-sm"
                        placeholder="근무지를 선택하세요"
                    />
                </div>

                <selectField
                    id="resumeJobCategory"
                    label="희망 직종"
                    options={jobCategories}
                    value={resumeData.resumeJobCategory}
                    name="resumeJobCategory"
                    onChange={onChange}
                />

                <selectField
                    id="resumeJobType"
                    label="희망 고용형태"
                    options={jobTypes}
                    value={resumeData.resumeJobType}
                    name="resumeJobType"
                    onChange={onChange}
                />

                <selectField
                    id="resumeJobDuration"
                    label="희망 근무기간"
                    options={workingPeriods}
                    value={resumeData.resumeJobDuration}
                    name="resumeJobDuration"
                    onChange={onChange}
                />

                <selectField
                    id="resumeWorkSchedule"
                    label="희망 근무요일"
                    options={workSchedules}
                    value={resumeData.resumeWorkSchedule}
                    name="resumeWorkSchedule"
                    onChange={onChange}
                />

                <selectField
                    id="resumeWorkTime"
                    label="희망 근무시간"
                    options={shiftHours}
                    value={resumeData.resumeWorkTime}
                    name="resumeWorkTime"
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

const selectField = ({ id, label, options, value, name, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <select
            id={id}
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-full p-3 border rounded-lg shadow-sm bg-white"
        >
            <option value="">선택</option>
            {options.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
);

export default ResumeBasicInfo;
