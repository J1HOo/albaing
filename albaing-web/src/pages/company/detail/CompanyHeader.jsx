const CompanyHeader = ({ company }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 flex justify-between">
                <h1 className="text-3xl font-bold">{company.companyName}</h1>
                {company.companyLogo && (
                    <img src={company.companyLogo} alt="회사 로고" className="h-16 w-16 object-contain" />
                )}
            </div>
        </div>
    );
};

export default CompanyHeader;
