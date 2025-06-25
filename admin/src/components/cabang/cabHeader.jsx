import React, { useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import AddCabangModal from './cabAdd';

const CabHeader = ({ onAddCabang }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="content--header">
      <h2 className="header--title">Cabang</h2>
      <div className="header--activity">
        <button className="add-cabang-btn" onClick={openModal}>
          <BiPlus className="icon" />
          Add Cabang
        </button>
      </div>

      {/* Modal */}
      <AddCabangModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddCabang={onAddCabang}
      />
    </div>
  );
};

export default CabHeader;
