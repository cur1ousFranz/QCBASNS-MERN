import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerAdviser } from "../lib/registerAdviser";
import { Alert } from "../utils/Alert";
import ValidationMessage from "../components/typography/ValidationMessage";
import numbersOnly from "../utils/NumberKeys";
import calculateAge from "../utils/CalculateAge";

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
  const [errorMessages, setErrorMessages] = useState("");

  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const [contactNumberErrorMessage, setContactNumberErrorMessage] =
    useState("");
  const [birthDateErrorMessage, setBirthDateErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setFirstNameErrorMessage("");
    setLastNameErrorMessage("");
    setBirthDateErrorMessage("");
    setPasswordErrorMessage("");
    setContactNumberErrorMessage("");
    setHasErrors(false);
    setErrorMessages("");

    if (!firstName) {
      setFirstNameErrorMessage(() => "First Name is required.");
      setErrorFirstName(true);
    }

    if (!lastName) {
      setLastNameErrorMessage(() => "Last Name is required.");
      setErrorLastName(true);
    }

    if (!birthDate) {
      setBirthDateErrorMessage(() => "Birthdate is required.");
      setErrorBirthDate(true);
    }
    if (birthDate) {
      const age = calculateAge(birthDate);
      if (age <= 21) {
        setBirthDateErrorMessage(() => "Age must be 22 years old and above.");
        setErrorBirthDate(true);
        setHasErrors(true);
      } else {
        setBirthDateErrorMessage("");
        setHasErrors(false);
      }
    }

    if(!email) {
      setErrorMessage(() => "Email is required.")
      setErrorEmail(true);
      setHasErrors(true);
    }

    if (password && password !== confirmPassword) {
      setErrorPassword(true);
      setPasswordErrorMessage("Password does not match.");
      setHasErrors(true);
    }

    if (password === confirmPassword && password.length < 3) {
      setErrorPassword(true);
      setPasswordErrorMessage("Password atleast 3 characters long.");
      setHasErrors(true);
    }

    if (contactNumber.length < 11) {
      setContactNumberErrorMessage("Contact must be 11 digits.");
      setErrorContactNumber(true);
      setHasErrors(true);
    }

    if (!contactNumber) {
      setContactNumberErrorMessage(() => "Contact number is required.");
      setErrorContactNumber(true);
      setHasErrors(true);
    }

    // Check if contact number starts with 09
    if (contactNumber.length === 11) {
      const numberArr = contactNumber.split("");
      const firstTwoDigit = [numberArr[0], numberArr[1]];
      if (firstTwoDigit.join("") !== "09") {
        setContactNumberErrorMessage("Invalid contact number.");
        setErrorContactNumber(true);
        setHasErrors(true);
      }
    }

    const currentSuffix = showSuffix === false ? suffix : "";
    if (!hasErrors) {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
      } catch (error) {
        if (error.response.data.errorFields) {
          const errorFields = error.response.data.errorFields;
          if (errorFields.includes("first_name")) setErrorFirstName(true);
          if (errorFields.includes("middle_name")) setErrorMiddleName(true);
          if (errorFields.includes("last_name")) setErrorLastName(true);
          if (errorFields.includes("birthdate")) setErrorBirthDate(true);
          if (errorFields.includes("contact_number"))
            setErrorContactNumber(true);
          if (errorFields.includes("email")) setErrorEmail(true);
          if (errorFields.includes("password")) setErrorPassword(true);
          if (error.response.data.error[0]) {
            setErrorMessages(() => error.response.data.error[0]);
            setErrorEmail(true);
          }
        }
        setIsLoading(false);
      }
    }
  };

  const onChangeBirthDate = (value) => {
    setBirthDate(() => value);
    const age = calculateAge(value);
    if (age < 22) {
      setBirthDateErrorMessage(() => "Age must be 22 years old and above.");
      setErrorBirthDate(true);
      setHasErrors(true);
    } else {
      setBirthDateErrorMessage("");
      setHasErrors(false);
    }
  };

  return (
    <div className="py-32 bg-slate-50" style={{ minHeight: "100vh" }}>
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
                  <ValidationMessage message={firstNameErrorMessage} />
                </div>
                <div className="w-full">
                  <label>Middle Name (Optional)</label>
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
                  <ValidationMessage message={lastNameErrorMessage} />
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
                    onChange={(e) => onChangeBirthDate(e.target.value)}
                    value={birthDate}
                    type="date"
                    className={
                      !errorBirthDate
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                  <ValidationMessage message={birthDateErrorMessage} />
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
                  <ValidationMessage message={errorMessages} />
                </div>
                <div className="w-full">
                  <label>Contact Number</label>
                  <input
                    onKeyDown={numbersOnly}
                    onChange={(e) => setContactNumber(() => e.target.value)}
                    value={contactNumber}
                    type="text"
                    className={
                      !errorContactNumber
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                    maxLength={11}
                  />
                  <ValidationMessage message={contactNumberErrorMessage} />
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
                    <ValidationMessage message={passwordErrorMessage} />
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
                <button className="px-2 py-2 w-full rounded-md text-white bg-green-500 hover:bg-green-400">
                  {isLoading ? (
                    <div className="flex justify-center">
                      <img
                        className="animate-spin"
                        src="/img/loading.svg"
                        alt=""
                      />
                    </div>
                  ) : (
                    <p className="uppercase">Sign up</p>
                  )}
                </button>
              </div>
              <hr />
              <p className="text-sm ">
                Already have an account?{" "}
                <Link to={"/login"} className="underline text-blue-500">
                  Signin
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
