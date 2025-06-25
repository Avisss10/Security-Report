import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ConfirmDel from './ConfirmDel';

const ReportCard = ({
  id_laporan,
  name,
  nip,
  location,
  message,
  time,
  date,
  foto = [],
  jenis,
  judul,
  cuaca,
  canDelete = false,
  onDelete = () => {},
  onUpdate = () => {},
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const menuRef = useRef(null);
  const [fotoLamaTerhapus, setFotoLamaTerhapus] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    jenis_laporan: jenis,
    judul_laporan: judul,
    kondisi_cuaca: cuaca,
    deskripsi_laporan: message,
  });

  const [fotoLama, setFotoLama] = useState(foto);
  const [fotoBaru, setFotoBaru] = useState([]);
  const [previewBaru, setPreviewBaru] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDayName = (tanggal) => {
    return new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long' });
  };

const handleFotoBaru = (e) => {
  const files = Array.from(e.target.files);
  const newPreviews = files.map((f) => URL.createObjectURL(f));

  // Validasi gabungan maksimal 5
  const total = fotoLama.length + fotoBaru.length + files.length;
  if (total > 5) {
    toast.error('Total maksimal 5 foto', {
      style: { backgroundColor: '#dc2626', color: 'white' }
    });
    return;
  }

  setFotoBaru((prev) => [...prev, ...files]);
  setPreviewBaru((prev) => [...prev, ...newPreviews]);
};


  const handleDeleteFotoLama = (id_foto) => {
    setFotoLama(fotoLama.filter((f) => f.id_foto !== id_foto));
    setFotoLamaTerhapus((prev) => [...prev, id_foto]);
  };

  const handleSubmitUpdate = async () => {
    const id_user = localStorage.getItem('id_user');
    const totalFoto = fotoLama.length + fotoBaru.length;
    if (totalFoto > 5) {
      toast.error('Maksimal total 5 foto per laporan', {
        style: { backgroundColor: '#dc2626', color: 'white' }
      });
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/laporan/${id_laporan}`, {
        ...formData,
        id_user,
      });

      for (const id of fotoLamaTerhapus) {
        await axios.delete(`http://localhost:5000/api/laporan/foto/${id}`);
        toast.success('Foto berhasil dihapus', {
          style: { backgroundColor: '#7c3aed', color: 'white' }
        });
      }

      if (fotoBaru.length > 0) {
        const fd = new FormData();
        fd.append('id_laporan', id_laporan);
        fotoBaru.forEach((f) => fd.append('foto', f));
        await axios.post('http://localhost:5000/api/laporan/foto', fd);
      }

      const res = await axios.get(`http://localhost:5000/api/laporan/${id_laporan}`);
      res.data.canDelete = true;
      if (onUpdate) onUpdate(res.data);
      setShowEditForm(false);

    } catch (err) {
      toast.error('Gagal update laporan: ' + (err.response?.data?.message || err.message), {
        style: { backgroundColor: '#dc2626', color: 'white' }
    });
      alert('Gagal update laporan: ' + (err.response?.data?.message || err.message));
    }
    toast.success('Laporan berhasil diperbarui', {
     style: { backgroundColor: '#7c3aed', color: 'white' }
    });
  };

  const handleManualDownload = async (path) => {
    try {
      const response = await fetch(`http://localhost:5000/uploads/${path}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = path;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Gagal download gambar', {
        style: { backgroundColor: '#dc2626', color: 'white' }
      });
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm mb-4 relative">
      {canDelete && (
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button onClick={() => setShowMenu(!showMenu)}>
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded shadow-md z-10 text-sm">
              <button
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                onClick={() => {
                  setShowConfirm(true);
                  setShowMenu(false);
                }}
              >
                Hapus
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-blue-600 hover:bg-gray-100"
                onClick={() => {
                  setFormData({
                    jenis_laporan: jenis,
                    judul_laporan: judul,
                    kondisi_cuaca: cuaca,
                    deskripsi_laporan: message,
                  });
                  setFotoLama(foto);          
                  setFotoBaru([]);           
                  setPreviewBaru([]);         
                  setFotoLamaTerhapus([]);    
                  setShowEditForm(true);     
                  setShowMenu(false);         
                }}
              >
               Edit
              </button>

            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A9 9 0 1118.88 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="text-sm font-semibold text-black">
          {name} <span className="text-gray-500 font-normal"> • {nip} • {location}</span>
        </div>
      </div>

      {foto.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mb-3">
          {foto.map((src, index) => {
            const path = typeof src === 'string' ? src : src.foto_path;
            return (
              <div key={index} className="relative group">
                <img
                  src={`http://localhost:5000/uploads/${path}`}
                  alt={`foto-${index}`}
                  className="w-32 h-20 object-cover rounded shadow cursor-pointer hover:brightness-90"
                  onClick={() => setSelectedImage(path)}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="text-sm text-black space-y-1">
        <p><strong>Jenis:</strong> {jenis}</p>
        <p><strong>Judul:</strong> {judul}</p>
        <p><strong>Cuaca:</strong> {cuaca}</p>
        <p className="w-full border px-3 py-2 rounded-md mb-4 text-sm whitespace-pre-wrap">{message}</p>
      </div>

      <div className="text-xs text-gray-500 text-right mt-3">
        {getDayName(date)} · {time} WIB · {new Date(date).toLocaleDateString('id-ID')}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
            <img src={`http://localhost:5000/uploads/${selectedImage}`} alt="Preview" className="max-h-[70vh] mx-auto rounded" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleManualDownload(selectedImage);
              }}
              className="mt-3 bg-black-600 hover:bg-black-700 text-white text-sm px-4 py-2 rounded"
            >
              Download
            </button>
        </div>
      )}

      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-[90vw] max-w-md space-y-3 overflow-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-2">Edit Laporan</h2>

            <select value={formData.jenis_laporan} onChange={(e) => setFormData({ ...formData, jenis_laporan: e.target.value })} className="w-full border px-3 py-2 rounded">
              <option value="">Jenis</option>
              <option value="Luar Gedung">Luar Gedung</option>
              <option value="Dalam Gedung">Dalam Gedung</option>
              <option value="Serah Terima">Serah Terima</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Lain">Lain</option>
            </select>

            <input type="text" placeholder="Judul" value={formData.judul_laporan} onChange={(e) => setFormData({ ...formData, judul_laporan: e.target.value })} className="w-full border px-3 py-2 rounded" />
            <input type="text" placeholder="Cuaca" value={formData.kondisi_cuaca} onChange={(e) => setFormData({ ...formData, kondisi_cuaca: e.target.value })} className="w-full border px-3 py-2 rounded" />
            <textarea placeholder="Deskripsi" value={formData.deskripsi_laporan} onChange={(e) => setFormData({ ...formData, deskripsi_laporan: e.target.value })} className="w-full border px-3 py-2 h-64 rounded" />

            <div className="flex gap-2 flex-wrap">
              {fotoLama.map((f, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={`http://localhost:5000/uploads/${f.foto_path}`} className="w-full h-full object-cover rounded" />
                  <button onClick={() => handleDeleteFotoLama(f.id_foto)} className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center shadow" title="Hapus">×</button>
                </div>
              ))}
            </div>

            <input type="file" multiple accept="image/*" onChange={handleFotoBaru} className="block w-full mt-2" />
            <div className="flex gap-2 flex-wrap mt-2">
              {previewBaru.map((src, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    onClick={() => {
                      setFotoBaru((prev) => prev.filter((_, idx) => idx !== i));
                      setPreviewBaru((prev) => prev.filter((_, idx) => idx !== i));
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center shadow"
                    title="Hapus"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between gap-2 mt-4">
              <button onClick={() => setShowEditForm(false)} className="w-1/2 bg-gray-300 text-black py-1 rounded">Batal</button>
              <button onClick={handleSubmitUpdate} className="w-1/2 bg-blue-600 text-white py-1 rounded">Simpan</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDel
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          onDelete();
          setShowConfirm(false);
        }}
      />
    </div>
  );
};

export default ReportCard;