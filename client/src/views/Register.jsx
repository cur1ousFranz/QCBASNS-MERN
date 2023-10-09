import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Alert } from "../utils/Alert";
import ValidationMessage from "../components/typography/ValidationMessage";
import numbersOnly from "../utils/NumberKeys";
import calculateAge from "../utils/CalculateAge";
import axiosClient from "../utils/AxiosClient";

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

  const [errorFields, setErrorFields] = useState([]);
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const [contactNumberErrorMessage, setContactNumberErrorMessage] =
    useState("");
  const [birthDateErrorMessage, setBirthDateErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [emailErrorMessage, setErrorEmailMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitSignup = async (e) => {
    e.preventDefault();
    const errors = [];
    setErrorFields(() => errors);
    setFirstNameErrorMessage("");
    setLastNameErrorMessage("");
    setBirthDateErrorMessage("");
    setPasswordErrorMessage("");
    setContactNumberErrorMessage("");

    if (!firstName) {
      errors.push("first_name");
      setFirstNameErrorMessage(() => "First name is required.");
    }
    if (!lastName) {
      errors.push("last_name");
      setLastNameErrorMessage(() => "Last name is required.");
    }
    if (!birthDate) {
      errors.push("birth_date");
      setBirthDateErrorMessage(() => "Birthdate is required.");
    }
    if (birthDate) {
      const age = calculateAge(birthDate);
      if (age <= 21) {
        errors.push("birth_date");
        setBirthDateErrorMessage(() => "Age must be 22 years old and above.");
      }
    }
    if (!email) {
      errors.push("birth_date");
      setErrorEmailMessage(() => "Email is required.");
    }
    if (!password) {
      errors.push("password");
      setPasswordErrorMessage("Password is required.");
    }
    if (password && password !== confirmPassword) {
      errors.push("password");
      setPasswordErrorMessage("Password does not match.");
    }
    if (password && password === confirmPassword && password.length < 3) {
      errors.push("password");
      setPasswordErrorMessage("Password atleast 3 characters long.");
    }
    if (contactNumber.length < 11) {
      errors.push("contact_number");
      setContactNumberErrorMessage("Contact must be 11 digits.");
    }
    if (!contactNumber) {
      errors.push("contact_number");
      setContactNumberErrorMessage(() => "Contact number is required.");
    }

    // Check if contact number starts with 09
    if (contactNumber.length === 11) {
      const numberArr = contactNumber.split("");
      const firstTwoDigit = [numberArr[0], numberArr[1]];
      if (firstTwoDigit.join("") !== "09") {
        errors.push("contact_number");
        setContactNumberErrorMessage("Invalid contact number.");
      }
    }

    const currentSuffix = showSuffix === false ? suffix : "N/A";

    if (errors.length === 0) {
      try {
        setIsLoading(true);
        const response = await axiosClient.post("/adviser", {
          first_name: firstName,
          middle_name: middleName ? middleName : "N/A",
          last_name: lastName,
          suffix: currentSuffix,
          birthdate: birthDate,
          gender,
          email,
          contact_number: contactNumber,
          password,
        });

        if (response.status === 200) {
          dispatch({ type: "LOGIN", payload: response.data });
          localStorage.setItem("user", JSON.stringify(response.data));
          Alert("Registation successful");
          setIsLoading(false);
        }
      } catch (error) {
        if (error.response.data.errorFields) {
          const errorFields = error.response.data.errorFields;
          if (errorFields.includes("email")) {
            setErrorEmailMessage(() => error.response.data.error[0]);
          }
        }
        setIsLoading(false);
      }
    } else {
      setErrorFields(() => errors);
    }
  };

  const onChangeBirthDate = (value) => {
    setBirthDate(() => value);
    const age = calculateAge(value);
    if (age < 22) {
      setBirthDateErrorMessage(() => "Age must be 22 years old and above.");
      setErrorFields(() => [errorFields, "birth_date"]);
    } else {
      setBirthDateErrorMessage("");
    }
  };

  return (
    <div className="py-32 bg-slate-50">
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
          <form onSubmit={submitSignup}>
            <div className="py-6 space-y-5">
              <div className="flex space-x-3">
                <div className="w-full">
                  <label>First Name</label>
                  <input
                    onChange={(e) => setFirstName(() => e.target.value)}
                    value={firstName}
                    name="firstname"
                    type="text"
                    className={
                      !firstNameErrorMessage
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                  {firstNameErrorMessage && (
                    <ValidationMessage message={firstNameErrorMessage} />
                  )}
                </div>
                <div className="w-full">
                  <label>
                    Middle Name <span className="text-xs">(Optional)</span>
                  </label>
                  <input
                    onChange={(e) => setMiddleName(() => e.target.value)}
                    value={middleName}
                    name="middlename"
                    type="text"
                    className="px-2 py-2 w-full bg-gray-100 rounded-md"
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
                    name="lastname"
                    className={
                      !lastNameErrorMessage
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                  {lastNameErrorMessage && (
                    <ValidationMessage message={lastNameErrorMessage} />
                  )}
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
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
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
                      !birthDateErrorMessage
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                  {birthDateErrorMessage && (
                    <ValidationMessage message={birthDateErrorMessage} />
                  )}
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
                      !emailErrorMessage
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                  />
                  {emailErrorMessage && (
                    <ValidationMessage message={emailErrorMessage} />
                  )}
                </div>
                <div className="w-full">
                  <label>Contact Number</label>
                  <input
                    onKeyDown={numbersOnly}
                    onChange={(e) => setContactNumber(() => e.target.value)}
                    value={contactNumber}
                    type="text"
                    className={
                      !contactNumberErrorMessage
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 border border-red-500 rounded-md"
                    }
                    maxLength={11}
                  />
                  {contactNumberErrorMessage && (
                    <ValidationMessage message={contactNumberErrorMessage} />
                  )}
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
                      !passwordErrorMessage
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 rounded-md border border-red-500"
                    }
                  />
                  {passwordErrorMessage && (
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
                      !passwordErrorMessage
                        ? "px-2 py-2 w-full bg-gray-100 rounded-md"
                        : "px-2 py-2 w-full bg-gray-100 rounded-md border border-red-500"
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
