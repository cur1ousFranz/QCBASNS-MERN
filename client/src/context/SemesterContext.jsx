import { createContext, useReducer } from "react";

export const SemesterContext = createContext();

const semesterReducer = (state, action) => {
  switch (action.type) {
    case "SET_SEMESTERS":
      return { semesters: action.payload };
    case "ADD_SEMESTER":
      return { semesters: [action.payload, ...state.semesters] };
    case "UPDATE_SEMESTER":
      return {
        semesters: state.semesters.map((semester) => {
          if (semester._id === action.payload._id) {
            return action.payload;
          }
          return semester;
        }),
      };
    default:
      return state;
  }
};

const SemesterContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(semesterReducer, {
    semesters: [],
  });

  return (
    <SemesterContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SemesterContext.Provider>
  );
};

export default SemesterContextProvider;
