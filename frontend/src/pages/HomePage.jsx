import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative z-10">
        <div className="relative z-10 p-8 text-center rounded-lg">
          <div className="relative z-20">
            <h1 className="mb-4 text-4xl font-bold text-white">Welcome to Our Website</h1>
            <p className="mb-6 text-lg text-gray-400">
              Explore the best services and features we offer. Get started now!
            </p>
            <button
              onClick={handleLoginClick}
              className="px-6 py-3 text-lg font-semibold text-white transition duration-300 bg-gray-700 rounded-lg shadow-md hover:bg-blue-800"
            >
              Login
            </button>
          </div>
        </div>

        <div className="absolute top-0 left-0 z-0 w-20 h-20 transform bg-red-300 rounded-full shadow-lg blur-2xl bg-opacity-60 backdrop-blur-lg"></div>

        <div className="absolute z-0 w-20 h-20 transform -translate-y-1/2 bg-blue-300 rounded-full shadow-lg bottom-5 right-5 bg-opacity-60 blur-2xl backdrop-blur-lg"></div>
      </div>
    </div>
  );
};

export default HomePage;
