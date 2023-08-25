import { useContext, useEffect, useState } from "react";
import axiosClient from "../../utils/AxiosClient";
import { SemesterContext } from "../../context/SemesterContext";
import { Alert } from "../../utils/Alert";
import ErrorModal from "./ErrorModal";

const CreateSemesterModal = ({ toggleModal }) => {
  const [semester, setSemester] = useState("1");
  const [gradeLevel, setGradeLevel] = useState("12");
  const [track, setTrack] = useState("");
  const [selectedStrand, setSelectedStrand] = useState("N/A");
  const [section, setSection] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const [errorStrand, setErrorStrand] = useState(false);
  const [errorSection, setErrorSection] = useState(false);

  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 2 }, (_, index) => currentYear + index);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isVerificationChecked, setIsVerificationChecked] = useState(false);

  const { semesters, dispatch } = useContext(SemesterContext);

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
        console.log(error);
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

    const newSemester = {
      semester,
      grade_level: gradeLevel,
      track,
      strand: selectedStrand,
      section,
      start_year: startYear,
      end_year: endYear,
      active: true,
    };

    if (!hasError) {
      try {
        let latestSemester;
        if (semesters.length) {
          latestSemester = semesters[0];
        }

        // POP PROMPT WARNING
        const response = await axiosClient.post("/semester", newSemester);
        if (response.status === 200) {
          dispatch({ type: "ADD_SEMESTER", payload: response.data });
          // Update the latest semester to make inactive
          if (latestSemester) {
            const res = await axiosClient.put(
              `/semester/${latestSemester._id}`,
              {
                active: false,
              }
            );

            if (res.status === 200) {
              dispatch({ type: "UPDATE_SEMESTER", payload: res.data });
            }
          }

          toggleModal(false);
          Alert("Semester Added");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCancel = (value = false) => {
    toggleModal(value);
  };

  const handleBackdropCancel = (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      toggleModal(false);
    }
  };

  return (
    <div
      onClick={handleBackdropCancel}
      className="fixed inset-0 flex items-center justify-center modal-backdrop bg-opacity-50 bg-gray-50"
    >
      <div className="modal w-full md:w-1/3 overflow-y-auto bg-white rounded-lg shadow-lg">
        <header className="modal-header px-4 mt-4">
          <p className="text-xl">New Semester</p>
        </header>

        <main className="px-4">
          <form id="semester-form" onSubmit={handleFormSubmit}>
            <div className="py-6 space-y-5">
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
                  <div>
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
                      <p className="text-sm absolute text-red-500">
                        Must select strand.
                      </p>
                    )}
                  </div>
                )}
              {/* SECTION */}
              <div>
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
                  <p className="text-sm absolute text-red-500">
                    Section is required.
                  </p>
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
            className="px-3 py-2 border border-gray-900 text-gray-900 text-sm"
            type="button"
          >
            Cancel
          </button>
          <button
            className={
              !isVerificationChecked
                ? "px-3 py-2 cursor-not-allowed bg-green-400 text-white text-sm"
                : "px-3 py-2 bg-green-500 hover:bg-green-400 text-white text-sm"
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
    </div>
  );
};

export default CreateSemesterModal;
