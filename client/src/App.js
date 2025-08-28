import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SubmitItem from './pages/SubmitItem';
import MyItems from './pages/MyItems';
import ItemDetail from './pages/ItemDetail';
import ModeratorDashboard from './pages/ModeratorDashboard';
import Profile from './pages/Profile';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { loading, isAuthenticated, isModerator } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App bg-gray-900 min-h-screen">
      <Navbar />
      <main className="pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
          />
          <Route 
            path="/submit" 
            element={isAuthenticated ? <SubmitItem /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/my-items" 
            element={isAuthenticated ? <MyItems /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/item/:id" 
            element={<ItemDetail />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/moderator" 
            element={isModerator ? <ModeratorDashboard /> : <Navigate to="/" />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
