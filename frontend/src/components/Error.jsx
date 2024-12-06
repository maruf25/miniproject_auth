/* eslint-disable react/prop-types */

import { useNavigate } from "react-router";

const Error = ({ code, message }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <h1 className="mb-4 text-6xl font-bold text-red-500">{code || "Error"}</h1>
      <p className="mb-8 text-xl text-red-500">{message || "Oops! Something went wrong."}</p>
      <button
        onClick={handleGoHome}
        className="px-6 py-3 text-white transition bg-blue-500 rounded-md bg-opacity-10 hover:bg-blue-600"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Error;
