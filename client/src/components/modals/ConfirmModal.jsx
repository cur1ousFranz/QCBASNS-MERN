const ConfirmModal = ({ toggleModal, submit, title }) => {
  const handleConfirm = () => {
    // Trigger to submit the form
    submit(new Event("submit"));
    toggleModal(false);
  };

  const handleCancel = () => {
    toggleModal(false);
  };

  const handleBackdropCancel = (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      toggleModal(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center modal-backdrop">
      <div className="modal w-full md:w-1/3 bg-white rounded-lg shadow-lg">
        <header className="modal-header p-4">
          <p className="text-xl text-center">{title}</p>
        </header>

        <main className="p-4"></main>

        <footer className="modal-footer p-4 flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-3 py-2 border border-gray-900 text-gray-900 text-sm"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm"
            type="button"
          >
            Confirm
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmModal;
