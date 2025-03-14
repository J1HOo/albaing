import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CompanyProfileEdit = () => {
    const navigate = useNavigate();
    const { companyId } = useParams();
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        companyName: "",
        companyOwnerName: "",
        companyOpenDate: "",
        companyPhone: "",
        companyEmail: "",
        companyRegistrationNumber: "",
        companyLocalAddress: "",
        companyDescription: ""
    });

    // 회사 정보 불러오기
    useEffect(() => {
        axios.get(`/api/companies/${companyId}`)
            .then((res) => {
                // 값이 없을 때 빈 문자열로 설정
                setFormData({
                    companyName: res.data.companyName || "",
                    companyOwnerName: res.data.companyOwnerName || "",
                    companyOpenDate: res.data.companyOpenDate || "",
                    companyPhone: res.data.companyPhone || "",
                    companyEmail: res.data.companyEmail || "",
                    companyRegistrationNumber: res.data.companyRegistrationNumber || "",
                    companyLocalAddress: res.data.companyLocalAddress || "",
                    companyDescription: res.data.companyDescription || ""
                });
                setLoading(false);
            })
            .catch(() => {
                alert("회사의 정보를 불러오는 데 실패했습니다.");
                setLoading(false);
            });
    }, [companyId]);

    // 폼 제출 처리
    const editInfo = (e) => {
        e.preventDefault();
        console.log('수정된 데이터:', formData);  // 실제 전송되는 데이터 확인

        axios.put(`/api/companies/${companyId}`, formData, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => {
                console.log('서버 응답 데이터:', res.data);  // 서버에서 반환된 데이터 확인
                alert('회사 정보가 성공적으로 수정되었습니다!');
                setFormData(res.data);
                navigate(-1);
            })
            .catch((error) => {
                console.error('네트워크 오류:', error);
                alert("네트워크 오류가 발생했습니다.");
            });
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <div>
            <h1>회사 정보 수정</h1>
            <form onSubmit={editInfo}>
                <div>
                    <label htmlFor="companyName">회사명</label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName || ""}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="companyOwnerName">대표자명</label>
                    <input
                        type="text"
                        id="companyOwnerName"
                        value={formData.companyOwnerName || ""}
                        onChange={(e) => setFormData({ ...formData, companyOwnerName: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="companyOpenDate">설립일</label>
                    <input
                        type="date"
                        id="companyOpenDate"
                        value={formData.companyOpenDate || ""}
                        onChange={(e) => setFormData({ ...formData, companyOpenDate: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="companyPhone">연락처</label>
                    <input
                        type="tel"
                        id="companyPhone"
                        value={formData.companyPhone || ""}
                        onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="companyEmail">이메일</label>
                    <input
                        type="email"
                        id="companyEmail"
                        value={formData.companyEmail || ""}
                        onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="companyRegistrationNumber">사업자등록번호</label>
                    <input
                        type="text"
                        id="companyRegistrationNumber"
                        value={formData.companyRegistrationNumber || ""}
                        onChange={(e) => setFormData({ ...formData, companyRegistrationNumber: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="companyLocalAddress">회사 주소</label>
                    <input
                        type="text"
                        id="companyLocalAddress"
                        value={formData.companyLocalAddress || ""}
                        onChange={(e) => setFormData({ ...formData, companyLocalAddress: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="companyDescription">회사 소개</label>
                    <textarea
                        id="companyDescription"
                        value={formData.companyDescription || ""}
                        onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                        rows="4"
                    />
                </div>
                <div>
                    <button type="submit">저장</button>
                </div>
            </form>
        </div>
    );
};

export default CompanyProfileEdit;
