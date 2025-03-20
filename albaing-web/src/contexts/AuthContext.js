import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = () => {
        const storedUser = localStorage.getItem('authUser');

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // 임시로 상태 설정
                setUser(parsedUser);
            } catch (e) {
                localStorage.removeItem('authUser');
            }
        }

        return axios.get('/api/auth/checkLogin', { withCredentials: true })
            .then(response => {
                if (response.status === 200 && response.data) {
                    let userData;
                    if (response.data.userId) {
                        const isAdmin = response.data.userIsAdmin === true;
                        userData = {
                            type: isAdmin ? 'admin' : 'personal',
                            data: response.data
                        };
                    } else if (response.data.companyId) {
                        userData = { type: 'company', data: response.data };
                    }

                    if (userData) {
                        localStorage.setItem('authUser', JSON.stringify(userData));
                        setUser(userData);
                        setLoading(false);
                        return userData;
                    }
                }

                // 서버에서 인증되지 않았으면 로컬 스토리지도 정리
                localStorage.removeItem('authUser');
                setUser(null);
                setLoading(false);
                return null;
            })
            .catch(error => {
                // 오류 발생 시 (401 등) 로컬 스토리지 정리
                localStorage.removeItem('authUser');
                setUser(null);
                setLoading(false);
                return null;
            });
    };

    const login = (credentials, userType) => {
        const endpoint = userType === 'personal'
            ? '/api/auth/login/person'
            : '/api/auth/login/company';

        return axios.post(endpoint, credentials, { withCredentials: true })
            .then(res => {
                if (res.data && res.data.status === "success") {
                    const userData = {
                        type: userType,
                        data: userType === 'personal' ? res.data.user : res.data.company
                    };

                    localStorage.setItem('authUser', JSON.stringify(userData));
                    setUser(userData);

                    return { success: true, data: res.data };
                }

                return { success: false, message: res.data?.message || '로그인에 실패했습니다' };
            })
            .catch(error => {
                return {
                    success: false,
                    message: error.response?.data?.message || '로그인 중 오류가 발생했습니다'
                };
            });
    };

    const logout = () => {
        return axios.post('/api/auth/logout', {}, { withCredentials: true })
            .then(() => {
                // 로컬 스토리지와 상태 모두 정리
                localStorage.removeItem('authUser');
                setUser(null);

                return { success: true, message: '로그아웃되었습니다.' };
            })
            .catch(error => {
                console.error('로그아웃 오류:', error);

                // 오류가 발생해도 클라이언트 측 상태는 정리
                localStorage.removeItem('authUser');
                setUser(null);

                return { success: false, message: '로그아웃 처리 중 오류가 발생했습니다.' };
            });
    };

    useEffect(() => {
        // 로컬 스토리지에서 임시로 상태 설정
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser); // 임시 설정
            } catch (e) {
                localStorage.removeItem('authUser');
            }
        }

        // 실제 서버 세션 상태 확인 (비동기)
        checkAuth()
            .then(actualUser => {
                // 서버 세션 상태와 로컬 스토리지 상태가 다르면 로컬 스토리지에 업데이트
                const currentStoredUser = localStorage.getItem('authUser');
                if (JSON.stringify(actualUser) !== currentStoredUser) {
                    if (actualUser) {
                        localStorage.setItem('authUser', JSON.stringify(actualUser));
                    } else {
                        localStorage.removeItem('authUser');
                    }
                }
            })
            .catch(() => {
                // 오류 발생 시 로컬 스토리지 정리
                localStorage.removeItem('authUser');
                setUser(null);
            });
    }, []);

    const contextValue = {
        user,
        isLoggedIn: !!user,
        userType: user?.type || null,
        userData: user?.data || null,
        loading,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};