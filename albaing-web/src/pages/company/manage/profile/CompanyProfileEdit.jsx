import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CompanyProfileEdit = () => {
    const navigate = useNavigate();
    const { companyId } = useParams();
    const [loading, setLoading] = useState(true);
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const [formData, setFormData] = useState({
        companyName: "",
        companyLogo: "",
        companyOwnerName: "",
        companyOpenDate: "",
        companyPhone: "",
        companyEmail: "",
        companyRegistrationNumber: "",
        companyLocalAddress: "",
        companyDescription: ""
    });

    useEffect(() => {
        axios.get(`/api/companies/${companyId}`)
            .then((res) => {
                setFormData({
                    companyName: res.data.companyName || "",
                    companyLogo: res.data.companyLogo || "",
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

    const editInfo = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        const companyData = {
            companyName: formData.companyName,
            companyOwnerName: formData.companyOwnerName,
            companyOpenDate: formData.companyOpenDate,
            companyPhone: formData.companyPhone,
            companyEmail: formData.companyEmail,
            companyRegistrationNumber: formData.companyRegistrationNumber,
            companyLocalAddress: formData.companyLocalAddress,
            companyDescription: formData.companyDescription,
            companyLogo: formData.companyLogo || ""
        };

        formDataToSend.append('company', new Blob([JSON.stringify(companyData)], {type: 'application/json'}));

        if (logo) {
            formDataToSend.append('companyLogo', logo);
        }

        fetch(`/api/companies/${companyId}`,  {
            method: 'PUT',
            body: formDataToSend
        })
            .then((res) => res.json())
            .then((data) => {
                alert('회사 정보가 성공적으로 수정되었습니다!');
                setFormData(data);
                navigate(-1);
            })
            .catch((error) => {
                alert(error.message || "회사의 정보를 수정하는 데 실패했습니다.");
            });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 파일 크기 제한 (예: 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("파일 크기는 5MB를 초과할 수 없습니다.");
                return;
            }

            // 파일 유형 제한
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert("지원되는 이미지 형식은 JPEG, PNG, GIF입니다.");
                return;
            }

            setLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-center">회사 정보 수정</h1>
            <form onSubmit={editInfo} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                            회사명 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.companyName || ""}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="companyOwnerName" className="block text-sm font-medium text-gray-700 mb-2">
                            대표자명
                        </label>
                        <input
                            type="text"
                            id="companyOwnerName"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.companyOwnerName || ""}
                            onChange={(e) => setFormData({...formData, companyOwnerName: e.target.value})}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="companyOpenDate" className="block text-sm font-medium text-gray-700 mb-2">
                            설립일
                        </label>
                        <input
                            type="date"
                            id="companyOpenDate"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.companyOpenDate || ""}
                            onChange={(e) => setFormData({...formData, companyOpenDate: e.target.value})}
                        />
                    </div>
                    <div>
                        <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                            연락처
                        </label>
                        <input
                            type="tel"
                            id="companyPhone"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.companyPhone || ""}
                            onChange={(e) => setFormData({...formData, companyPhone: e.target.value})}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-2">
                            이메일
                        </label>
                        <input
                            type="email"
                            id="companyEmail"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.companyEmail || ""}
                            onChange={(e) => setFormData({...formData, companyEmail: e.target.value})}
                        />
                    </div>
                    <div>
                        <label htmlFor="companyRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            사업자등록번호
                        </label>
                        <input
                            type="text"
                            id="companyRegistrationNumber"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.companyRegistrationNumber || ""}
                            onChange={(e) => setFormData({...formData, companyRegistrationNumber: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="companyLocalAddress" className="block text-sm font-medium text-gray-700 mb-2">
                        회사 주소
                    </label>
                    <input
                        type="text"
                        id="companyLocalAddress"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.companyLocalAddress || ""}
                        onChange={(e) => setFormData({...formData, companyLocalAddress: e.target.value})}
                    />
                </div>

                <div>
                    <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        회사 소개
                    </label>
                    <textarea
                        id="companyDescription"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.companyDescription || ""}
                        onChange={(e) => setFormData({...formData, companyDescription: e.target.value})}
                        rows="4"
                    />
                </div>

                <div>
                    <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700 mb-2">
                        회사 로고
                    </label>
                    <input
                        type="file"
                        id="companyLogo"
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleLogoChange}
                    />
                    <div className="mt-4 flex space-x-4">
                        {formData.companyLogo && (
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-medium mb-2">현재 로고</span>
                                <img
                                    src={formData.companyLogo}
                                    alt="Company Logo"
                                    className="w-32 h-32 object-cover rounded-md"
                                />
                            </div>
                        )}
                        {logoPreview && (
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-medium mb-2">새 로고 미리보기</span>
                                <img
                                    src={logoPreview}
                                    alt="Company Logo Preview"
                                    className="w-32 h-32 object-cover rounded-md"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        저장
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyProfileEdit;