import React from 'react';

const ConfirmDel = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
        <p className="text-sm text-gray-600 mb-6">Yakin ingin menghapus laporan ini?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-gray-300 text-black text-base hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded bg-red-600 text-white text-base hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDel;
