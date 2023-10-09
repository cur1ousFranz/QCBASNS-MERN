import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

const QrCodeModal = ({ toggleModal, title, student }) => {
  const [studentQrValue, setStudentQrValue] = useState(null);
  const qrContentRef = useRef(null);

  useEffect(() => {
    const qrValue = {
      _id: student._id,
      school_id: student.school_id,
      first_name: student.first_name,
      middle_name: student.middle_name,
      last_name: student.last_name,
    };
    setStudentQrValue(() => qrValue);
  }, []);

  const handlePrint = () => {
    const printContents = qrContentRef.current.innerHTML;

    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);

    const printDocument =
      printFrame.contentDocument || printFrame.contentWindow.document;

    printDocument.head.innerHTML = `
      <style>
        @media print {
          /* Adjust the scale as needed */
          body {
            transform: scale(0.50); /* Modify the scale factor */
            transform-origin: top left;
          }
        }
      </style>
    `;
    printDocument.body.innerHTML = printContents;
    printFrame.contentWindow.print();

    document.body.removeChild(printFrame);
  };

  const handleCancel = () => toggleModal(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center modal-backdrop bg-opacity-50 bg-gray-50">
      <div className="modal w-full md:w-1/4 overflow-y-auto bg-white rounded-lg shadow-lg">
        <header className="modal-header px-4 mt-4 flex justify-between">
          <p className="text-sm md:text-lg lg:text-lg">Printable QR Code</p>
          <img
            onClick={handleCancel}
            className="rounded-md p-1 cursor-pointer hover:bg-gray-200"
            src="/img/close.svg"
            alt=""
          />
        </header>

        <main className="px-4 shadow-sm py-6 h-80 overflow-y-auto">
          <div ref={qrContentRef} className="print-center">
            <div className="flex justify-center mx-auto w-full">
              {studentQrValue && (
                <QRCode
                  title={`${student.first_name} ${
                    student.middle_name !== "N/A" ? student.middle_name : ""
                  } ${student.last_name}`}
                  value={JSON.stringify(studentQrValue)}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  size={200}
                />
              )}
            </div>
            <p className="text-sm mt-2 font-semibold text-center">
              LRN: {student.school_id}
            </p>
            <p className="text-sm font-semibold text-center">{title}</p>
          </div>
        </main>

        <footer className="modal-footer p-4 flex justify-end space-x-3">
          <button
            onClick={handlePrint}
            type="submit"
            form="semester-form"
            className="px-2 py-1 border text-sm rounded-md text-gray-700 border-gray-700 hover:bg-gray-100"
          >
            <span>
              <img className="inline-block me-2" src="/img/print.svg" alt="" />
            </span>
            Print QR
          </button>
        </footer>
      </div>
    </div>
  );
};

export default QrCodeModal;
