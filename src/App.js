// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import AddRecipe from './pages/AddRecipe';
import FindRecipes from './pages/FindRecipes';
import AdminDashboard from './pages/AdminDashboard';
import RecipeCreatorDashboard from './pages/RecipeCreatorDashboard';
import { AuthProvider } from './services/AuthContext';
import ProtectedRoute from './services/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/creator"
            element={
              <ProtectedRoute allowedRoles={['RECIPE_CREATOR']}>
                <RecipeCreatorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/find-recipes"
            element={
           //   <ProtectedRoute allowedRoles={['HOME_COOK']}>
                <FindRecipes />
         //     </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
