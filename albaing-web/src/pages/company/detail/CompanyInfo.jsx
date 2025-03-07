const CompanyInfo = ({company}) => {
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {year: 'numeric', month: 'long', day: 'numeric'});
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">상세 정보</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">회사명</h3>
                        <p className="mt-1 text-base text-gray-900">{company.companyName}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">대표자</h3>
                        <p className="mt-1 text-base text-gray-900">{company.companyOwnerName}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">설립일</h3>
                        <p className="mt-1 text-base text-gray-900">{formatDate(company.companyOpenDate)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">이메일</h3>
                        <p className="mt-1 text-base text-gray-900">{company.companyEmail || "-"}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">전화번호</h3>
                        <p className="mt-1 text-base text-gray-900">{company.companyPhone || "-"}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">주소</h3>
                        <p className="mt-1 text-base text-gray-900">{company.companyLocalAddress || "-"}</p>
                    </div>
                </div>
            </div>

            {company.companyDescription && (
                <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">회사 소개</h3>
                    <div className="p-4 bg-gray-50 rounded-md">
                        <p className="text-base text-gray-900 whitespace-pre-line">
                            {company.companyDescription}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyInfo;
