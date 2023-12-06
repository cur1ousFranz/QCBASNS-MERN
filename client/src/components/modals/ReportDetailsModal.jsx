import ConvertDate from "../../utils/ConvertDate";
import ConvertTime from "../../utils/ConvertTime";
import { REPORT } from "../../constants/Report";
const ReportDetailsModal = ({ toggleModal, title, body }) => {
  const handleClose = () => {
    toggleModal(false);
  };

  console.log(body);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center modal-backdrop">
      <div className="modal w-1/2 md:w-1/4 bg-white rounded-lg shadow-lg">
        <header className="modal-header p-4">
          <p className="md:text-lg text-gray-700">
            {body.full_name ? body.full_name : ""}
          </p>
        </header>

        {body && (
          <main className="p-4 text-sm md:text-base text-gray-700">
            <p className="font-semibold">
              Time in (AM):{" "}
              <span className="font-normal">
                {body.time_in_am
                  ? `${ConvertDate(body.time_in_am)}, ${ConvertTime(
                      body.time_in_am
                    )}`
                  : "N/A"}
              </span>
            </p>
            <hr className="my-2"/>
            <p className="font-semibold">
              Time out (AM):{" "}
              <span className="font-normal">
                {body.time_out_am
                  ? `${ConvertDate(body.time_out_am)}, ${ConvertTime(
                      body.time_out_am
                    )}`
                  : "N/A"}{" "}
              </span>
            </p>
            <hr className="my-2"/>
            <p className="font-semibold">
              Time in (PM):{" "}
              <span className="font-normal">
                {body.time_in_pm
                  ? `${ConvertDate(body.time_in_pm)}, ${ConvertTime(
                      body.time_in_pm
                    )}`
                  : "N/A"}{" "}
              </span>
            </p>
            <hr className="my-2"/>
            <p className="font-semibold">
              Time out (PM):{" "}
              <span className="font-normal">
                {body.time_out_pm
                  ? `${ConvertDate(body.time_out_pm)}, ${ConvertTime(
                      body.time_out_pm
                    )}`
                  : "N/A"}{" "}
              </span>
            </p>
            <hr className="my-2"/>
            <p className="font-semibold">
              Record:{" "}
              <span className="font-normal">
                {body.record !== REPORT.NoRecord ? body.record : "N/A"}
              </span>
            </p>
          </main>
        )}

        <footer className="modal-footer p-4 flex justify-center space-x-3">
          <button
            onClick={handleClose}
            className="px-2 uppercase flex py-2 text-sm rounded-md border border-gray-900 hover:bg-gray-100 text-gray-900"
            type="button"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
