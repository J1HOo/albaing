package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.mapper.CompanyMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyMapper companyMapper;

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

    @Override
    public void updateApprovalStatus(long companyId, String status) {
        Company company = companyMapper.companyDetail(companyId);
        if (company != null) {
            try {
                company.setCompanyApprovalStatus(Company.ApprovalStatus.valueOf(status));
                company.setCompanyUpdatedAt(LocalDateTime.now());
                companyMapper.updateApprovalStatus(companyId, status);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("유효하지 않은 상태 값입니다: " + status, e);
            }
        } else {
            throw new RuntimeException("기업 정보를 찾을 수 없습니다: " + companyId);
        }
    }
}