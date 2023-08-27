const ErrorModal = ({ toggleModal, title }) => {
    const handleConfirm = () => {
      toggleModal(false);
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center modal-backdrop">
        <div className="modal w-full md:w-1/5 bg-red-100 rounded-lg shadow-lg">
          <header className="modal-header p-4 flex justify-center space-x-4">
            <img src="/img/warning.svg" alt="" />
            <p className="text-lg text-center">{title}</p>
          </header>
  
          <footer className="modal-footer p-4 flex justify-center space-x-3">
            <button
              onClick={handleConfirm}
              className="px-3 py-2 rounded-md bg-gray-500 hover:bg-gray-700 text-white text-sm"
              type="button"
            >
              OK
            </button>
          </footer>
        </div>
      </div>
    );
  };
  
  export default ErrorModal;
  