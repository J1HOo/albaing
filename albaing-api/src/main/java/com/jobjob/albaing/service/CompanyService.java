package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;
import java.util.List;

public interface CompanyService {

    // 모든 회사 목록 조회
    List<Company> getAllCompanies();

    // 회사 상세 정보 불러오기
    Company companyDetail(long companyId);

    //회사 상세 정보 수정
    void updateDetail(Company company);

    // 회사 등록
    void registerCompany(Company company);

    // 회사명으로 검색
    List<Company> searchCompaniesByName(String keyword);
}