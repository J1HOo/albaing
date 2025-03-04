import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

const RegisterCompany = () => {
    const [companyName, setCompanyName] = useState("");
    const [companyRegistrationNumber, setCompanyRegistrationNumber] = useState("");
    const [companyOwnerName, setCompanyOwnerName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [companyPassword, setCompanyPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [companyPhone, setCompanyPhone] = useState("");
    const [companyLocalAddress, setCompanyLocalAddress] = useState("");
    const [companyLogo, setCompanyLogo] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");
    const [companyOpenDate, setCompanyOpenDate] = useState("");
    const [termsAgreement, setTermsAgreement] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

    const navigate = useNavigate();

    // 이메일 인증 코드 요청..
    const requestVerificationCode = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/sendCode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email: companyEmail}),
            });

            const data = await response.json();
            if (response.ok) {
                alert("인증번호가 이메일로 발송되었습니다.");
            } else {
                alert("인증번호 발송 실패: " + data.message);
            }
        } catch (error) {
            alert("인증번호 발송 중 오류가 발생했습니다.");
            console.error("인증번호 발송 오류:", error);
        }
    };

    // 인증번호 확인
    const verifyCode = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/checkCode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: companyEmail,
                    code: verificationCode,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setEmailVerified(true);
                alert("이메일 인증이 완료되었습니다.");
            } else {
                alert("인증번호 확인 실패: " + data.message);
            }
        } catch (error) {
            alert("인증번호 확인 중 오류가 발생했습니다.");
            console.error("인증번호 확인 오류:", error);
        }
    };

    // 입력값 검증
    const validateInputs = () => {
        if (!companyEmail) {
            alert("이메일을 입력해주세요.");
            return false;
        }

        if (!emailVerified) {
            alert("이메일 인증을 완료해주세요.");
            return false;
        }

        if (!companyPassword) {
            alert("비밀번호를 입력해주세요.");
            return false;
        }

        if (companyPassword !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return false;
        }

        if (!companyName) {
            alert("회사명을 입력해주세요.");
            return false;
        }

        if (!companyRegistrationNumber) {
            alert("사업자 등록번호를 입력해주세요.");
            return false;
        }

        if (!companyOwnerName) {
            alert("대표자 이름을 입력해주세요.");
            return false;
        }

        if (!companyPhone) {
            alert("전화번호를 입력해주세요.");
            return false;
        }

        if (!companyLocalAddress) {
            alert("회사 주소를 입력해주세요.");
            return false;
        }

        if (!termsAgreement) {
            alert("이용약관에 동의해주세요.");
            return false;
        }

        return true;
    };

    // 회원가입 처리
    const handleSignup = async () => {
        if (!validateInputs()) {
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/register/company", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    companyEmail,
                    companyPassword,
                    companyName,
                    companyRegistrationNumber,
                    companyOwnerName,
                    companyPhone,
                    companyLocalAddress,
                    companyLogo,
                    companyDescription,
                    companyOpenDate,
                    termsAgreement,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("회사 회원가입이 성공적으로 완료되었습니다.");
                navigate("/login");
            } else {
                alert("회원가입 실패: " + data.message);
                console.error("회원가입 실패:", data);
            }
        } catch (error) {
            alert("회원가입 중 오류가 발생했습니다.");
            console.error("회원가입 오류:", error);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md bg-white shadow-md rounded-lg">
            <h1 className="text-xl font-bold mb-4">회사 회원가입</h1>

            <div className="mb-4">
                <label className="block mb-1">이메일 *</label>
                <div className="flex">
                    <input
                        type="email"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        disabled={emailVerified}
                        className="flex-grow p-2 border rounded mr-2"
                        required
                    />
                    {!emailVerified && (
                        <button
                            onClick={requestVerificationCode}
                            className="bg-blue-500 text-white p-2 rounded"
                        >
                            인증번호 발송
                        </button>
                    )}
                </div>
            </div>

            {!emailVerified && companyEmail && (
                <div className="mb-4">
                    <label className="block mb-1">인증번호</label>
                    <div className="flex">
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="flex-grow p-2 border rounded mr-2"
                        />
                        <button
                            onClick={verifyCode}
                            className="bg-green-500 text-white p-2 rounded"
                        >
                            인증 확인
                        </button>
                    </div>
                </div>
            )}

            <div className="mb-4">
                <label className="block mb-1">회사명 *</label>
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1">사업자등록번호 *</label>
                <input type="text" value={companyRegistrationNumber}
                       onChange={(e) => setCompanyRegistrationNumber(e.target.value)}
                       className="w-full p-2 border rounded" required/>
            </div>

            <div className="mb-4">
                <label className="block mb-1">대표자명 *</label>
                <input type="text" value={companyOwnerName} onChange={(e) => setCompanyOwnerName(e.target.value)}
                       className="w-full p-2 border rounded" required/>
            </div>

            <div className="mb-4">
                <label className="block mb-1">비밀번호 *</label>
                <input
                    type="password"
                    value={companyPassword}
                    onChange={(e) => setCompanyPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1">비밀번호 확인 *</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1">전화번호 *</label>
                <input
                    type="tel"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1">회사 주소</label>
                <input type="text" value={companyLocalAddress} onChange={(e) => setCompanyLocalAddress(e.target.value)}
                       className="w-full p-2 border rounded"/>
            </div>

            <div className="mb-4">
                <label className="block mb-1">회사 개요</label>
                <textarea
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1">설립일</label>
                <input
                    type="date"
                    value={companyOpenDate}
                    onChange={(e) => setCompanyOpenDate(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="mb-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={termsAgreement}
                        onChange={(e) => setTermsAgreement(e.target.checked)}
                        className="mr-2"
                        required
                    />
                    <span>이용약관에 동의합니다 *</span>
                </label>
            </div>

            <button
                onClick={handleSignup}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
                가입하기
            </button>
        </div>
    );
};

export default RegisterCompany;
