import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import { User, LogOut, Shield, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
          <p className="text-slate-500 mt-1">Manage your account preferences and information.</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Your Profile</h3>
              <p className="text-slate-500 mt-1 capitalize">{user.role} Account</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mr-4 shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Email Address</p>
                <p className="text-lg font-medium text-slate-900 mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mr-4 shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Account Role</p>
                <p className="text-lg font-medium text-slate-900 mt-0.5 capitalize">{user.role}</p>
                <p className="text-sm text-slate-500 mt-1">Your privileges are set globally by the hospital administration.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mr-4 shrink-0">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">System ID</p>
                <p className="font-mono text-sm text-slate-900 mt-1 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 inline-block">{user._id || user.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-2xl p-8 border border-red-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-red-800">Danger Zone</h3>
            <p className="text-sm text-red-600 mt-1">Log out of your current session on this device.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-white text-red-600 hover:bg-red-600 hover:text-white border border-red-200 px-6 py-2.5 rounded-xl font-semibold transition-colors flex items-center shadow-sm"
          >
            <LogOut size={18} className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
