import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Error from "../components/Error";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      setisLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}products`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/login");
      }

      if (!response.ok) {
        // throw new Error("Internal server error");
        throw {
          statuscode: response.status || 500,
          message: response.statusText || "Internal server error",
        };
      }

      const data = await response.json();

      setProducts(data.products);
    } catch (error) {
      setError(error);
    }
    setisLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen ">
        <h1 className="mb-4 text-3xl font-bold text-white">Loading....</h1>
      </div>
    );
  }

  if (error !== null) {
    return <Error code={error.statuscode} message={error.message} />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex p-6">
        <Link
          to={"/products/add"}
          className="px-6 py-3 text-white transition-all duration-200 ease-in-out bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Add Product
        </Link>
      </div>

      {products.length <= 0 && (
        <div className="flex items-center justify-center min-h-screen text-center">
          <h1 className="text-3xl font-bold">Empty Products</h1>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        {products.length > 0 &&
          products.map((product) => (
            <div
              key={product.ID}
              className="p-4 transition duration-200 ease-in-out bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl"
            >
              <h2 className="mb-2 text-xl font-bold text-white">{product.Name}</h2>
              <p className="mb-4 text-gray-400">{product.Description}</p>
              <div className="flex items-center justify-between mb-4 text-sm text-gray-300">
                <span className="px-2 py-1 bg-gray-700 rounded">Stock: {product.Stock}</span>
                <span className="px-2 py-1 bg-gray-700 rounded">
                  Rp {product.Price.toLocaleString("id-ID")}
                </span>
              </div>
              <button className="w-full px-4 py-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-600">
                Add to Cart
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductsPage;
