import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
};

const ConfirmationModal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Confirm Action</h2>
        <p>{message}</p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
