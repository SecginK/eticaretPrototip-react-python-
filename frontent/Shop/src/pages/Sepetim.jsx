import React, { useState, useEffect, useContext } from 'react';
import '../css/sepetim.css';
import Header from '../components/Header';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

function Sepetim() {
    const { user } = useContext(UserContext);
    const [cartItems, setCartItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (user) {
            fetchCartItems();
            fetchAddresses();
        }
    }, [user]);

    const fetchCartItems = () => {
        axios.get(`http://127.0.0.1:8000/api/cart/${user.user_id}/`)
            .then(response => {
                console.log('Sepet Verileri:', response.data);
                setCartItems(response.data);
                calculateTotalPrice(response.data);
            })
            .catch(error => {
                console.error('Sepet API Hatası:', error);
            });
    };

    const fetchAddresses = () => {
        axios.get(`http://127.0.0.1:8000/api/addresses/${user.user_id}/`)
            .then(response => {
                setAddresses(response.data);
            })
            .catch(error => {
                console.error('Adres API Hatası:', error);
            });
    };

    const calculateTotalPrice = (items) => {
        const total = items.reduce((sum, item) => sum + (item.urun?.fiyat || 0), 0);
        setTotalPrice(total);
    };

    const handleRemoveFromCart = (siparisId) => {
        axios.delete(`http://127.0.0.1:8000/api/siparisler/${siparisId}/`)
            .then(() => {
                const updatedCartItems = cartItems.filter(item => item.id !== siparisId);
                setCartItems(updatedCartItems);
                calculateTotalPrice(updatedCartItems);
                alert('Ürün sepetten çıkarıldı.');
            })
            .catch(error => {
                console.error('Sepetten çıkarma hatası:', error);
                alert('Ürün çıkarılırken bir hata oluştu.');
            });
    };

    const handleConfirmOrder = () => {
        if (!selectedAddress) {
            alert('Lütfen bir adres seçin.');
            return;
        }

        axios.post(`http://127.0.0.1:8000/api/confirm-order/`, {
            user_id: user.user_id,
            adres_id: selectedAddress,
        })
            .then(() => {
                alert('Sipariş onaylandı!');
                fetchCartItems();
            })
            .catch(error => {
                console.error('Sipariş onay hatası:', error);
                alert('Sipariş onaylanırken bir hata oluştu.');
            });
    };

    return (
        <div className="container-xxl cerceve">
            <Header />
            {cartItems.map(item => (
                <div className="urunler row row-cols-2 justify-content-around">
                    <div className='UrunSatir row'>
                        <div className='row' style={{ marginBottom: '50px' }}>
                            <div className='col-9'><h5>Sipariş Detayları</h5></div>
                            <div className='col-3'><h5>Sipariş Özeti</h5></div>
                        </div>
                        <div className='row'>
                            <div className='col-3'>
                                <img
                                    src={item.urun?.resim || '../../public/images/placeholder.png'}
                                    alt={item.urun?.urun_ad || 'Ürün Görseli'}
                                    style={{ width: '100%', objectFit: 'contain' }}
                                />
                            </div>
                            <div className='col-6'>
                                <div className="row text-left"><h3>{item.urun?.urun_ad || 'Ürün Adı Eksik'}</h3></div>
                                <div className="row text-left" style={{ marginBottom: '20px', marginTop: '10px' }}><h5 style={{ fontWeight: '200' }}>{item.urun?.urun_aciklama || 'Açıklama Eksik'}</h5></div>
                                <div className="row text-left"><h5>{item.urun?.fiyat || 0}₺</h5></div>
                            </div>
                            <div className='col-3'>
                                <div className='row'>1 Ürün</div>
                                <div className='row' style={{ marginTop: '10px' }}>Sipariş Tutarı(KDV Dahil):</div>
                                <div className='row' style={{ marginTop: '5px' }}><h3>{item.urun?.fiyat || 0}₺</h3></div>
                                <div className='row'>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleRemoveFromCart(item.id)}
                                    >
                                        Sepetten Çıkar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            ))}



            <div className="footer d-flex position-fixed bottom-0 start-0 justify-content-around">
                <div>
                    <select
                        className="form-select"
                        style={{ width: '200px', height: '55px', marginTop: '-8px' }}
                        value={selectedAddress}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                    >
                        <option value="">Adres Seçin</option>
                        {addresses.map(address => (
                            <option key={address.id} value={address.id}>
                                {address.adres}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex' }}><p style={{ color: '#f8c471', fontWeight: '400', marginRight: '10px' }}>Toplam Tutar:   </p><p style={{ color: 'white', fontWeight: '300' }}> {totalPrice.toFixed(3)}₺</p></div>
                <div>
                    <button
                        className="btn btn-warning"
                        style={{ marginTop: '-8px', width: '100px', height: '60px', fontSize: 'large' }}
                        onClick={handleConfirmOrder}
                    >
                        Onayla
                    </button>
                </div>
            </div>
        </div >
    );
}

export default Sepetim;
