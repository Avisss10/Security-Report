import React, { useEffect, useState } from 'react';
import { BiPencil, BiTrash } from 'react-icons/bi';
import '../../styles/cabContent.css';
import CabHeader from './cabHeader';
import EditCabangModal from './cabEdit';
import DelConfirm from '../delConfirm';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CabContent = () => {
  const [cabangData, setCabangData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cabangToEdit, setCabangToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cabangToDelete, setCabangToDelete] = useState(null);

  // Fetch semua data cabang
  const fetchCabangData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cabang');
      const formatted = res.data.map((c) => ({
        id: c.id_cabang,
        namaCabang: c.nama_cabang,
        alamatCabang: c.alamat_cabang,
      }));
      setCabangData(formatted);
    } catch (err) {
      console.error('Gagal fetch data cabang:', err);
      toast.error('Gagal fetch data cabang');
    }
  };


  useEffect(() => {
    fetchCabangData();
  }, []);

  // Tambah cabang
  const handleAddCabang = async (newCabang) => {
    try {
      await axios.post('http://localhost:5000/api/cabang', {
        nama_cabang: newCabang.nama_cabang,
        alamat_cabang: newCabang.alamat_cabang,
      });
      fetchCabangData(); // refresh list setelah tambah
      toast.success('Cabang berhasil ditambahkan');
    } catch (err) {
      console.error('Gagal tambah cabang:', err);
      if (err.response) {
        toast.error('Gagal menambahkan cabang: ' + JSON.stringify(err.response.data));
      } else {
        toast.error('Gagal menambahkan cabang: ' + err.message);
      }
    }
  };

  // Update cabang
  const handleUpdateCabang = async (updatedCabang) => {
    try {
      await axios.put(`http://localhost:5000/api/cabang/${updatedCabang.id}`, {
        nama_cabang: updatedCabang.namaCabang,
        alamat_cabang: updatedCabang.alamatCabang,
      });
      fetchCabangData();
      handleCloseEditModal();
      toast.success('Cabang berhasil diupdate');
    } catch (err) {
      console.error('Gagal update cabang:', err);
      if (err.response) {
        toast.error('Gagal mengupdate cabang: ' + JSON.stringify(err.response.data));
      } else {
        toast.error('Gagal mengupdate cabang: ' + err.message);
      }
    }
  };

  const handleOpenEditModal = (cabang) => {
    setCabangToEdit(cabang);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCabangToEdit(null);
  };

  const handleOpenDeleteModal = (cabang) => {
    setCabangToDelete(cabang);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCabangToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!cabangToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/cabang/${cabangToDelete.id}`);
      fetchCabangData();
      toast.success('Cabang berhasil dihapus');
    } catch (err) {
      console.error('Gagal menghapus cabang:', err);
      if (err.response) {
        toast.error('Gagal menghapus cabang: ' + JSON.stringify(err.response.data));
      } else {
        toast.error('Gagal menghapus cabang: ' + err.message);
      }
    } finally {
      handleCloseDeleteModal();
    }
  };

  return (
    <>
      <CabHeader onAddCabang={handleAddCabang} />

      <div className="cab-content">
        <div className="cabang-table-container">
          <table className="cabang-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Cabang</th>
                <th>Alamat Cabang</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cabangData.map((cabang) => (
                <tr key={cabang.id}>
                  <td>{cabang.id}</td>
                  <td>{cabang.namaCabang}</td>
                  <td>{cabang.alamatCabang}</td>
                  <td className="btn-group">
                    <button
                      className="edit-btn"
                      onClick={() => handleOpenEditModal(cabang)}
                    >
                      <BiPencil className="edit-icon" /> Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleOpenDeleteModal(cabang)}
                    >
                      <BiTrash className="delete-icon" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit */}
      <EditCabangModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        cabangData={cabangToEdit}
        onUpdateCabang={handleUpdateCabang}
      />

      {/* Modal Delete */}
      <DelConfirm
        isOpen={isDeleteModalOpen}
        message={`Apakah Anda yakin ingin menghapus cabang "${cabangToDelete?.namaCabang}"?`}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
      <ToastContainer position="top-center" />
    </>
  );
};

export default CabContent;
