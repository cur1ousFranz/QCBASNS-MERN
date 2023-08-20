import { createContext, useReducer } from "react";

export const SemesterContext = createContext();

const semesterReducer = (state, action) => {
  switch (action.type) {
    case "SET_SEMESTERS":
      return { semesters: action.payload };
    case "ADD_SEMESTER":
      return { semesters: [...state.semesters, action.payload] };
    default:
      return state;
  }
};

const SemesterContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(semesterReducer, {
    semesters: null,
  });

  return (
    <SemesterContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SemesterContext.Provider>
  );
};

export default SemesterContextProvider;
