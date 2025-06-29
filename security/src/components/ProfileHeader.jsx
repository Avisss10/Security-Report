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

  // Fungsi normalisasi nama cabang
  const normalize = (str) => (str || '').toLowerCase().replace(/\s+/g, ' ').trim();

  // Fungsi untuk mapping warna cabang ke gradient (dengan partial match)
  const getCabangGradient = (cabang) => {
    const merah = ['Witel', 'STO Tanjung Priok'];
    const hijau = ['STO Mangga Besar', 'Pademangan', 'Mangga Dua'];
    const ungu = ['STO Cilincing', 'STO Marunda', 'Gudang Marunda'];
    const biru = ['STO Sunter', 'STO Kelapa Gading', 'Yanum Kelapa Gading'];
    const hitam = ['STO Kota', 'STO Muara Karang'];

    const norm = normalize(cabang);
    if (merah.map(normalize).some(n => norm.includes(n))) return 'from-red-600 to-red-400';
    if (hijau.map(normalize).some(n => norm.includes(n))) return 'from-green-600 to-green-400';
    if (ungu.map(normalize).some(n => norm.includes(n))) return 'from-purple-600 to-purple-400';
    if (biru.map(normalize).some(n => norm.includes(n))) return 'from-blue-600 to-blue-400';
    if (hitam.map(normalize).some(n => norm.includes(n))) return 'from-gray-800 to-gray-600';
    return 'from-slate-400 to-slate-200'; // default
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleCloseModal = () => {
    setLogoutModalOpen(false);
  };

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
      {/* Cover Background */}
      <div className={`h-24 bg-gradient-to-r ${getCabangGradient(userInfo.location)}`}></div>

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
