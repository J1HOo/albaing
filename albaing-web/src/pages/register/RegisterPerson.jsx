import {useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import axios from "axios";

const RegisterPerson = () => {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userBirthdate, setUserBirthdate] = useState("");
    const [userGender, setUserGender] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [userProfileImage, setUserProfileImage] = useState("");
    const [userTermsAgreement, setUserTermsAgreement] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const nameParam = params.get("name");
        const nicknameParam = params.get("nickname");
        const email = params.get("email");
        const profileImageParam = params.get("profileImage");
        console.log("nickname" ,nicknameParam );
        console.log("email " ,email   );
        console.log("profileImageParam " ,profileImageParam  );
        setUserName(decodeURIComponent(nameParam || nicknameParam || ""));
        setUserEmail(decodeURIComponent(email || ""));
        setUserProfileImage(decodeURIComponent(profileImageParam || ""));

        console.log("카카오 로그인으로 전달된 이메일:", email);

        if (email) {
            console.log("카카오 로그인 사용자 → 이메일 인증 자동 완료");
            setEmailVerified(true);
        }
    }, []);


    /*
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const nameParam = params.get("name");
        const nicknameParam = params.get("nickname");
        const email = params.get("email");

        setUserName(decodeURIComponent(nameParam || nicknameParam || ""));
        setUserEmail(decodeURIComponent(email || ""));
        console.log(userEmail);

        const birthdayParam = params.get("birthday");
        if (birthdayParam) {
            if (birthdayParam.length === 5) {
                const currentYear = new Date().getFullYear();
                setUserBirthdate(`${currentYear}-${birthdayParam.replace("-", "-")}`);
            } else {
                setUserBirthdate(birthdayParam);
            }
        }

        const genderParam = params.get("gender");
        if (genderParam) {
            setUserGender(genderParam === "M" ? "male" : genderParam === "F" ? "female" : genderParam);
        }

        const profileImageParam = params.get("profileImage") || params.get("profileImg");
        if (profileImageParam) {
            setUserProfileImage(decodeURIComponent(profileImageParam));
        }

        console.log("params.get(\"email\") : " ,params.get("email"));
        //   if (userEmail === params.get("email")) {  // 수정하니 이메일 인풋창과 인증하기 버튼 활성화됨
        if (params.get("email")) {
            // 단순히  params.get("email") 만 있으면 인증상태로 만들시 에러발생
            // userEmail === params.get("email") 비교시 거짓이므로 setEmailVerified(true); 안됨
            // userEmail 이 null 이거나 params.get("email") 과 다르다
            setEmailVerified(true);
        }



    }, []);
*/
    const requestVerificationCode = () => {
        if (!userEmail) {
            setError("이메일을 입력해주세요.");
            return;
        }

        setLoading(true);
        setError("");

        axios
            .post("/api/auth/sendCode", {
                email: userEmail
            })
            .then(response => {
                alert("인증번호가 이메일로 발송되었습니다.");
            })
            .catch(error => {
                setError(`인증번호 발송 실패: ${error.response?.data?.message || "알 수 없는 오류가 발생했습니다."}`); // 현재 뜨는 에러창
                console.log("axios.catch: ", userEmail)
                console.error("인증번호 발송 오류:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const verifyCode = () => {
        if (!verificationCode) {
            setError("인증번호를 입력해주세요.");
            return;
        }

        setLoading(true);
        setError("");

        axios
            .post("/api/auth/checkCode", {
                email: userEmail,
                code: verificationCode
            })
            .then(response => {
                setEmailVerified(true);
                alert("이메일 인증이 완료되었습니다.");
            })
            .catch(error => {
                setError(`인증번호 확인 실패: ${error.response?.data?.message || "알 수 없는 오류가 발생했습니다."}`);
                console.error("인증번호 확인 오류:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const validateInputs = () => {
        if (!userEmail) {
            setError("이메일을 입력해주세요.");
            return false;
        }

        if (!emailVerified) {
            setError("이메일 인증을 완료해주세요.");
            return false;
        }

        if (!userPassword) {
            setError("비밀번호를 입력해주세요.");
            return false;
        }

        if (userPassword.length < 8) {
            setError("비밀번호는 최소 8자 이상이어야 합니다.");
            return false;
        }

        if (!/[0-9]/.test(userPassword) || !/[!@#$%^&*]/.test(userPassword)) {
            setError("비밀번호는 숫자와 특수문자를 포함해야 합니다.");
            return false;
        }

        if (userPassword !== confirmPassword) {
            setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return false;
        }

        if (!userName) {
            setError("이름을 입력해주세요.");
            return false;
        }

        if (!userPhone) {
            setError("전화번호를 입력해주세요.");
            return false;
        }

        if (!userTermsAgreement) {
            setError("이용약관에 동의해주세요.");
            return false;
        }

        return true;
    };

    const handleSignup = () => {
        if (!validateInputs()) {
            setError("!validateInputs 인풋창을 모두 입력하세요");
            return;
        }

        if (!emailVerified) {
            setError("이메일 인증 확인 실패");
        }
        setLoading(true);
        setError("");

        axios
            .post("/api/auth/register/person", {
                userEmail,
                userPassword,
                userName,
                userBirthdate: userBirthdate ? new Date(userBirthdate) : null,
                userGender,
                userPhone,
                userAddress,
                userProfileImage,
                userTermsAgreement,
                emailVerified
                // emailVerified:true // 위에서 false 를 기본값으로 설정하고, 카카오 인증이 될 경우 true 로 변경되지않음
            })
            .then(response => {
                alert("회원가입이 성공적으로 완료되었습니다.");
                navigate("/login");
            })
            .catch(error => {
                setError(`회원가입 실패: ${error.response?.data?.message || "알 수 없는 오류가 발생했습니다."}`); // 현재 뜨는 에러창
                console.error("회원가입 실패:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900">개인 회원가입</h1>
                <p className="mt-2 text-gray-600">알바잉에 가입하고 다양한 일자리를 찾아보세요.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    <p className="font-medium">오류</p>
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <div className="space-y-6">
                    {/* 이메일 인증 섹션 */}
                    <div className="border-b border-gray-200 pb-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">계정 정보</h2>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                이메일 <span className="text-red-500">*</span>
                            </label>
                            <div className="flex">
                                <input
                                    type="email"
                                    id="email"
                                    value={userEmail} // userEmail 값이 자동으로 입력된다
                                    onChange={(e) => setUserEmail(e.target.value || userEmail)}
                                    disabled={emailVerified || loading}
                                    className={`flex-grow p-2 border rounded-l-md ${emailVerified ? 'bg-gray-100' : ''}`}
                                    placeholder="example@email.com"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={requestVerificationCode}
                                    disabled={emailVerified || loading || !userEmail}
                                    className="py-2 px-4 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {loading ? '처리 중...' : emailVerified ? '인증 완료' : '인증번호 발송'}
                                </button>
                            </div>
                        </div>

                        {!emailVerified && userEmail && (
                            <div className="mb-4">
                                <label htmlFor="verificationCode"
                                       className="block text-sm font-medium text-gray-700 mb-1">
                                    인증번호 <span className="text-red-500">*</span>
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        id="verificationCode"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        disabled={loading}
                                        className="flex-grow p-2 border rounded-l-md"
                                        placeholder="인증번호 6자리"
                                    />
                                    <button
                                        type="button"
                                        onClick={verifyCode}
                                        disabled={loading || !verificationCode}
                                        className="py-2 px-4 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {loading ? '확인 중...' : '인증 확인'}
                                    </button>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    이메일로 전송된 6자리 인증번호를 입력하세요.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6 mt-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    비밀번호 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={userPassword}
                                    onChange={(e) => setUserPassword(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="최소 8자, 숫자와 특수문자 포함"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    비밀번호는 최소 8자 이상, 숫자와 특수문자를 포함해야 합니다.
                                </p>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword"
                                       className="block text-sm font-medium text-gray-700 mb-1">
                                    비밀번호 확인 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="비밀번호 재입력"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* 기본 정보 섹션 */}
                    <div className="border-b border-gray-200 pb-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    이름 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="이름을 입력하세요"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    전화번호 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={userPhone}
                                    onChange={(e) => setUserPhone(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="예: 010-1234-5678"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                                    생년월일
                                </label>
                                <input
                                    type="date"
                                    id="birthdate"
                                    value={userBirthdate}
                                    onChange={(e) => setUserBirthdate(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>

                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                    성별
                                </label>
                                <select
                                    id="gender"
                                    value={userGender}
                                    onChange={(e) => setUserGender(e.target.value)}
                                    className="w-full p-2 border rounded-md bg-white"
                                >
                                    <option value="">선택</option>
                                    <option value="male">남성</option>
                                    <option value="female">여성</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    주소
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    value={userAddress}
                                    onChange={(e) => setUserAddress(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="주소를 입력하세요"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 프로필 이미지 섹션 */}
                    <div className="border-b border-gray-200 pb-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">프로필 이미지</h2>

                        <div className="flex items-center space-x-6">
                            <div className="shrink-0">
                                {userProfileImage ? (
                                    <img
                                        src={userProfileImage}
                                        alt="프로필 미리보기"
                                        className="h-24 w-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    프로필 사진 업로드
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setUserProfileImage(URL.createObjectURL(e.target.files[0]));
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                />
                                <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF 파일 (최대 2MB)</p>
                            </div>
                        </div>
                    </div>

                    {/* 이용약관 동의 */}
                    <div>
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={userTermsAgreement}
                                    onChange={(e) => setUserTermsAgreement(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="font-medium text-gray-700">
                                    이용약관에 동의합니다 <span className="text-red-500">*</span>
                                </label>
                                <p className="text-gray-500">
                                    <Link to="/company/terms" className="text-blue-600 hover:text-blue-500"
                                          target="_blank">
                                        이용약관
                                    </Link>과{' '}
                                    <Link to="/company/privacy" className="text-blue-600 hover:text-blue-500"
                                          target="_blank">
                                        개인정보처리방침
                                    </Link>에 동의합니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 가입하기 버튼 */}
                    <div>
                        <button
                            type="button"
                            onClick={handleSignup}
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {loading ? '처리 중...' : '가입하기'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <p className="text-gray-600">
                    이미 계정이 있으신가요?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        로그인
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPerson;