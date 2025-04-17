import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import '../css/Login.css';

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const girisYap = (event) => {
        event.preventDefault();

        axios.post('http://127.0.0.1:8000/api/login/', {
            email: email,
            sifre: password,
        })
            .then(response => {
                login(response.data);
                navigate('/Anasayfa');
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    setError(error.response.data.message);
                } else {
                    setError('Bir hata oluştu. Lütfen tekrar deneyin.');
                }
            });
    };

    return (
        <div className='pencere'>
            <div className='girisForm'>
                <form>
                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className='row' style={{ marginBottom: '40px' }}>
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='row' style={{ marginBottom: '40px' }}>
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className='row'>
                        <div className='col'>
                            <button className="btn btn-primary" style={{ width: '150px' }} onClick={girisYap}>
                                Giriş Yap
                            </button>
                        </div>
                        <div className='col'>
                            <button className="btn btn-secondary" style={{ width: '150px' }} onClick={() => navigate('/Signup')}>
                                Kayıt Ol
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
