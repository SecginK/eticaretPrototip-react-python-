import React, { useState, useEffect, useContext } from 'react';
import '../css/Adreslerim.css';
import Header from '../components/Header';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

function Adreslerim() {
    const { user } = useContext(UserContext);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState('');

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = () => {
        axios.get(`http://127.0.0.1:8000/api/addresses/${user.user_id}/`)
            .then(response => {
                console.log('Çekilen Adresler:', response.data);
                setAddresses(response.data);
            })
            .catch(error => {
                console.error('Adresleri çekme hatası:', error.response?.data || error.message);
            });
    };

    const handleAddAddress = () => {
        if (!newAddress.trim()) {
            alert('Lütfen bir adres girin.');
            return;
        }

        axios.post('http://127.0.0.1:8000/api/add-address/', {
            user_id: user.user_id,
            adres: newAddress,
        })
            .then(() => {
                alert('Adres başarıyla eklendi.');
                setNewAddress('');
                fetchAddresses();
            })
            .catch(error => {
                console.error('Adres ekleme hatası:', error.response?.data || error.message);
                alert('Adres eklenirken bir hata oluştu.');
            });
    };

    const handleDeleteAddress = (addressId) => {
        axios
            .delete(`http://127.0.0.1:8000/api/delete-address/${addressId}/`)
            .then(() => {
                console.log(`Adres silindi. Silinen ID: ${addressId}`);
                setAddresses(prevAddresses => prevAddresses.filter(address => address.id !== addressId));
                alert('Adres başarıyla silindi.');
            })
            .catch(error => {
                console.error('Adres silme hatası:', error.response?.data || error.message);
                alert(error.response?.data?.message || 'Adres silinirken bir hata oluştu.');
            });
    };

    return (
        <div className="container-xxl">
            <Header />
            <div className="container">
                <div className="AdresEkle mb-4">
                    <div className="row mb-2">
                        <input
                            className="form-control adrestext"
                            placeholder="Yeni adresinizi girin"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                        />
                    </div>
                    <div className="row">
                        <button className="btn btn-primary" onClick={handleAddAddress}>
                            Adres Ekle
                        </button>
                    </div>
                </div>
                <div className="Adreslerim">
                    <div className='row' style={{ height: '100px' }}>
                        <div className='col-' style={{ borderBottom: '1px solid gray', marginBottom: '30px' }}><h4>Kayıtlı Adreslerim:</h4></div>
                    </div>
                    {addresses.map(address => (
                        <div key={address.id} className='row d-flex justify-content-between align-items-center mb-3' style={{ borderBottom: '1px solid lightgray', marginBottom: '40px', height: '80px' }}>
                            <div className='col-11'><h5>{address.adres}</h5></div>
                            <div className='col-1'>
                                <button className="btn btn-danger" onClick={() => handleDeleteAddress(address.id)} style={{ fontSize: 'medium', width: '100px' }}>Adresi Sil</button>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>

    );
}

export default Adreslerim;
