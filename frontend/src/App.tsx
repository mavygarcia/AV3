import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';

import { Aeronaves } from './pages/Aeronaves';
import { Funcionarios } from './pages/Funcionarios';
import { Pecas } from './pages/Pecas';
import { Etapas } from './pages/Etapas';
import { Testes } from './pages/Testes';
import { Relatorios } from './pages/Relatorios';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/aeronaves" replace />} />
            <Route path="aeronaves" element={<Aeronaves />} />
            <Route path="funcionarios" element={<Funcionarios />} />
            <Route path="pecas" element={<Pecas />} />
            <Route path="etapas" element={<Etapas />} />
            <Route path="testes" element={<Testes />} />
            <Route path="relatorios" element={<Relatorios />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
