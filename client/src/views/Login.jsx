import React, { useContext, useState } from "react";
import { loginUser } from "../lib/loginUser";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { dispatch } = useContext(AuthContext);

  const submitForm = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await loginUser(email, password);
      dispatch({ type: "LOGIN", payload: data });
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      if (error.response.data.error) {
        setError(error.response.data.error);
      }
    }
  };

  return (
    <div className="flex justify-between py-6 px-24">
      <div></div>
      <div className="border shadow-sm rounded-md px-6 py-4 w-96">
        <h1 className="font-semibold text-2xl">Log in</h1>
        <form onSubmit={submitForm}>
          <div className="py-6 space-y-5">
            <div>
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-2 py-2 w-full bg-gray-100 rounded-md"
              />
              {error && (
                <p className="text-sm absolute text-red-500">{error}</p>
              )}
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-2 py-2 w-full bg-gray-100 rounded-md"
              />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  className="w-4s h-4 bg-gray-100 rounded border-gray-300 focus:ring-gray-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 accent-gray-500"
                />
                <label className="ml-2 text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <p className="text-sm text-blue-500 underline">Forgot pasword?</p>
            </div>
            <button className="px-2 py-2 w-full rounded-md text-white bg-gray-500 hover:bg-gray-400">
              Sign in
            </button>
            <hr />
            <p className="text-sm ">
              Don't have an account yet?{" "}
              <Link to={"/register"} className="underline text-blue-500">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
