import React from "react";

type MessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type: "success" | "error";
};

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, message, type }) => {
  if (!isOpen) return null;

  const icon = type === "success" ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const title = type === "success" ? "Success" : "Error";

  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50" onClick={onClose}></div>
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-96">
          <div className="flex items-center mb-4">
            {icon}
            <h2 className="text-xl font-semibold text-gray-300">{title}</h2>
          </div>
          <div className="mb-4 text-gray-300" dangerouslySetInnerHTML={{ __html: message }} />
          <div className="flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageModal;
