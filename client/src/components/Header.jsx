import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';

const Header = () => {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { theme } = useSelector(state => state.theme);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermUrl = urlParams.get('searchTerm');
        if (searchTermUrl) {
            setSearchTerm(searchTermUrl);
        }
    }, [location.search]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        navigate(`/search?${urlParams.toString()}`);
    };

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', { method: 'POST' });
            if (!res.ok) {
                console.log('Error signing out');
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Navbar className='border-b-2'>
            <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                    Noor's
                </span>
                Blog
            </Link>

            <form onSubmit={handleSubmit} className='hidden lg:block'>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            <Button className="w-10 h-10 lg:hidden border border-gray-500 text-gray-500 !bg-transparent rounded-full flex items-center justify-center hover:border-gray-600 transition-all" onClick={() => navigate(`/search`)}
            >
                <AiOutlineSearch className="text-lg" />
            </Button>

            <div className='flex gap-2 md:order-2'>
                <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={() => dispatch(toggleTheme())}>
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </Button>

                {currentUser ? (
                    <Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={currentUser.profilePhoto} rounded />}>
                        <Dropdown.Header>
                            <span className='block text-sm'>@{currentUser.username}</span>
                            <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                        </Dropdown.Header>

                        {currentUser.isAdmin && (
                            <Dropdown.Item>
                                <Link to='/dashboard?tab=dash'>Dashboard</Link>
                            </Dropdown.Item>
                        )}

                        <Dropdown.Item>
                            <Link to='/dashboard?tab=profile'>Profile</Link>
                        </Dropdown.Item>

                        <Dropdown.Divider />

                        <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to="/sign-in">
                        <Button gradientDuoTone='purpleToBlue' outline>
                            Sign In
                        </Button>
                    </Link>
                )}

                <Navbar.Toggle />
            </div>

            <Navbar.Collapse>
                <Navbar.Link active={path === "/"} as="div"><Link to="/">Home</Link></Navbar.Link>
                <Navbar.Link active={path === "/about"} as="div"><Link to="/about">About</Link></Navbar.Link>
                <Navbar.Link active={path === "/projects"} as="div"><Link to="/projects">Projects</Link></Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
