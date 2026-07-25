// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TrangChu from './pages/TrangChu';
import VanBanDen from './pages/VanBanDen';
import VanBanDi from './pages/VanBanDi';
import BaoCao from './pages/BaoCao';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<TrangChu />} />
        <Route path="van-ban-den" element={<VanBanDen />} />
        <Route path="van-ban-di" element={<VanBanDi />} />
        <Route path="bao-cao" element={<BaoCao />} />
      </Route>
    </Routes>
  );
}
