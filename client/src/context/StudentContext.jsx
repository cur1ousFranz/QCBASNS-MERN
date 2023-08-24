import { createContext, useReducer } from "react";

export const StudentContext = createContext();

const studentReducer = (state, action) => {
  switch (action.type) {
    case "SET_SEMESTER_STUDENTS":
      return { students: action.payload };
    case "ADD_STUDENT":
      return { students: [...state.students, action.payload] };
    default:
      return state;
  }
};

const StudentContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(studentReducer, {
    students: null,
  });

  return (
    <StudentContext.Provider value={{ ...state, dispatch }}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentContextProvider;
