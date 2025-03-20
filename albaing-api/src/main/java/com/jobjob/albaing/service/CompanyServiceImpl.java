package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.mapper.CompanyMapper;
import com.jobjob.albaing.mapper.JobPostMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyMapper companyMapper;

    @Autowired
    private JobPostMapper jobPostMapper;

    @Autowired
    private FileService fileService;

    // 모든 회사 목록 조회 (승인된 회사)
    @Override
    public List<Company> getAllCompanies() {
        return companyMapper.getAllCompanies();
    }

    // 승인 대기 중인 회사 목록 조회
    @Override
    public List<Company> getPendingCompanies() {
        return companyMapper.getPendingCompanies();
    }

    // 회사 상세 정보 불러오기
    @Override
    public Company companyDetail(long companyId) {
        return companyMapper.companyDetail(companyId);
    }

    // 회사 상세 정보 수정
    @Override
    public void updateDetail(Company company) {
        companyMapper.updateDetail(company);
    }

    // 회사 등록
    @Override
    public void registerCompany(Company company) {
        companyMapper.registerCompany(company);
    }

    // 회사 승인 상태 업데이트
    @Override
    @Transactional
    public boolean updateApprovalStatus(long companyId, String approvalStatus) {
        try {
            companyMapper.updateApprovalStatus(companyId, approvalStatus);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 회사 삭제
    @Override
    @Transactional
    public boolean deleteCompany(long companyId) {
        try {
            // 회사에 속한 공고도 먼저 삭제 또는 상태 변경
            List<Long> jobPostIds = jobPostMapper.getJobPostIdsByCompanyId(companyId);
            for (Long jobPostId : jobPostIds) {
                jobPostMapper.deleteJobPostById(jobPostId);
            }

            // 회사 삭제
            companyMapper.deleteCompanyById(companyId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 회사명으로 검색
    @Override
    public List<Company> searchCompaniesByName(String keyword) {
        return companyMapper.searchCompaniesByName(keyword);
    }

    // 로고 이미지 업로드 및 업데이트
    @Override
    public String uploadLogoImage(MultipartFile logoImage) {
        if (logoImage == null || logoImage.isEmpty()) {
            return null;
        }

        try {
            return fileService.uploadFile(logoImage);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}