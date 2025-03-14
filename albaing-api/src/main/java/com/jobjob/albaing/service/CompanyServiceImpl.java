package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.mapper.CompanyMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyMapper companyMapper;

    // 모든 회사 목록 조회
    @Override
    public List<Company> getAllCompanies() {
        return companyMapper.getAllCompanies();
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
}