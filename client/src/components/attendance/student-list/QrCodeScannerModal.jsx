import { QrScanner } from "@yudiel/react-qr-scanner";
import React from "react";
import Draggable from "react-draggable";

export default function QrCodeScannerModal({ toggleModal, handleQrScanned }) {
  const handleCancel = () => {
    toggleModal(false);
  };
  return (
    <div
      onClick={() => console.log("er")}
      className="fixed inset-0 flex items-center px-4 justify-center modal-backdrop bg-opacity-10 bg-green-50"
    >
      <Draggable handle="#draggable-modal">
        <div
          id="draggable-modal"
          className="modal p-1 w-full md:w-3/12 bg-gray-800 rounded-lg shadow-lg cursor-move"
        >
          <div className="w-full text-end absolute z-10">
            <div className="flex justify-end">
              <p
                onClick={handleCancel}
                className="cursor-pointer font-bold rounded-sm text-2xl me-2 text-gray-800 text-end hover:bg-gray-300 px-2"
              >
                X
              </p>
            </div>
          </div>
          <QrScanner
            onDecode={(result) => handleQrScanned(result)}
            onError={(error) => console.log(error?.message)}
          />
        </div>
      </Draggable>
    </div>
  );
}
