import { createContext, useReducer } from "react";

export const AdviserContext = createContext();

export const ADVISER_CONTEXT_TYPES = {
  SET_ADVISER: "SET_ADVISER",
};

const adviserReducer = (state, action) => {
  switch (action.type) {
    case ADVISER_CONTEXT_TYPES.SET_ADVISER:
      return { adviser: action.payload };
    default:
      return state;
  }
};

const AdviserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adviserReducer, {
    adviser: null,
  });

  return (
    <AdviserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AdviserContext.Provider>
  );
};

export default AdviserContextProvider;
