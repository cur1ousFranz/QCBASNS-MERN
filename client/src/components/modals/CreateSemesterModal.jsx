import { useEffect, useState } from "react";
import axiosClient from "../../utils/AxiosClient";
import { Alert } from "../../utils/Alert";
import ErrorModal from "./ErrorModal";
import UpperCaseWords from "../../utils/UpperCaseWords";
import ValidationMessage from "../typography//ValidationMessage";

const CreateSemesterModal = ({
  toggleModal,
  setSemesterList,
  getAllSemester,
}) => {
  const [semester, setSemester] = useState("1");
  const [gradeLevel, setGradeLevel] = useState("12");
  const [track, setTrack] = useState("");
  const [selectedStrand, setSelectedStrand] = useState("N/A");
  const [section, setSection] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [timein_am, setTimeinAm] = useState("");
  const [timeout_am, setTimeoutAm] = useState("");
  const [timein_pm, setTimeinPm] = useState("");
  const [timeout_pm, setTimeoutPm] = useState("");

  const [errorStrand, setErrorStrand] = useState(false);
  const [errorSection, setErrorSection] = useState(false);

  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 2 }, (_, index) => currentYear + index);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isVerificationChecked, setIsVerificationChecked] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [amTimeInErrorMessage, setAmTimeInErrorMessage] = useState("");
  const [amTimeOutErrorMessage, setAmTimeOutErrorMessage] = useState("");
  const [pmTimeInErrorMessage, setPmTimeInErrorMessage] = useState("");
  const [pmTimeOutErrorMessage, setPmTimeOutErrorMessage] = useState("");
  const [lastSelectedMeridiem, setLastSelectedMeridiem] = useState("");

  // const { semesterList, dispatch } = useContext(SemesterContext);

  useEffect(() => {
    const getAllTracks = async () => {
      try {
        const response = await axiosClient.get("/track");
        if (response.status === 200 && response.data.length) {
          setTracks(() => response.data);
          const firstTrack = response.data[0];
          setTrack(() => firstTrack.name);
        } else {
          setShowErrorModal(true);
        }
      } catch (error) {
        setErrorModalMessage(error.message);
      }
    };

    getAllTracks();

    setStartYear(() => years[0]);
    setEndYear(() => years[1]);
  }, []);

  useEffect(() => {
    tracks.forEach((t, index) => {
      if (t.name === track) {
        setCurrentTrackIndex(() => index);
        setSelectedStrand(() => "N/A");
      }
    });
  }, [track]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorStrand(false);
    setErrorSection(false);

    let hasError = false;
    if (
      tracks[currentTrackIndex].strand.length > 0 &&
      selectedStrand === "N/A"
    ) {
      setErrorStrand(true);
      hasError = true;
    }
    if (!section) {
      setErrorSection(true);
      hasError = true;
    }

    if (!timein_am) {
      setAmTimeInErrorMessage("Time-in is required.");
      hasError = true;
    }
    if (!timeout_am) {
      setAmTimeOutErrorMessage("Time-out is required.");
      hasError = true;
    }
    if (!timein_pm) {
      setPmTimeInErrorMessage("Time-in is required.");
      hasError = true;
    }
    if (!timeout_pm) {
      setPmTimeOutErrorMessage("Time-out is required.");
      hasError = true;
    }

    const newSemester = {
      semester,
      grade_level: gradeLevel,
      track,
      strand: selectedStrand,
      section: UpperCaseWords(section),
      start_year: startYear,
      end_year: endYear,
      active: true,
      timein_am,
      timeout_am,
      timein_pm,
      timeout_pm,
    };

    if (
      !hasError &&
      !amTimeInErrorMessage &&
      !amTimeOutErrorMessage &&
      !pmTimeInErrorMessage &&
      !pmTimeOutErrorMessage
    ) {
      try {
        const response = await axiosClient.post(`/semester`, newSemester);
        if (response.status === 200) {
          getAllSemester();
          toggleModal(false);
          Alert("Semester Created");
        }
      } catch (error) {
        setErrorModalMessage(error.message);
      }
    }
  };

  const handleCancel = (value = false) => {
    toggleModal(value);
  };

  // AM TIME ONCHANGE
  const handleAmTimeChange = (e, meridiem, time) => {
    if (time === "timein") {
      setTimeinAm(e.target.value);
    } else {
      setTimeoutAm(e.target.value);
    }

    setLastSelectedMeridiem(meridiem);
    setAmTimeInErrorMessage("");
    setAmTimeOutErrorMessage("");

    const selectedTime = e.target.value;
    const [hours] = selectedTime.split(":").map((value) => parseInt(value, 10));

    if (hours >= 12) {
      if (time === "timein") {
        setAmTimeInErrorMessage("Time must be AM.");
      } else {
        setAmTimeOutErrorMessage("Time must be AM.");
      }
      e.target.value = "";
    }
  };

  // PM TIME ONCHANGE
  const handlePmTimeChange = (e, meridiem, time) => {
    setLastSelectedMeridiem(meridiem);
    setPmTimeInErrorMessage("");
    setPmTimeOutErrorMessage("");

    if (time === "timein") {
      setTimeinPm(e.target.value);
    } else {
      setTimeoutPm(e.target.value);
    }

    const selectedTime = e.target.value;
    const [hours] = selectedTime.split(":").map((value) => parseInt(value, 10));

    if (hours < 12) {
      if (time === "timein") {
        setPmTimeInErrorMessage("Time must be PM.");
      } else {
        setPmTimeOutErrorMessage("Time must be PM.");
      }
      e.target.value = "";
    }
  };

  // AM TIME EFFECT
  useEffect(() => {
    if (lastSelectedMeridiem === "AM") {
      const [timeinHour, timeinMinutes] = timein_am
        .split(":")
        .map((value) => parseInt(value, 10));
      const [timeoutHour, timeoutMinutes] = timeout_am
        .split(":")
        .map((value) => parseInt(value, 10));

      if (timeinHour > timeoutHour) {
        setAmTimeInErrorMessage("Time-in must be early.");
      }
      if (timeinHour === timeoutHour) {
        if (timeinMinutes >= timeoutMinutes) {
          setAmTimeInErrorMessage("Time-in must be early.");
        }
      }
    }
  }, [timein_am, timeout_am]);

  // PM TIME EFFECT
  useEffect(() => {
    if (lastSelectedMeridiem === "PM") {
      const [timeinHour, timeinMinutes] = timein_pm
        .split(":")
        .map((value) => parseInt(value, 10));
      const [timeoutHour, timeoutMinutes] = timeout_pm
        .split(":")
        .map((value) => parseInt(value, 10));

      if (timeinHour > timeoutHour) {
        setPmTimeInErrorMessage("Time-in must be early.");
      }
      if (timeinHour === timeoutHour) {
        if (timeinMinutes > timeoutMinutes) {
          setPmTimeInErrorMessage("Time-in must be early.");
        }
      }
    }
  }, [timein_pm, timeout_pm]);

  return (
    <div className="fixed inset-0 flex items-center justify-center modal-backdrop bg-opacity-50 bg-gray-50">
      <div className="modal w-full my-auto md:w-8/12 lg:w-6/12 bg-white rounded-lg shadow-lg">
        <header className="modal-header mt-4 py-3">
          <p className="text-lg">
            <span className="inline-block me-1">
              <img src="/img/plus.svg" alt="" />
            </span>
            New Semester
          </p>
        </header>

        <main className="px-4 h-96 overflow-y-auto">
          <form id="semester-form" onSubmit={handleFormSubmit}>
            <div className="py-6 space-y-5">
              <div className="flex space-x-3">
                {/* TIMEIN AM */}
                <div className="w-full relative">
                  <label>Time In (AM)</label>
                  <input
                    // value={section}
                    onChange={(e) => handleAmTimeChange(e, "AM", "timein")}
                    type="time"
                    className={
                      !amTimeInErrorMessage
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                  {amTimeInErrorMessage && (
                    <ValidationMessage message={amTimeInErrorMessage} />
                  )}
                </div>
                {/* TIMEOUT AM */}
                <div className="w-full relative">
                  <label>Time Out (AM)</label>
                  <input
                    // value={section}
                    onChange={(e) => handleAmTimeChange(e, "AM", "timeout")}
                    type="time"
                    className={
                      !amTimeOutErrorMessage
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                  {amTimeOutErrorMessage && (
                    <ValidationMessage message={amTimeOutErrorMessage} />
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                {/* TIMEIN PM */}
                <div className="w-full relative">
                  <label>Time In (PM)</label>
                  <input
                    // value={section}
                    onChange={(e) => handlePmTimeChange(e, "PM", "timein")}
                    type="time"
                    className={
                      !pmTimeInErrorMessage
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                  {pmTimeInErrorMessage && (
                    <ValidationMessage message={pmTimeInErrorMessage} />
                  )}
                </div>
                {/* TIMEOUT PM */}
                <div className="w-full relative">
                  <label>Time Out (PM)</label>
                  <input
                    // value={section}
                    onChange={(e) => handlePmTimeChange(e, "PM", "timeout")}
                    type="time"
                    className={
                      !pmTimeOutErrorMessage
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                  {pmTimeOutErrorMessage && (
                    <ValidationMessage message={pmTimeOutErrorMessage} />
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full">
                  {/* SEMESTER */}
                  <label>Semester</label>
                  <select
                    onChange={(e) => setSemester(() => e.target.value)}
                    value={semester}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  >
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                  </select>
                </div>
                {/* GRADELEVEL */}
                <div className="w-full">
                  <label>Grade Level</label>
                  <select
                    onChange={(e) => setGradeLevel(() => e.target.value)}
                    value={gradeLevel}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  >
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>
              </div>
              {/* TRACK */}
              <div className="w-full">
                <label>Track</label>
                <select
                  onChange={(e) => setTrack(() => e.target.value)}
                  value={track}
                  className="px-2 py-2 w-full bg-gray-100 rounded-md"
                >
                  {tracks.length > 0 &&
                    tracks.map((track, index) => (
                      <option key={track._id} value={track.name}>
                        {track.name}
                      </option>
                    ))}
                </select>
              </div>
              {/* STRAND */}
              {tracks.length > 0 &&
                tracks[currentTrackIndex] &&
                tracks[currentTrackIndex].strand.length > 0 && (
                  <div className="relative">
                    <div
                      className={
                        !errorStrand
                          ? "w-full bg-gray-100 p-4 rounded-md"
                          : "w-full bg-gray-100 p-4 rounded-md border border-red-500"
                      }
                    >
                      <label>Select Strand</label>
                      <div className="grid grid-cols-2 mt-2">
                        {tracks[currentTrackIndex].strand.map(
                          (strand, index) => (
                            <div key={strand._id} className="space-x-3">
                              <input
                                onChange={() =>
                                  setSelectedStrand(strand.strand_name)
                                }
                                type="radio"
                                name="strand"
                                checked={
                                  strand.strand_name === selectedStrand
                                    ? true
                                    : false
                                }
                              />
                              <label>{strand.strand_name}</label>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    {errorStrand && (
                      <ValidationMessage message="Must select strand." />
                    )}
                  </div>
                )}
              {/* SECTION */}
              <div className="relative">
                <div className="flex space-x-3">
                  <div className="w-full">
                    <label>Section</label>
                    <input
                      onChange={(e) => setSection(() => e.target.value)}
                      value={section}
                      type="text"
                      className={
                        !errorSection
                          ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                          : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                      }
                    />
                  </div>
                </div>
                {errorSection && (
                  <ValidationMessage message="Section is required." />
                )}
              </div>
              {/* SCHOOL YEAR */}
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>School Year</label>
                  <div className="flex space-x-4">
                    <input
                      disabled
                      value={startYear}
                      type="text"
                      className="px-2 py-2 w-full bg-gray-100 rounded-md text-gray-600"
                    />
                    <p className="font-bold mt-2 text-gray-600">—</p>
                    <input
                      disabled
                      value={endYear}
                      type="text"
                      className="px-2 py-2 w-full bg-gray-100 rounded-md text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <input
                onChange={() =>
                  setIsVerificationChecked(() => !isVerificationChecked)
                }
                type="checkbox"
                className="w-3 h-3 mt-1 bg-gray-100 rounded border-gray-300 focus:ring-gray-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 accent-gray-500"
              />
              <p className="text-sm text-gray-700">
                By proceeding to create a new semester, the previous semester
                will be set to inactive.
              </p>
            </div>
          </form>
        </main>

        <footer className="modal-footer p-4 flex justify-end space-x-3">
          <button
            onClick={() => handleCancel()}
            className="px-2 uppercase flex py-2 text-sm rounded-md border border-gray-900 hover:bg-gray-100 text-gray-900"
            type="button"
          >
            Cancel
          </button>
          <button
            className={
              !isVerificationChecked
                ? "px-2 uppercase flex py-2 text-sm rounded-md bg-green-300 text-white"
                : "px-2 uppercase flex py-2 text-sm rounded-md text-white bg-green-500 hover:bg-green-400"
            }
            type="submit"
            form="semester-form"
            disabled={!isVerificationChecked}
          >
            Creat Semester
          </button>
        </footer>
      </div>

      {showErrorModal && (
        <ErrorModal
          toggleModal={handleCancel}
          title={"Something went wrong!"}
        />
      )}

      {errorModalMessage && <ErrorModal title={errorModalMessage} />}
    </div>
  );
};

export default CreateSemesterModal;
