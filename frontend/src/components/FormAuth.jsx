/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUnlock, faUser } from "@fortawesome/free-solid-svg-icons";

const FormAuth = ({ isLogin }) => {
  const initialState = isLogin
    ? { username: "", password: "" }
    : { username: "", password: "", confirmPassword: "" };
  const navigate = useNavigate();

  const [input, setInput] = useState(initialState);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [error, setError] = useState(initialState);
  const [visiblePass, setVisiblePass] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token && isLogin) {
      navigate("/products");
    }
  }, [isLogin, navigate]);

  const inputUsername = (e) => {
    const { name, value } = e.target;
    const isValidUsername = /^[a-zA-Z0-9]+$/.test(value);

    if (value === "") {
      setError((prevData) => ({ ...prevData, [name]: "Username cannot be empty." }));
    } else if (!isValidUsername) {
      setError((prevData) => ({
        ...prevData,
        [name]: "Username can only contain letters and numbers, without spaces or symbols.",
      }));
    } else {
      setError((prevData) => ({
        ...prevData,
        [name]: "",
      }));
    }

    setInput((prevData) => ({ ...prevData, [name]: value }));
  };

  const inputPassword = (e) => {
    const { name, value } = e.target;

    if (value.length < 8) {
      setError((prevData) => ({ ...prevData, [name]: "Password min 8 length" }));
    } else {
      setError((prevData) => ({
        ...prevData,
        [name]: "",
      }));
    }

    setInput((prevData) => ({ ...prevData, [name]: value }));
  };

  const inputConfirmPassword = (e) => {
    const { name, value } = e.target;

    if (value.length < 8) {
      setError((prevData) => ({ ...prevData, [name]: "Password min 8 length" }));
    } else if (value !== input.password) {
      setError((prevData) => ({
        ...prevData,
        [name]: "Confirm password don't match with password",
      }));
    } else {
      setError((prevData) => ({
        ...prevData,
        [name]: "",
      }));
    }

    setInput((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleVisible = () => {
    setVisiblePass(!visiblePass);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL + (isLogin ? "login" : "signup")}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      setTimeout(() => {
        navigate(isLogin ? "/products" : "/login");
      }, 3000);

      const message = isLogin ? "Success Login" : "Success Signup";
      setStatus({ type: "success", message });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[url(https://img.freepik.com/free-vector/dark-black-background-design-with-stripes_1017-38064.jpg?t=st=1733293984~exp=1733297584~hmac=1c070bf87e46559c93e49aa38ef2830a002963c9b723bdc63c1bf673ea32c026&w=1060)] bg-cover">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg bg-opacity-10 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center text-white">
          {" "}
          {isLogin ? "Login" : "Signup"}
        </h2>
        {status.message != "" && (
          <p className={`${status.type === "error" ? "text-red-500" : "text-green-500"} italic`}>
            {status.message}
          </p>
        )}
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4 ">
            <div className="flex items-center justify-center bg-white border border-gray-600 rounded-lg bg-opacity-10">
              <input
                className="w-full p-2 bg-white border border-gray-600 rounded-lg bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="username"
                name="username"
                type="text"
                placeholder="username"
                value={input.username}
                onChange={inputUsername}
                required
              />
              <FontAwesomeIcon className="p-2" icon={faUser} />
            </div>
            <div>
              {error.username != "" && <p className="italic text-red-500">{error.username}</p>}
            </div>
          </div>
          <div className="mb-4 ">
            <div className="flex items-center justify-center w-full bg-white border border-gray-600 rounded-lg bg-opacity-10">
              <input
                className="w-full p-2 bg-white border border-gray-600 rounded-lg bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="password"
                type={!visiblePass ? "password" : "text"}
                name="password"
                placeholder="password"
                value={input.password}
                onChange={inputPassword}
                required
              />
              <FontAwesomeIcon
                onClick={handleVisible}
                className="p-2 hover:cursor-pointer"
                icon={visiblePass ? faUnlock : faLock}
              />
            </div>
            <div>
              {error.password != "" && <p className="italic text-red-500">{error.password}</p>}
            </div>
          </div>
          {!isLogin && (
            <div className="mb-4">
              <input
                className="w-full p-2 bg-white border border-gray-600 rounded-lg bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="confirmPassword"
                type={!visiblePass ? "password" : "text"}
                name="confirmPassword"
                placeholder="confirm password"
                value={input.confirmPassword}
                onChange={inputConfirmPassword}
                required
              />
              {error.confirmPassword != "" && (
                <p className="italic text-red-500">{error.confirmPassword}</p>
              )}
            </div>
          )}
          <button
            className={`w-full p-2 mt-4 text-white bg-blue-500 bg-opacity-20 rounded-xl  transition duration-200 ${
              error.username != "" ||
              error.password != "" ||
              (!isLogin && error.confirmPassword != "")
                ? "cursor-not-allowed "
                : "cursor-pointer hover:bg-blue-600"
            } `}
            type="submit"
            disabled={
              error.username != "" || error.password || (!isLogin && error.confirmPassword != "")
                ? true
                : false
            }
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>
        <p className="mt-4 text-center">
          {isLogin ? "Don't have account ? " : "Already Have Account ? "}
          <Link className="text-blue-500" to={isLogin ? "/signup" : "/login"}>
            {isLogin ? "Signup" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FormAuth;
