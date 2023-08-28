import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerAdviser } from "../lib/registerAdviser";
import { Alert } from "../utils/Alert";

export const Register = () => {
  const { dispatch } = useContext(AuthContext);
  const [showSuffix, setShowSuffix] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("Male");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorMiddleName, setErrorMiddleName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorContactNumber, setErrorContactNumber] = useState(false);
  const [errorBirthDate, setErrorBirthDate] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  const submitSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setErrorFirstName(false);
    setErrorMiddleName(false);
    setErrorLastName(false);
    setErrorBirthDate(false);
    setErrorContactNumber(false);
    setErrorEmail(false);
    setErrorPassword(false);

    if (password && password !== confirmPassword) {
      setErrorPassword(true);
      return;
    }

    const currentSuffix = showSuffix === false ? suffix : "";
    try {
      const data = await registerAdviser(
        firstName,
        middleName,
        lastName,
        currentSuffix,
        birthDate,
        gender,
        email,
        contactNumber,
        password
      );

      dispatch({ type: "LOGIN", payload: data });
      localStorage.setItem("user", JSON.stringify(data));
      Alert("Registation successful");
    } catch (error) {
      if (error.response.data.error === "Please fill in all fields") {
        setErrorMessage(error.response.data.error);
      }
      if (error.response.data.error === "Email is invalid.") {
        setErrorMessage(error.response.data.error);
        setErrorEmail(true);
      }
      if (error.response.data.errorFields) {
        if (error.response.data.errorFields.includes("first_name"))
          setErrorFirstName(true);
        if (error.response.data.errorFields.includes("middle_name"))
          setErrorMiddleName(true);
        if (error.response.data.errorFields.includes("last_name"))
          setErrorLastName(true);
        if (error.response.data.errorFields.includes("birthdate"))
          setErrorBirthDate(true);
        if (error.response.data.errorFields.includes("contact_number"))
          setErrorContactNumber(true);
        if (error.response.data.errorFields.includes("email"))
          setErrorEmail(true);
        if (error.response.data.errorFields.includes("password"))
          setErrorPassword(true);
      }
    }
  };

  return (
    <div class="py-32 bg-slate-50" style={{ minHeight: "100vh"}}>
      <div className="relative border mx-auto shadow-sm rounded-md px-6 py-4 w-10/12 md:w-4/12 bg-white">
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: 'url("/img/large-logo.png")',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right",
            backgroundSize: "90%",
            backgroundPositionY: "center",
            backgroundPositionX: "center",
          }}
        ></div>
        <div className="relative z-10">
          <h1 className="font-semibold text-2xl mb-1">Register</h1>
          {errorMessage && (
            <p className="text-sm absolute text-red-500">{errorMessage}</p>
          )}
          <form onSubmit={submitSignup}>
            <div className="py-6 space-y-5">
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>First Name</label>
                  <input
                    onChange={(e) => setFirstName(() => e.target.value)}
                    value={firstName}
                    type="text"
                    className={
                      !errorFirstName
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                </div>
                <div className="w-full">
                  <label>Middle Name</label>
                  <input
                    onChange={(e) => setMiddleName(() => e.target.value)}
                    value={middleName}
                    type="text"
                    className={
                      !errorMiddleName
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>Last Name</label>
                  <input
                    onChange={(e) => setLastName(() => e.target.value)}
                    value={lastName}
                    type="text"
                    className={
                      !errorLastName
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                </div>
                <div className="w-full">
                  <div className="flex justify-between">
                    <label>Suffix (Optional)</label>
                    <input
                      onChange={() => setShowSuffix(() => !showSuffix)}
                      type="checkbox"
                      className="w-3 h-3 mt-2 bg-gray-100 rounded border-gray-300 focus:ring-gray-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 accent-gray-500"
                    />
                  </div>
                  <select
                    onChange={(e) => setSuffix(e.target.value)}
                    defaultValue={"Select"}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                    disabled={showSuffix}
                  >
                    <option value="Select" disabled>
                      Select
                    </option>
                    <option value="Jr">Jr</option>
                    <option value="Sr">Sr</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>Birthdate</label>
                  <input
                    onChange={(e) => setBirthDate(e.target.value)}
                    value={birthDate}
                    type="date"
                    className={
                      !errorBirthDate
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                </div>
                <div className="w-full">
                  <label>Gender</label>
                  <select
                    onChange={(e) => setGender(() => e.target.value)}
                    value={gender}
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>Email</label>
                  <input
                    onChange={(e) => setEmail(() => e.target.value)}
                    value={email}
                    type="text"
                    className={
                      !errorEmail
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                </div>
                <div className="w-full">
                  <label>Contact Number</label>
                  <input
                    onChange={(e) => setContactNumber(() => e.target.value)}
                    value={contactNumber}
                    type="text"
                    className={
                      !errorContactNumber
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>Password</label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    className={
                      errorPassword
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md border border-red-500"
                        : "px-2 py-2 w-full bg-gray-100 rounded-md"
                    }
                  />
                  {password && errorPassword && (
                    <p className="text-sm absolute text-red-500">
                      Password does not match.
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label>Confirm Password</label>
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    type="password"
                    className={
                      errorPassword
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md border border-red-500"
                        : "px-2 py-2 w-full bg-gray-100 rounded-md"
                    }
                  />
                </div>
              </div>
              <div className="py-3">
                <button className="px-2 py-2 w-full rounded-md text-white bg-gray-500 hover:bg-gray-400">
                  Sign up
                </button>
              </div>
              <hr />
              <p className="text-sm ">
                Already have an account?{" "}
                <Link to={"/login"} className="underline text-blue-500">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
