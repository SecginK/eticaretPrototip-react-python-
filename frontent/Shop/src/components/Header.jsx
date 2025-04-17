import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../css/Header.css';

function Header() {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleUserMenu = () => {
        setShowUserMenu((prev) => !prev);
    };

    return (
        <div className='header d-flex justify-content-between align-items-center'>
            <div className='parca1'>Shop</div>

            <div className='sayfa d-flex justify-content-center align-items-center'>
                <div className='navbuton'><Link className='link' to="/Anasayfa">Anasayfa</Link></div>
                <div className='navbuton'><Link className='link' to="/sepetim">Sepetim</Link></div>
                <div className='navbuton'><Link className='link' to="/siparislerim">Siparişlerim</Link></div>
                <div className='navbuton'><Link className='link' to="/adreslerim">Adreslerim</Link></div>
            </div>


            <div className='user-menu'>
                {user ? (
                    <>
                        <button
                            className='btn btn-outline-secondary'
                            onClick={toggleUserMenu}
                        >
                            {user.ad} {user.soyad}
                        </button>


                        {showUserMenu && (
                            <div className='user-dropdown'>
                                <p>Hoş geldiniz, {user.ad}!</p>
                                <button className='btn btn-danger' onClick={handleLogout}>Çıkış Yap</button>
                            </div>
                        )}
                    </>
                ) : (
                    <button className='btn btn-danger' onClick={() => navigate('/')}>
                        Giriş Yap
                    </button>
                )}
            </div>
        </div>
    );
}

export default Header;
