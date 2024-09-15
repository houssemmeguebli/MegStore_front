import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProductService from "../../../_services/ProductService";
import { useNavigate } from "react-router-dom";

export default function ProductTable({ color }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await ProductService.getAllProducts();
        setProducts(data);
        console.log("Product IDs:", data.map((product) => product.productId));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, [products]);

  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleDelete = async (productId) => {
    try {
      await ProductService.deleteProduct(productId);
      setProducts(products.filter((product) => product.productId !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/admin/products/${productId}`);
  };

  return (
      <div
          className={
              "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
              (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
          }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                  className={
                      "font-semibold text-lg " +
                      (color === "light" ? "text-blueGray-700" : "text-white")
                  }
              >
                Product Table
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
            <tr>
              {["Product Name", "Price", "Stock Quantity", "Image","Actions"].map(
                  (heading) => (
                      <th
                          key={heading}
                          className={
                              "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                              (color === "light"
                                  ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                  : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                          }
                      >
                        {heading}
                      </th>
                  )
              )}
            </tr>
            </thead>
            <tbody>
            {products.map((product) => (
                <tr key={product.productId}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  <span
                      className={
                          "font-bold " +
                          (color === "light" ? "text-blueGray-600" : "text-white")
                      }
                  >
                    {product.productName}
                  </span>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    ${product.productPrice}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {product.stockQuantity}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <img
                        src={`https://localhost:7048/${product.imageUrl}`}
                        alt={product.productName}
                        className="h-12 w-12 object-cover rounded border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                    />
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <IconButton
                          onClick={() => handleDelete(product.productId)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                          onClick={() => handleViewDetails(product.productId)}
                          className="text-green-500 hover:text-green-700"
                          title="View Details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}

ProductTable.defaultProps = {
  color: "light",
};

ProductTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
