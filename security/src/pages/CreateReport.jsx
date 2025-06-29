import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Shield } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import axios from '../utils/axiosInstance';
import '../styles/toastStyles.css';

const CreateReport = () => {
  const navigate = useNavigate();

  const [jenis, setJenis] = useState('');
  const [judul, setJudul] = useState('');
  const [cuaca, setCuaca] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);        
  const [imageFiles, setImageFiles] = useState([]); 
  const [showReview, setShowReview] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error('Maksimal upload 5 foto');
      return;
    }
    setImages(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    setImageFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = async () => {
    const id_user = localStorage.getItem('id_user');
    const id_cabang = localStorage.getItem('id_cabang');

    if (!id_user || !id_cabang) {
      toast.error('User belum login!');
      return;
    }

    if (!jenis || !judul || !cuaca || !message) {
      toast.error('Semua field wajib diisi!');
      return;
    }

    const formData = new FormData();
    formData.append('id_user', id_user);
    formData.append('id_cabang', id_cabang);
    formData.append('jenis_laporan', jenis);
    formData.append('judul_laporan', judul);
    formData.append('kondisi_cuaca', cuaca);
    formData.append('deskripsi_laporan', message);
    imageFiles.forEach(file => formData.append('foto', file)); // ✅ multiple

    try {
      await axios.post('http://localhost:5000/api/laporan', formData);
      toast.success('Laporan berhasil dikirim!');
      setTimeout(() => {
        navigate('/dashboard', { state: { refresh: true } });
      }, 500);
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Gagal mengirim laporan: ' + err.message);
    }
  };

  const openReview = () => {
    if (!jenis || !judul || !cuaca || !message) {
      toast.error('Semua field wajib diisi!');
      return;
    }
    setShowReview(true);
  };

  const closeReview = () => {
    setShowReview(false);
  };

  return (
    <div className="min-h-screen p-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-purple-600">SECURITY</div>
            <div className="text-sm text-purple-500 font-bold">REPORT</div>
          </div>
        </div>

        <div className="space-x-2">
          <button
            className="border border-black px-4 py-1 rounded-full text-sm"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
          <button
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm"
            onClick={openReview}
          >
            Review
          </button>
        </div>
      </div>
      <ToastContainer position="top-center" />

      <h2 className="text-sm font-semibold mb-2">New Report</h2>

      {/* Jenis */}
      <select
        value={jenis}
        onChange={(e) => setJenis(e.target.value)}
        className="w-full border px-3 py-2 rounded-md mb-4 text-sm"
      >
        <option value="">Jenis</option>
        <option value="Luar Gedung">Luar Gedung</option>
        <option value="Dalam Gedung">Dalam Gedung</option>
        <option value="Serah Terima">Serah Terima</option>
        <option value="Kegiatan">Kegiatan</option>
        <option value="Lain">Lain</option>
      </select>

      {/* Judul */}
      <input
        type="text"
        placeholder="Judul Laporan"
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
        className="w-full border px-3 py-2 rounded-md mb-4 text-sm"
      />

      {/* Cuaca */}
      <input
        type="text"
        placeholder="Kondisi Cuaca"
        value={cuaca}
        onChange={(e) => setCuaca(e.target.value)}
        className="w-full border px-3 py-2 rounded-md mb-4 text-sm"
      />

      {/* Deskripsi */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Deskripsi Laporan"
        className="w-full border px-3 py-2 rounded-md mb-4 text-sm h-24 resize-none"
      />

      {/* Gambar */}
      <label
        htmlFor="image-upload"
        className="w-full border border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer text-gray-400 text-sm py-6"
      >
        <ImagePlus className={`mb-1 w-6 h-6`} />
        <span className="text-gray-600 text-sm font-semibold">
          {images.length === 0 ? 'Masukkan Foto' : 'Tambah Foto'}
        </span>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>

      {/* Preview thumbnails */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((src, index) => (
            <div key={index} className="relative w-20 h-20 border rounded overflow-hidden">
              <img src={src} alt={`preview-${index}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  const newImages = images.filter((_, i) => i !== index);
                  const newImageFiles = imageFiles.filter((_, i) => i !== index);
                  setImages(newImages);
                  setImageFiles(newImageFiles);
                }}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-bl px-1 text-xs font-bold"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Review Popup */}
      {showReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full z-50">
            {images.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {images.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`review-${index}`}
                    className="w-20 h-20 object-cover rounded cursor-pointer"
                    onClick={() => setModalImage(src)}
                  />
                ))}
              </div>
            )}
            <div className="mb-2"><strong>Jenis:</strong> {jenis}</div>
            <div className="mb-2"><strong>Judul:</strong> {judul}</div>
            <div className="mb-2"><strong>Cuaca:</strong> {cuaca}</div>
            <div className="mb-4 max-h-96 overflow-y-auto border p-2 rounded text-sm whitespace-pre-wrap">{message}</div>

            <div className="flex justify-end space-x-4">
              <button
                className="border border-gray-400 px-4 py-1 rounded text-sm"
                onClick={closeReview}
              >
                Edit
              </button>
              <button
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded text-sm"
                onClick={() => {
                  closeReview();
                  handleSubmit();
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Image Modal Popup */}
      {modalImage && ReactDOM.createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000]"
          onClick={() => setModalImage(null)}
        >
            <img src={modalImage} alt="modal" className="max-w-full max-h-[70vh]" />
        </div>,
        document.body
      )}
  </div>
  );
};

export default CreateReport;
