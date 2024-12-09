import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const FormProduct = () => {
  const [input, setInput] = useState({
    name: "",
    description: "",
    stock: 0,
    price: "0",
  });

  const [error, setError] = useState({
    name: "",
    description: "",
    stock: "",
    price: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });

  const isDisabled =
    error.name != "" || error.description != "" || error.stock != "" || error.price != "";

  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + "checklogin", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          navigate("/login");
          throw new Error("User not logged in");
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkLogin();
  }, [navigate]);

  const inputText = (e) => {
    const { name, value } = e.target;

    if (value.length <= 0) {
      setError((prevData) => ({ ...prevData, [name]: `${name} can't be empty` }));
    } else {
      setError((prevData) => ({ ...prevData, [name]: "" }));
    }

    setInput((prevData) => ({ ...prevData, [name]: value }));
  };

  const inputStock = (e) => {
    let { name, value } = e.target;
    if (value <= 0) {
      setError((prevData) => ({ ...prevData, [name]: "Stock must be greather than 0" }));
    } else {
      setError((prevData) => ({ ...prevData, [name]: "" }));
    }

    if (value.length > 1) {
      value = value.replace(/^0+/, "");
    }

    setInput((prevData) => ({ ...prevData, [name]: value }));
  };

  const inputPrice = (e) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/[^\d]/g, "");
    if (rawValue <= 0) {
      setError((prevData) => ({ ...prevData, [name]: "Price must be greather than 0" }));
    } else {
      setError((prevData) => ({ ...prevData, [name]: "" }));
    }
    const formattedValue = Number(rawValue).toLocaleString("id-ID");
    setInput((prevData) => ({ ...prevData, [name]: formattedValue }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      input.price = parseInt(input.price.replace(/[^\d]/g, ""));
      input.stock = parseInt(input.stock);

      if (input.price <= 0) {
        setError((prevData) => ({ ...prevData, ["price"]: "Price must be greather than 0" }));
        return;
      }

      if (input.stock <= 0) {
        setError((prevData) => ({ ...prevData, ["stock"]: "Stock must be greather than 0" }));
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      setTimeout(() => {
        navigate("/products");
      }, 3000);

      const message = "Success Create";
      setStatus({ type: "success", message });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-lg bg-opacity-10 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center text-white">Add Product</h2>
        {status.message != "" && (
          <p className={`${status.type === "error" ? "text-red-500" : "text-green-500"} italic`}>
            {status.message}
          </p>
        )}
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white" htmlFor="name">
              Name
            </label>
            <input
              className="w-full p-2 mt-1 bg-white border border-gray-600 rounded-lg bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="name"
              name="name"
              type="text"
              placeholder="Product Name"
              value={input.name}
              onChange={inputText}
              required
            />
            {error.name != "" && <p className="italic text-red-500">{error.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white" htmlFor="description">
              description
            </label>
            <textarea
              className="w-full p-2 mt-1 bg-white border border-gray-600 rounded-lg bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="description"
              type="text"
              name="description"
              placeholder="Ukuran 20x30 cm dengan bahan premium, tahan lama"
              rows={2}
              value={input.description}
              onChange={inputText}
              required
            />
            {error.description != "" && <p className="italic text-red-500">{error.description}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white" htmlFor="stock">
              Stock
            </label>
            <input
              className="w-full p-2 mt-1 bg-white border border-gray-600 rounded-lg bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="stock"
              type="number"
              name="stock"
              placeholder="10"
              value={input.stock}
              onChange={inputStock}
              required
            />
            {error.stock != "" && <p className="italic text-red-500">{error.stock}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white" htmlFor="price">
              Price
            </label>
            <div className="flex items-center justify-center">
              <h1 className="p-2 mt-1 bg-white border-gray-600 rounded-l-lg rounded-r-none bg-opacity-10">
                Rp
              </h1>
              <input
                className="w-full p-2 mt-1 bg-white border border-gray-600 rounded-l-none rounded-r-lg bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="price"
                type="text"
                name="price"
                placeholder="200.000"
                value={input.price}
                onChange={inputPrice}
                required
              />
            </div>
            {error.price != "" && <p className="italic text-red-500">{error.price}</p>}
          </div>
          <button
            className={`w-full p-2 mt-4 text-white bg-blue-500 bg-opacity-20 rounded-xl  transition duration-200 ${
              isDisabled ? "cursor-not-allowed " : "cursor-pointer hover:bg-blue-600"
            } `}
            type="submit"
            disabled={isDisabled}
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormProduct;
