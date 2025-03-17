import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BusinessValidation = () => {
    const [companyRegistrationNumber, setCompanyRegistrationNumber] = useState('');
    const [companyOwnerName, setCompanyOwnerName] = useState('');
    const [companyOpenDate, setCompanyOpenDate] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // 사업자 등록번호 인증 커밋다시하기
    const validateBusinessNumber = (callback) => {
        const data = {
            "businesses": [
                {
                    "b_no": companyRegistrationNumber,
                    "start_dt": companyOpenDate,
                    "p_nm": companyOwnerName
                }
            ]
        };


        axios.post(
            "https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=0rsV2ZpVVbhRdzdow1XYlJ90OFql0qQm1sn7RnDySfIL6euWd5uVi7XFviZDtCZGB2iykgpDi%2BtccmdqSNmY8g%3D%3D",
            data,
            { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
        )
            .then(response => {
                console.log(response.data.data[0]);
                const valid = response.data.data[0]['valid'];

                if (valid === '01') {
                    setMessage("사업자 회원가입이 가능합니다.");
                    callback(true);
                } else {
                    setMessage("사업자 정보가 일치하지 않거나 회원가입이 불가능합니다.");
                    callback(false);
                }
            })
            .catch(error => {
                console.error(error.response ? error.response.data : error.message);
                setMessage("에러가 발생했습니다.");
                callback(false);
            });


    };

    // 가입하기
    const businessRegistration = () => {
        validateBusinessNumber((isValid) => {
            if (isValid) {
                alert("사업자 인증에 성공했습니다.");

                // 로컬 스토리지에 저장 (값이 올바르게 저장되는지 콘솔로 확인)
                console.log("저장되는 값:", { companyRegistrationNumber, companyOwnerName, companyOpenDate });

                // 로컬 스토리지에 저장
                localStorage.setItem("companyRegistrationNumber", companyRegistrationNumber);
                localStorage.setItem("companyOwnerName", companyOwnerName);
                localStorage.setItem("companyOpenDate", companyOpenDate);

                navigate('/register/company'); // RegisterCompany로 이동
            } else {
                alert("사업자 정보가 일치하지 않습니다. 다시 확인해주세요.");
            }
        });
    };

    return (
        <div>
            <h2>사업자 번호 인증</h2>
            <div>
                <input
                    type="text"
                    value={companyRegistrationNumber}
                    onChange={(e) => setCompanyRegistrationNumber(e.target.value)}
                    placeholder="사업자 번호를 입력하세요 (숫자만 입력)"
                />
                <input
                    type="text"
                    value={companyOpenDate}
                    onChange={(e) => setCompanyOpenDate(e.target.value)}
                    placeholder="개업일을 입력하세요 (YYYYMMDD)"
                />
                <input
                    type="text"
                    value={companyOwnerName}
                    onChange={(e) => setCompanyOwnerName(e.target.value)}
                    placeholder="대표자 이름을 입력하세요"
                />
                <button onClick={() => validateBusinessNumber(() => {})}>인증 확인</button>
            </div>
            {message && <div><br/>{message}</div>}
            <div>
                <button onClick={businessRegistration}>다음으로</button>
            </div>
        </div>
    );
};

export default BusinessValidation;