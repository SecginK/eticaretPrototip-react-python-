import React, { useState, useEffect, useContext } from 'react';
import '../css/Siparislerim.css';
import Header from '../components/Header';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

function Siparislerim() {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = () => {
        axios.get(`http://127.0.0.1:8000/api/orders/${user.user_id}/`)
            .then(response => {
                console.log('Onaylanmış Siparişler:', response.data);
                setOrders(response.data);
            })
            .catch(error => {
                console.error('Sipariş API Hatası:', error);
            });
    };

    const handleCancelOrder = (siparisId) => {
        axios.delete(`http://127.0.0.1:8000/api/siparisler/${siparisId}/`)
            .then(() => {
                setOrders(prevOrders => prevOrders.filter(order => order.id !== siparisId));
                alert('Sipariş iptal edildi.');
            })
            .catch(error => {
                console.error('Sipariş iptal hatası:', error);
                alert('Sipariş iptal edilirken bir hata oluştu.');
            });
    };

    return (
        <div className="container-xxl cerceve">
            <Header />
            {orders.length === 0 ? (
                <p>Sipariş bulunamadı.</p>
            ) : (
                orders.map(order => (
                    <div className="tamparca row d-flex" key={order.id}>
                        <div className="solparca col-8">
                            <div className="row">
                                <div className="col-5">
                                    <img
                                        src={order.urun?.resim || '../../public/images/placeholder.png'} // Resim kaynağı
                                        style={{ width: '100%', margin: '20px' }}
                                        alt={order.urun?.urun_ad || 'Ürün Görseli'}
                                    />
                                </div>
                                <div className="col-7" style={{ padding: '40px' }}>
                                    <div className='row'><h4>Ürün Adı:</h4></div>
                                    <div className='row'><h5>{order.urun?.urun_ad || 'Ürün Adı Eksik'}</h5></div>
                                    <div className='row'><h4>Ürün Açıklaması</h4></div>
                                    <div className='row'><h5>{order.urun?.urun_aciklama || 'Açıklama Eksik'}</h5></div>
                                </div>
                            </div>
                        </div>
                        <div className="sagparca col-4 d-flex flex-column justify-content-between">
                            <div className='row'><h4>Gönderim Adresi:</h4></div>
                            <div className='row'><h5>{order.adres?.adres || 'Adres Eksik'}</h5></div>
                            <div className='row'><h4>Ödenen Tutar:</h4></div>
                            <div className='row'><h5 style={{ fontWeight: '400' }}>{order.urun?.fiyat || 0}₺</h5></div>
                            <div className='row'>
                                <button className="btn btn-warning" onClick={() => handleCancelOrder(order.id)}>Gönderiyi İptal Et</button>
                            </div>



                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Siparislerim;
