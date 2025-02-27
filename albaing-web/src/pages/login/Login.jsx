import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [tab, setTab] = useState("user"); // "user" 또는 "company"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // 에러 초기화

        try {
            // 선택된 탭에 따라 다른 엔드포인트로 요청
            const endpoint = tab === "user"
                ? "/api/account/auth/login-person"
                : "/api/account/auth/login-company";

            // 요청 본문 준비 (서버 모델에 맞춰 필드명 변경)
            const requestBody = tab === "user"
                ? { userEmail: email, userPassword: password }
                : { companyEmail: email, companyPassword: password };

            console.log("요청 엔드포인트:", endpoint);
            console.log("요청 본문:", requestBody);

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
                credentials: "include",
            });

            console.log("응답 상태:", response.status);

            const responseText = await response.text();
            console.log("응답 데이터:", responseText);

            const responseData = responseText ? JSON.parse(responseText) : {};

            if (!response.ok) {
                throw new Error(responseData.message || "로그인 실패. 이메일 또는 비밀번호를 확인하세요.");
            }

            console.log("로그인 성공:", responseData);

            // 로그인 성공 후, 역할에 맞는 대시보드로 이동
            if (tab === "company") {
                navigate("/company/dashboard");
            } else {
                navigate("/user/dashboard");
            }
        } catch (err) {
            console.error("로그인 오류:", err);
            setError(err.message); // 발생한 에러 메시지 출력
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                {/* 탭 버튼 */}
                <div className="flex mb-4">
                    <button
                        className={`flex-1 py-2 text-center rounded-t-lg ${
                            tab === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                        onClick={() => setTab("user")}
                    >
                        개인 로그인
                    </button>
                    <button
                        className={`flex-1 py-2 text-center rounded-t-lg ${
                            tab === "company" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                        onClick={() => setTab("company")}
                    >
                        기업 로그인
                    </button>
                </div>

                {/* 로그인 폼 */}
                <form onSubmit={handleLogin} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
}