import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../css/home.css';
import Header from '../components/Header';
import { UserContext } from '../context/UserContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const { user } = useContext(UserContext);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);


    const fetchCategories = () => {
        axios.get('http://127.0.0.1:8000/api/kategoriler/')
            .then(response => {
                console.log('Backend Kategoriler:', response.data);
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Kategori API Hatası:', error);
            });
    };


    const fetchProducts = (categoryId = '') => {
        const url = categoryId
            ? `http://127.0.0.1:8000/api/urunler/?kategori=${categoryId}`
            : 'http://127.0.0.1:8000/api/urunler/';
        axios.get(url)
            .then(response => {
                console.log('Backend Ürünler:', response.data);
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Ürün API Hatası:', error);
            });
    };


    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
        fetchProducts(categoryId);
    };


    const addToCart = (urunId) => {
        if (!user) {
            alert('Lütfen giriş yapın.');
            return;
        }

        console.log('Sepete Eklenmeye Çalışılan Ürün:', {
            email: user.email,
            urun_id: urunId,
        });

        axios.post('http://127.0.0.1:8000/api/add-to-cart/', {
            email: user.email,
            urun_id: urunId,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                alert(response.data.message || 'Ürün sepete eklendi!');
            })
            .catch(error => {
                console.error('Sepete ekleme hatası:', error.response ? error.response.data : error.message);
                alert(error.response?.data?.message || 'Ürün sepete eklenirken bir hata oluştu.');
            });
    };

    return (
        <div className="container-xxl">
            <Header />
            <div className="reklam"></div>
            <div className="kategori">
                <select
                    className="form-select"
                    style={{ width: '200px', height: '38px', float: 'left', marginLeft: '80px', marginTop: '5px' }}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">Tüm Kategoriler</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.kategori_ad}</option>
                    ))}
                </select>
            </div>

            <div className="urunler row row-cols-2 justify-content-around">
                {products.map(product => (
                    <div className="urun" key={product.urun_id || product.id}>
                        <div className="row">
                            <img
                                src={product.resim || '../../public/images/placeholder.png'}
                                alt={product.urun_ad}
                                style={{ width: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="row"><h2>{product.urun_ad}</h2></div>
                        <div className="row"><h4>{product.urun_aciklama}</h4></div>
                        <div className="row justify-content-end"><h3>{product.fiyat}₺</h3></div>
                        <div className="row justify-content-center">
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    console.log('Sepete Eklenecek Ürün ID:', product.urun_id || product.id);
                                    addToCart(product.urun_id || product.id);
                                }}
                            >
                                Sepete Ekle
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Home;
