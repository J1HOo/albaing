import {Link} from "react-router-dom";
import Pagination from "./Pagination";

const JobList = ({jobPosts, currentPage, setCurrentPage, itemsPerPage}) => {
    const currentJobs = jobPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">채용 공고</h2>
            {currentJobs.length ? currentJobs.map(
                (job) => (
                    <div key={job.jobPostId}
                         className="border p-4 rounded-md mt-4">
                        <Link to={`/jobs/${job.jobPostId}`}
                              className="text-blue-600">
                            {job.jobPostTitle}
                        </Link>
                        <div className="text-sm text-gray-500 space-y-1">
                            <p>
                                <span className="font-medium">직종:</span> {job.jobPostJobCategory}
                            </p>
                            <p>
                                <span className="font-medium">근무형태:</span> {job.jobPostJobType}
                            </p>
                            <p>
                                <span className="font-medium">급여:</span> {job.jobPostSalary}
                            </p>
                            <p>
                                <span className="font-medium">근무지:</span> {job.jobPostWorkPlace}
                            </p>
                        </div>
                    </div>
                )
            ) : (
                <div className="text-gray-500">
                    현재 진행 중인 채용공고가 없습니다.
                </div>
            )
            }

            <Pagination totalItems={jobPosts.length}    // sql 에서 가져온 총 데이터 개수
                        itemsPerPage={itemsPerPage}     // 페이지 별로 보여줄 데이터 개수
                        currentPage={currentPage}       // 현재 페이지
                        setCurrentPage={setCurrentPage} // 사용자가 클릭하여 변경될 현재 페이지
            />
        </div>
    );
};

export default JobList;
