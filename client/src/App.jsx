
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages & Components
import ExploreSkills from './pages/skills/ExploreSkills';
import SkillDetails from './pages/skills/SkillDetails';
import CreateSkill from './pages/skills/CreateSkills';
import EditSkill from './pages/skills/EditSkill';
import MySkills from './pages/skills/MySkills';
import MyBookings from './components/bookings/MyBookings';
import UserProfile from './pages/profile/UserProfile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

const Home = () => (
  <div className="max-w-7xl mx-auto px-4 py-20 text-center">
    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to SkillShare Platform</h1>
    <p className="text-xl text-gray-600 mb-8">Exchange skills, learn together, and grow your expertise with community experts.</p>
    <Link to="/explore" className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-indigo-700 shadow-md">
      Explore Skills Now
    </Link>
  </div>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <Link to="/" className="text-xl font-bold text-indigo-600">SkillShare</Link>
      <div className="space-x-5 flex items-center">
        <Link to="/explore" className="text-gray-700 hover:text-indigo-600 font-medium">Explore</Link>
        {user ? (
          <>
            <Link to="/skills/new" className="text-gray-700 hover:text-indigo-600 font-medium">Post Skill</Link>
            <Link to="/my-skills" className="text-gray-700 hover:text-indigo-600 font-medium">My Skills</Link>
            <Link to="/bookings" className="text-gray-700 hover:text-indigo-600 font-medium">Bookings</Link>
            <Link
              to="/profile"
              className="text-sm font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              {user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium">Login</Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExploreSkills />} />
          <Route path="/skills/:id" element={<SkillDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/skills/new" element={<CreateSkill />} />
            <Route path="/skills/edit/:id" element={<EditSkill />} />
            <Route path="/my-skills" element={<MySkills />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        &copy; 2026 Skill Sharing Platform. All rights reserved.
      </footer>
    </div>
  );
}

export default App;