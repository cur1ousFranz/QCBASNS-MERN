import { createContext, useReducer } from "react";

export const AttendanceContext = createContext();

export const ATTENDANCE_CONTEXT_TYPES = {
  SET_SEMESTER_ATTENDANCES: "SET_SEMESTER_ATTENDANCES",
  ADD_SEMESTER_ATTENDANCE: "ADD_SEMESTER_ATTENDANCE",
  UPDATE_SEMESTER_ATTENDANCE: "UPDATE_SEMESTER_ATTENDANCE",
};

const attendanceReducer = (state, action) => {
  switch (action.type) {
    case ATTENDANCE_CONTEXT_TYPES.SET_SEMESTER_ATTENDANCES:
      return { attendances: action.payload };
    case ATTENDANCE_CONTEXT_TYPES.ADD_SEMESTER_ATTENDANCE:
      return { attendances: [action.payload, ...state.attendances] };
    case ATTENDANCE_CONTEXT_TYPES.UPDATE_SEMESTER_ATTENDANCE:
      return {
        attendances: state.attendances.map((attendance) => {
          if (attendance._id === action.payload._id) {
            return action.payload;
          }
          return attendance;
        }),
      };
    default:
      return state;
  }
};

const AttendanceContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(attendanceReducer, {
    attendances: [],
  });

  return (
    <AttendanceContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContextProvider;
