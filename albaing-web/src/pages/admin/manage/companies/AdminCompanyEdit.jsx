import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, ErrorMessage } from '../../../../components';
import AdminLayout from '../../AdminLayout';

const AdminCompanyEdit = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        companyOwnerName: '',
        companyEmail: '',
        companyPhone: '',
        companyRegistrationNumber: '',
        companyOpenDate: '',
        companyLocalAddress: '',
        companyDescription: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');

    useEffect(() => {
        fetchCompanyDetail();
    }, [companyId]);

    const fetchCompanyDetail = () => {
        setLoading(true);
        axios.get(`/api/admin/companies/${companyId}`)
            .then(response => {
                const companyData = response.data;
                setCompany(companyData);

                // 날짜 형식 변환
                let formattedOpenDate = '';
                if (companyData.companyOpenDate) {
                    try {
                        const date = new Date(companyData.companyOpenDate);
                        formattedOpenDate = date.toISOString().split('T')[0];
                    } catch (error) {
                        formattedOpenDate = '';
                    }
                }

                setFormData({
                    companyName: companyData.companyName || '',
                    companyOwnerName: companyData.companyOwnerName || '',
                    companyEmail: companyData.companyEmail || '',
                    companyPhone: companyData.companyPhone || '',
                    companyRegistrationNumber: companyData.companyRegistrationNumber || '',
                    companyOpenDate: formattedOpenDate,
                    companyLocalAddress: companyData.companyLocalAddress || '',
                    companyDescription: companyData.companyDescription || ''
                });

                setLogoPreview(companyData.companyLogo || '');
                setLoading(false);
            })
            .catch(error => {
                setError('기업 정보를 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const formPayload = new FormData();

        if (logoFile) {
            formPayload.append('companyLogo', logoFile, logoFile.name);
        }

        const companyData = {
            ...company,
            ...formData,
            companyId: parseInt(companyId, 10),
            companyUpdatedAt: new Date()
        };

        formPayload.append('company', new Blob([JSON.stringify(companyData)], {
            type: 'application/json'
        }));

        axios.put(`/api/companies/${companyId}`, formPayload, {
            headers: {
                'Content-Type': undefined
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    navigate(`/admin/companies/${companyId}`);
                }
            })
            .catch((error) => {
                console.error("회사 정보 업데이트 오류:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    return (
        <AdminLayout>
            {loading ? (
                <LoadingSpinner message="기업 정보를 불러오는 중..." />
            ) : error ? (
                <ErrorMessage message={error} />
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">기업 정보 수정</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">회사 로고</label>
                                    <div className="flex items-center space-x-6">
                                        <div className="w-24 h-24 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Company Logo Preview" className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-gray-400">No Logo</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF 최대 5MB</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">회사명 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="companyOwnerName" className="block text-sm font-medium text-gray-700 mb-2">대표자명 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="companyOwnerName"
                                        name="companyOwnerName"
                                        value={formData.companyOwnerName}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-2">이메일 <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        id="companyEmail"
                                        name="companyEmail"
                                        value={formData.companyEmail}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                                    <input
                                        type="text"
                                        id="companyPhone"
                                        name="companyPhone"
                                        value={formData.companyPhone}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="companyRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-2">사업자등록번호 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="companyRegistrationNumber"
                                        name="companyRegistrationNumber"
                                        value={formData.companyRegistrationNumber}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="companyOpenDate" className="block text-sm font-medium text-gray-700 mb-2">개업일</label>
                                    <input
                                        type="date"
                                        id="companyOpenDate"
                                        name="companyOpenDate"
                                        value={formData.companyOpenDate}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="companyLocalAddress" className="block text-sm font-medium text-gray-700 mb-2">지역</label>
                                    <input
                                        type="text"
                                        id="companyLocalAddress"
                                        name="companyLocalAddress"
                                        value={formData.companyLocalAddress}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-2">회사 소개</label>
                                    <textarea
                                        id="companyDescription"
                                        name="companyDescription"
                                        value={formData.companyDescription}
                                        onChange={handleChange}
                                        rows={5}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <Link
                                    to={`/admin/companies/${companyId}`}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    취소
                                </Link>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    {loading ? '저장 중...' : '저장'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCompanyEdit;