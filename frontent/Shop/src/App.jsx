import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'
import './css/Product.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Sepetim from './pages/Sepetim'
import Adreslerim from './pages/Adreslerim'
import Siparislerim from './pages/Siparislerim'
import Header from './components/Header'
import Signup from './pages/Signup'
import { UserProvider } from './context/UserContext';

function App() {

  return (
    <UserProvider>
      <div className='container-fluid'>
        <div className='container-xxl'>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/Signup' element={<Signup />} />
            <Route path='/Anasayfa' element={<Home />} />
            <Route path='/sepetim' element={<Sepetim />} />
            <Route path='/siparislerim' element={<Siparislerim />} />
            <Route path='/adreslerim' element={<Adreslerim />} />
          </Routes>
        </div>
      </div>
    </UserProvider>
  )
}

export default App
