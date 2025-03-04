import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/react';
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import albaingLogo from '../assets/svg/albaing_logo.svg';

const categories = [
    {
        name: '채용정보',
        submenu: [
            { name: '전체 채용정보', href: '/jobpost/list' },
            { name: '지역별 채용정보', href: '/jobpost/list?type=area' },
            { name: '업종별 채용정보', href: '/jobpost/list?type=category' },
            { name: '신규 채용정보', href: '/jobpost/list?type=new' },
        ],
    },
    {
        name: '기업정보',
        submenu: [
            { name: '기업 검색', href: '/company' },
            { name: '기업 리뷰', href: '/company/review' },
        ],
    },
    {
        name: '인재정보',
        href: '/resume',
    },
    {
        name: '커뮤니티',
        href: '/community',
    },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState(null); // 'user' or 'company'
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = () => {
        setLoading(true);

        axios.get('/api/account/auth/checkLogin', { withCredentials: true })
            .then(response => {
                if (response.data) {
                    setIsLoggedIn(true);
                    // 유저 타입 확인 (회사인지 개인인지)
                    if (response.data.userId) {
                        setUserType('user');
                    } else if (response.data.companyId) {
                        setUserType('company');
                    }
                }
            })
            .catch(error => {
                console.error('Login check failed:', error);
                setIsLoggedIn(false);
                setUserType(null);

                // 인증이 필요한 페이지의 경우 로그인 페이지로 리디렉션 로직을 여기에 추가할 수 있습니다
                // 예: if (window.location.pathname.startsWith('/mypage')) navigate('/login');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleLogout = () => {
        axios.post('/api/account/auth/logout', {}, { withCredentials: true })
            .then(response => {
                setIsLoggedIn(false);
                setUserType(null);

                localStorage.removeItem('userInfo');
                sessionStorage.removeItem('userInfo');

                window.location.href = '/';
            })
            .catch(error => {
                console.error('Logout failed:', error);
                alert('로그아웃 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
            });
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 w-screen">
            <div className="max-w-[1200px] mx-auto">
                <nav aria-label="Global" className="flex items-center justify-between p-4">
                    <div className="flex lg:flex-1">
                        <Link to="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">알바잉</span>
                            <img
                                src={albaingLogo}
                                alt="알바잉 로고"
                                className="h-20 w-auto"
                            />
                        </Link>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">메뉴 열기</span>
                            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>

                    <PopoverGroup className="hidden lg:flex lg:gap-x-8">
                        {categories.map((category) => (
                            category.submenu ? (
                                <Popover className="relative" key={category.name}>
                                    <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-gray-900">
                                        {category.name}
                                        <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
                                    </PopoverButton>

                                    <PopoverPanel
                                        className="absolute top-full left-0 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5"
                                    >
                                        <div className="p-4">
                                            {category.submenu.map((item) => (
                                                <div
                                                    key={item.name}
                                                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm hover:bg-gray-50"
                                                >
                                                    <div className="flex-auto">
                                                        <Link to={item.href} className="block font-semibold text-gray-900">
                                                            {item.name}
                                                            <span className="absolute inset-0" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </PopoverPanel>
                                </Popover>
                            ) : (
                                <Link key={category.name} to={category.href} className="text-sm font-semibold text-gray-900">
                                    {category.name}
                                </Link>
                            )
                        ))}
                    </PopoverGroup>

                    {!loading && (
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
                            {isLoggedIn ? (
                                <>
                                    <Link to={userType === 'company' ? "/company/mypage" : "/mypage"} className="text-sm font-semibold text-gray-900">
                                        마이페이지
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm font-semibold text-gray-900"
                                    >
                                        로그아웃
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-sm font-semibold text-gray-900">
                                        로그인
                                    </Link>
                                    <span className="text-gray-300">|</span>
                                    <Link to="/register/person" className="text-sm font-semibold text-gray-900">
                                        회원가입
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </nav>
            </div>

            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">알바잉</span>
                            <img
                                src={albaingLogo}
                                alt="알바잉 로고"
                                className="h-16 w-auto"
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">메뉴 닫기</span>
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {categories.map((category) => (
                                    category.submenu ? (
                                        <Disclosure as="div" className="-mx-3" key={category.name}>
                                            <DisclosureButton className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold text-gray-900 hover:bg-gray-50">
                                                {category.name}
                                                <ChevronDownIcon className="h-5 w-5 flex-none" />
                                            </DisclosureButton>
                                            <DisclosurePanel className="mt-2 space-y-2">
                                                {category.submenu.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        to={item.href}
                                                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </DisclosurePanel>
                                        </Disclosure>
                                    ) : (
                                        <Link
                                            key={category.name}
                                            to={category.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {category.name}
                                        </Link>
                                    )
                                ))}
                            </div>

                            {!loading && (
                                <div className="py-6">
                                    {isLoggedIn ? (
                                        <>
                                            <Link
                                                to={userType === 'company' ? "/company/mypage" : "/mypage"}
                                                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                마이페이지
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setMobileMenuOpen(false);
                                                }}
                                                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 w-full text-left"
                                            >
                                                로그아웃
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                로그인
                                            </Link>
                                            <Link
                                                to="/register/person"
                                                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                회원가입
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
}