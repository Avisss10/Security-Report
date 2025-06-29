import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { BiPencil, BiTrash } from 'react-icons/bi';
import '../../styles/secContent.css';
import EditSecurityModal from './secEdit';
import DelConfirm from '../delConfirm';
import axios from '../../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SecContent = forwardRef((props, ref) => {
  const [securityAccounts, setSecurityAccounts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [securityToEdit, setSecurityToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [securityToDelete, setSecurityToDelete] = useState(null);

  // 🔄 Fetch data dari backend
  const fetchSecurityAccounts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user?level=Security');
      const formatted = res.data.map((user) => ({
        id: user.id_user,
        nip: user.nip,
        name: user.nama_user,
        password: user.password,
        cabang: user.nama_cabang,
        level: user.nama_level,
        id_cabang: user.id_cabang,
        id_level: user.id_level
      }));
      setSecurityAccounts(formatted);
    } catch (err) {
      console.error('Gagal fetch security:', err);
      toast.error('Gagal fetch security');
    }
  };

  useEffect(() => {
    fetchSecurityAccounts();
  }, []);

  // ➕ Tambah security (dipanggil dari SecHeader)
  const handleAddSecurity = async (newSecurity) => {
    try {
      console.log('Adding security with data:', newSecurity);
      await axios.post('http://localhost:5000/api/user', newSecurity);
      fetchSecurityAccounts(); // refresh otomatis
      toast.success('Security berhasil ditambahkan');
    } catch (err) {
      if (err.response) {
        console.error('Gagal tambah security:', err.response.data);
        toast.error('Gagal menambahkan security: ' + JSON.stringify(err.response.data));
      } else {
        console.error('Gagal tambah security:', err.message);
        toast.error('Gagal menambahkan security: ' + err.message);
      }
    }
  };
  useImperativeHandle(ref, () => ({
    handleAddSecurity,
  }));

  // ✏️ Edit security
  const handleOpenEditModal = (security) => {
    setSecurityToEdit(security);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSecurityToEdit(null);
  };

  const handleUpdateSecurity = async (updatedSecurity) => {
    try {
      await axios.put(`http://localhost:5000/api/user/${updatedSecurity.id}`, updatedSecurity);
      fetchSecurityAccounts(); // refresh otomatis
      handleCloseEditModal();
      toast.success('Security berhasil diupdate');
    } catch (err) {
      console.error('Gagal update security:', err);
      if (err.response) {
        toast.error('Gagal mengupdate security: ' + JSON.stringify(err.response.data));
      } else {
        toast.error('Gagal mengupdate security: ' + err.message);
      }
    }
  };

  // 🗑️ Delete security
  const handleOpenDeleteModal = (security) => {
    setSecurityToDelete(security);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSecurityToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/user/${securityToDelete.id}`);
      fetchSecurityAccounts(); // refresh otomatis
      toast.success('Security berhasil dihapus');
    } catch (err) {
      console.error('Gagal menghapus security:', err);
      if (err.response) {
        toast.error('Gagal menghapus security: ' + JSON.stringify(err.response.data));
      } else {
        toast.error('Gagal menghapus security: ' + err.message);
      }
    } finally {
      handleCloseDeleteModal();
    }
  };

  return (
    <>
      <div className="sec-content">
        <div className="security-table-container">
          <table className="security-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NIP</th>
                <th>Name</th>
                <th>Password</th>
                <th>Cabang</th>
                <th>Level</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {securityAccounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.id}</td>
                  <td>{account.nip}</td>
                  <td>{account.name}</td>
                  <td>{account.password}</td>
                  <td>{account.cabang}</td>
                  <td>{account.level}</td>
                  <td className="btn-group">
                    <button
                      className="edit-btn"
                      onClick={() => handleOpenEditModal(account)}
                    >
                      <BiPencil className="edit-icon" />
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleOpenDeleteModal(account)}
                    >
                      <BiTrash className="delete-icon" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit */}
      <EditSecurityModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        securityData={securityToEdit}
        onUpdateSecurity={handleUpdateSecurity}
      />

      {/* Modal Delete */}
      <DelConfirm
        isOpen={isDeleteModalOpen}
        message={`Apakah Anda yakin ingin menghapus security "${securityToDelete?.name}"?`}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
      <ToastContainer position="top-center" />
    </>
  );
});

export default SecContent;