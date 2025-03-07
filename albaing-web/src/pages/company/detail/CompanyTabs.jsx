const CompanyTabs = ({activeTab, setActiveTab}) => {
    return (
        <div className="border-b border-gray-200 mb-8 flex space-x-8">
            {["info", "jobs", "reviews"].map(
                (tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm 
                    ${activeTab === tab ? "border-blue-500 text-blue-600" : "text-gray-500"
                        }`}
                    >
                        {
                            tab === "info"
                                ?
                                "회사 정보"
                                : tab === "jobs"
                                    ?
                                    "채용 공고"
                                    :
                                    "기업 리뷰"
                        }
                    </button>
                ))}
        </div>
    );
};

export default CompanyTabs;
