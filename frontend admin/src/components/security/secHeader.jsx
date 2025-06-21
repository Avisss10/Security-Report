import React, { useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import AddSecurityModal from './secAdd';

const SecHeader = ({ onAddSecurity }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="content--header">
      <h2 className="header--title">Security</h2>
      <div className="header--activity">
        <button className="add-security-btn" onClick={openModal}>
          <BiPlus className="icon" />
          Tambah Security
        </button>
      </div>

      <AddSecurityModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddSecurity={onAddSecurity}
      />
    </div>
  );
};

export default SecHeader;
