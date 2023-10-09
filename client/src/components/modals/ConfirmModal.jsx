const ConfirmModal = ({ toggleModal, submit, title, body }) => {
  const handleConfirm = () => {
    // Trigger to submit the form
    submit(new Event("submit"));
    toggleModal(false);
  };

  const handleCancel = () => {
    toggleModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center modal-backdrop">
      <div className="modal w-1/2 md:w-1/4 bg-white rounded-lg shadow-lg">
        <header className="modal-header p-4">
          <p className="md:text-lg text-gray-700">{title}</p>
        </header>

        <main className="p-4 text-center text-gray-700">{body}</main>

        <footer className="modal-footer p-4 flex justify-center space-x-3">
          <button
            onClick={handleCancel}
            className="px-2 uppercase flex py-2 text-sm rounded-md border border-gray-900 hover:bg-gray-100 text-gray-900"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-2 uppercase flex py-2 text-sm rounded-md text-white bg-green-500 hover:bg-green-400"
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
