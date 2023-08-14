import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerAdviser } from "../lib/registerAdviser";

export const Register = () => {
  const { dispatch } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("Jr");
  const [contactNumber, setContactNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("Male");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitSignup = async (e) => {
    e.preventDefault();
    setPasswordError(false);
    setErrorMessage("");

    if (password !== confirmPassword) {
      setPasswordError(true);
      return;
    }

    try {
      const data = registerAdviser(
        firstName,
        middleName,
        lastName,
        suffix,
        birthDate,
        gender,
        email,
        contactNumber,
        password
      );
      console.log(data);
      //   const response = await axiosClient.post("/adviser", {
      //     email,
      //     password,
      //   });
      //   const data = await response.data;
      //   if (response.status === 200) {
      //     dispatch({ type: "LOGIN", payload: data });
      //     localStorage.setItem("user", JSON.stringify(data));
      //   }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between py-6 px-24">
      <div></div>
      <div className="border shadow-sm rounded-md px-6 py-4 w-1/3">
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
                  className="px-2 py-2 w-full bg-gray-100 rounded-md"
                />
              </div>
              <div className="w-full">
                <label>Middle Name</label>
                <input
                  onChange={(e) => setMiddleName(() => e.target.value)}
                  value={middleName}
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
                  className="px-2 py-2 w-full bg-gray-100 rounded-md"
                />
              </div>
              <div className="w-full">
                <label>Suffix (Optional)</label>
                <select
                  onChange={(e) => setSuffix(e.target.value)}
                  value={suffix}
                  className="px-2 py-2 w-full bg-gray-100 rounded-md"
                >
                  <option value="Jr">Jr</option>
                  <option value="Sr">Sr</option>
                  <option value="Ma">Ma</option>
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
                  className="px-2 py-2 w-full bg-gray-100 rounded-md"
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
                  className="px-2 py-2 w-full bg-gray-100 rounded-md"
                />
              </div>
              <div className="w-full">
                <label>Contact Number</label>
                <input
                  onChange={(e) => setContactNumber(() => e.target.value)}
                  value={contactNumber}
                  type="text"
                  className="px-2 py-2 w-full bg-gray-100 rounded-md"
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
                    passwordError
                      ? "px-2 py-2 w-full bg-gray-100 rounded-md border border-red-500"
                      : "px-2 py-2 w-full bg-gray-100 rounded-md"
                  }
                />
                {passwordError && (
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
                    passwordError
                      ? "px-2 py-2 w-full bg-gray-100 rounded-md border border-red-500"
                      : "px-2 py-2 w-full bg-gray-100 rounded-md"
                  }
                />
              </div>
            </div>
            <button className="px-2 py-2 w-full rounded-md text-white bg-gray-500">
              Sign up
            </button>
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
  );
};
