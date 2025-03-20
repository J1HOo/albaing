package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface CompanyService {

    // 모든 회사 목록 조회 (승인된 회사)
    List<Company> getAllCompanies();

    // 승인 대기 중인 회사 목록 조회
    List<Company> getPendingCompanies();

    // 회사 상세 정보 불러오기
    Company companyDetail(long companyId);

    // 회사 상세 정보 수정
    void updateDetail(Company company);

    // 회사 등록
    void registerCompany(Company company);

    // 회사명으로 검색
    List<Company> searchCompaniesByName(String keyword);

    // 로고 이미지 업로드 및 업데이트
    String uploadLogoImage(MultipartFile logoImage);
}