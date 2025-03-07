package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.Company;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;


@Mapper
public interface CompanyMapper {

    // 회사 회원가입 (INSERT)
    void registerCompany(Company company);

    // 회사 로그인
    Company loginCompany(Map<String, Object> param);

    // 회사 상세 정보 불러오기
    Company companyDetail(long companyId);
  

}
