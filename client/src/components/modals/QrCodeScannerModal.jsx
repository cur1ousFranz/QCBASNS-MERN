import { QrScanner } from "@yudiel/react-qr-scanner";
import React from "react";
import Draggable from "react-draggable";
import { Alert } from "../../utils/Alert";

export default function QrCodeScannerModal({
  toggleModal,
  handleQrScanned,
  showScannerError,
  showScannerSuccess,
  showScannerDefault,
  setShowScannerError,
  setLastScannedStudentId,
}) {
  const handleCancel = () => {
    toggleModal(false);
    setLastScannedStudentId("");
  };
  return (
    <div className="fixed inset-0 flex items-center px-4 justify-center modal-backdrop bg-opacity-10 bg-green-50">
      <Draggable handle="#draggable-modal">
        <div
          id="draggable-modal"
          className={
            showScannerError
              ? "modal p-1 w-full md:w-3/12 bg-red-500 rounded-lg shadow-lg cursor-move"
              : showScannerSuccess
              ? "modal p-1 w-full md:w-3/12 bg-green-500 rounded-lg shadow-lg cursor-move"
              : showScannerDefault
              ? "modal p-1 w-full md:w-3/12 bg-gray-800 rounded-lg shadow-lg cursor-move"
              : "modal p-1 w-full md:w-3/12 bg-gray-800 rounded-lg shadow-lg cursor-move"
          }
        >
          <div className="w-full text-end absolute z-10">
            <div className="flex justify-end">
              <p
                onClick={handleCancel}
                className="cursor-pointer font-bold rounded-sm text-2xl me-2 text-gray-800 text-end bg-gray-300 px-2"
              >
                X
              </p>
            </div>
          </div>
          <QrScanner
            onDecode={(result) => {
              try {
                handleQrScanned(JSON.parse(result));
              } catch (error) {
                setShowScannerError(true);
                Alert("Invalid QR Code", "error");
              }
            }}
            onError={(error) => {
              setShowScannerError(true);
              Alert("Invalid QR Code", "error");
            }}
          />
        </div>
      </Draggable>
    </div>
  );
}
