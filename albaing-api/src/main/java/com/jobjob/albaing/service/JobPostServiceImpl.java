package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.mapper.JobPostMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JobPostServiceImpl implements JobPostService {

    @Autowired
    private JobPostMapper jobPostMapper;

    @Override
    public JobPost createJobPost(JobPost jobPost) {
        // 기본값 설정
        jobPost.setJobPostStatus(true);  // 기본적으로 활성화

        // 데이터베이스에 삽입
        jobPostMapper.insertJobPost(jobPost);

        // 새로 생성된 ID로 공고 반환
        return jobPost;
    }

    @Override
    public JobPost getJobPost(long companyId, long jobPostId) {
        JobPost jobPost = jobPostMapper.selectJobPostById(jobPostId);

        // 기업 소유 여부 체크 (다른 회사 공고 조회 방지)
        if (jobPost == null || jobPost.getCompanyId() != companyId) {
            throw new RuntimeException("본인의 공고만 조회할 수 있습니다.");
        }

        return jobPost;
    }

    @Override
    public List<JobPost> getJobPostList(long companyId, String jobCategory, String jobType,
                                        String keyword, int page, int size, boolean onlyActive) {
        Map<String, Object> params = new HashMap<>();
        params.put("companyId", companyId);  // 기업 ID 필터 추가
        params.put("jobCategory", jobCategory);
        params.put("jobType", jobType);
        params.put("keyword", keyword);
        params.put("offset", (page - 1) * size);
        params.put("limit", size);
        params.put("onlyActive", onlyActive);

        return jobPostMapper.selectJobPostList(params);
    }

    @Override
    public JobPost updateJobPost(long companyId, JobPost jobPost) {
        JobPost existingPost = jobPostMapper.selectJobPostById(jobPost.getJobPostId());

        // 기업 소유 여부 체크 (다른 회사 공고 수정 방지)
        if (existingPost == null || existingPost.getCompanyId() != companyId) {
            throw new RuntimeException("본인의 공고만 수정할 수 있습니다.");
        }

        jobPostMapper.updateJobPost(jobPost);
        return jobPost;
    }

    @Override
    public void updateJobPostStatus(long companyId, long jobPostId, boolean status) {
        JobPost jobPost = jobPostMapper.selectJobPostById(jobPostId);

        // 기업 소유 여부 체크 (다른 회사 공고 수정 방지)
        if (jobPost == null || jobPost.getCompanyId() != companyId) {
            throw new RuntimeException("본인의 공고만 수정할 수 있습니다.");
        }

        jobPostMapper.updateJobPostStatus(jobPostId, status);
    }

    @Override
    public int getTotalCount(long companyId, String jobCategory, String jobType, String keyword, boolean onlyActive) {
        Map<String, Object> params = new HashMap<>();
        params.put("companyId", companyId);
        params.put("jobCategory", jobCategory);
        params.put("jobType", jobType);
        params.put("keyword", keyword);
        params.put("onlyActive", onlyActive);

        return jobPostMapper.countJobPost(params);
    }
}