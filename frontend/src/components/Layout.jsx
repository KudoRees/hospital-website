import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, Calendar, Users, FileText, Settings, Activity } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading Data...</div>;
  }

  const roleColors = {
    admin: 'from-orange-500 to-red-500',
    doctor: 'from-blue-500 to-indigo-500',
    patient: 'from-emerald-500 to-teal-500'
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex min-h-screen">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <Activity className="text-blue-600 mr-2" size={24} />
          <span className="text-xl font-bold hover:text-blue-700 cursor-pointer">O<span className="text-red-500">X</span>WAY</span>
        </div>
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-4">
            <Link to="/dashboard" className={`${isActive('/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'} group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors`}>
              <Calendar className={`${isActive('/dashboard') ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-500'} mr-3 shrink-0 h-5 w-5`} />
              Dashboard Overview
            </Link>
            {user.role === 'admin' && (
              <Link to="/doctors" className={`${isActive('/doctors') ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'} group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors`}>
                <Users className={`${isActive('/doctors') ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-500'} mr-3 shrink-0 h-5 w-5`} />
                Manage Doctors
              </Link>
            )}
            <Link to="/appointments" className={`${isActive('/appointments') ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'} group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors`}>
              <FileText className={`${isActive('/appointments') ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-500'} mr-3 shrink-0 h-5 w-5`} />
              Appointments
            </Link>
            <Link to="/settings" className={`${isActive('/settings') ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'} group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors`}>
              <Settings className={`${isActive('/settings') ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-500'} mr-3 shrink-0 h-5 w-5`} />
              Settings
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200 mt-auto">
          <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
            {location.pathname.replace('/', '') || 'Dashboard'}
          </h1>
          <div className="flex items-center">
            <div className={`h-8 w-8 rounded-full bg-gradient-to-tr ${roleColors[user.role]} flex items-center justify-center text-white font-bold shadow-md`}>
              {user.email.charAt(0).toUpperCase()}
            </div>
            <span className="ml-3 font-medium text-slate-700">{user.email}</span>
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 capitalize">
              {user.role}
            </span>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default Layout;
