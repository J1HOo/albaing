package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.Company;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import java.util.Map;


@Mapper
public interface CompanyMapper {

    // 회사 회원가입 (INSERT)
    void registerCompany(Company company);

    // 회사 로그인
    Company loginCompany(Map<String, Object> param);

    // 회사 존재여부 확인
    boolean isCompanyExist(String email);

    // 회사 전화번호 존재여부 확인
    boolean isCompanyPhoneExist(String companyPhone);

    // 회사 이메일 찾기
    Company findCompanyEmail(String companyName, String companyPhone);

    // 비밀번호 재설정 (암호화된 비밀번호 저장)
    void updateCompanyPassword(@Param("companyEmail") String companyEmail,
                            @Param("companyPhone") String companyPhone,
                            @Param("encodedPassword") String encodedPassword);

    // 회사 상세 정보 불러오기
    Company companyDetail(long companyId);
  

}
