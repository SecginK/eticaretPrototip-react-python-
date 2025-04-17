import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Login.css';

function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ad, setAd] = useState('');
    const [soyad, setSoyad] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const kayitOl = (event) => {
        event.preventDefault();

        if (!email.trim() || !password.trim() || !ad.trim() || !soyad.trim()) {
            setError('Lütfen tüm alanları doldurun.');
            setSuccess('');
            return;
        }

        axios.post('http://127.0.0.1:8000/api/register/', {
            email: email,
            sifre: password,
            ad: ad,
            soyad: soyad,
        })
            .then(response => {
                setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
                setError('');
                setTimeout(() => navigate('/'), 2000);
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    setError(error.response.data.message);
                } else {
                    setError('Bir hata oluştu. Lütfen tekrar deneyin.');
                }
                setSuccess('');
            });
    };

    const girisYap = () => {
        navigate('/');
    };

    return (
        <div className='pencere'>
            <div className='girisForm2'>
                <form onSubmit={kayitOl}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <div className='row' style={{ marginBottom: '0px' }}>
                        <label htmlFor="email" className="form-label">Email Adresi:</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='row' style={{ marginBottom: '0px' }}>
                        <label htmlFor="password" className="form-label">Şifre:</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className='row' style={{ marginBottom: '0px' }}>
                        <label htmlFor="ad" className="form-label">Ad:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="ad"
                            value={ad}
                            onChange={(e) => setAd(e.target.value)}
                        />
                    </div>

                    <div className='row' style={{ marginBottom: '10px' }}>
                        <label htmlFor="soyad" className="form-label">Soyad:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="soyad"
                            value={soyad}
                            onChange={(e) => setSoyad(e.target.value)}
                        />
                    </div>

                    <div className='row'>
                        <div className='col'>
                            <button className="btn btn-primary" style={{ width: '150px' }} type="submit">Kayıt Ol</button>
                        </div>
                        <div className='col'>
                            <button className="btn btn-secondary" style={{ width: '150px' }} onClick={girisYap}>Giriş'e Dön</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
