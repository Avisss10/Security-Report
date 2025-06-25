import React, { useState } from 'react';
import { User, MapPin, LogOut, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConLogout from './ConLogout';

const ProfileHeader = () => {
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const userInfo = {
    name: localStorage.getItem('nama_user') || '-',
    nip: localStorage.getItem('nip') || '-',
    location: localStorage.getItem('nama_cabang') || '-',
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleCloseModal = () => {
    setLogoutModalOpen(false);
  };

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    // Clear token/session here if needed
    localStorage.removeItem('id_cabang');
    localStorage.removeItem('id_user');
    localStorage.removeItem('nama_cabang');
    localStorage.removeItem('nama_user');
    localStorage.removeItem('nip');
    navigate('/login');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
      {/* Cover Background */}
      <div className="h-24 bg-gradient-to-r from-purple-600 to-blue-600"></div>

      {/* Logout Button */}
      <button
        onClick={handleLogoutClick}
        className="absolute top-4 right-4 text-white hover:text-gray-100 flex items-center gap-1 text-sm"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>

      {/* Profile Content */}
      <div className="px-6 pb-6">
        {/* Avatar di Tengah */}
        <div className="flex justify-center -mt-12 mb-4">
          <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Nama */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Nama</p>
              <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
            </div>
          </div>

          {/* NIP */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">NIP</p>
              <p className="text-sm font-medium text-gray-900">{userInfo.nip}</p>
            </div>
          </div>

          {/* Cabang */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Cabang</p>
              <p className="text-sm font-medium text-gray-900">{userInfo.location}</p>
            </div>
          </div>
        </div>
      </div>

      <ConLogout
        open={logoutModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default ProfileHeader;
