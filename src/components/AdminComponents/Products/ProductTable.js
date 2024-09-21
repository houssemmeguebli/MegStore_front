import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, MenuItem, Select, FormControl, InputLabel, Pagination } from "@mui/material";
import Swal from "sweetalert2";
import ProductService from "../../../_services/ProductService";
import { useNavigate } from "react-router-dom";

// Emoji for actions
const viewIcon = "👁️";
const deleteIcon = "🗑️";

export default function ProductTable({ color }) {
  const [products, setProducts] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6); // Number of products per page
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await ProductService.getAllProducts();
        const data = response.map(product => ({
          ...product,
          imageUrls: Array.isArray(product.imageUrls) ? product.imageUrls : [] // Ensure imageUrls is an array
        }));
        setProducts(data);
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
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await ProductService.deleteProduct(productId);
        setProducts(products.filter((product) => product.productId !== productId));
        Swal.fire("Deleted!", "The product has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire("Error!", "There was an issue deleting the product.", "error");
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/admin/products/${productId}`);
  };

  const handleStatusFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Filter and paginate products
  const filteredProducts = products.filter(product => {
    if (filterStatus === "all") return true;
    return filterStatus === "available" ? product.isAvailable : !product.isAvailable;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
      <div
          className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${
              color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"
          }`}
      >
        <div className="flex p-4 border-b-2 border-gray-200">
          <FormControl variant="outlined" className="w-1/4 mr-4">
            <InputLabel>Status</InputLabel>
            <Select
                value={filterStatus}
                onChange={handleStatusFilterChange}
                label="Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="notAvailable">Not Available</MenuItem>
            </Select>
          </FormControl>
          {/* New section for additional controls or filters */}
          <div className="flex-grow text-right">
            <button
                onClick={() => navigate('/admin/products/add')}
                className={`bg-blue-500 text-white px-4 py-2 rounded ${color === "light" ? "hover:bg-blue-600" : "hover:bg-blue-400"}`}
            >
              Add New Product
            </button>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse ">
            <thead>
            <tr>
              {["Product Name", "Price", "Stock Quantity", "Image",""].map(
                  (heading) => (
                      <th
                          key={heading}
                          className={`px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ${
                              color === "light"
                                  ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                  : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700"
                          }`}
                      >
                        {heading}
                      </th>
                  )
              )}
            </tr>
            </thead>
            <tbody>
            {currentProducts.map((product) => (
                <tr key={product.productId} className="font-bold">
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  <span
                      className={`font-bold ${
                          color === "light" ? "text-blueGray-600" : "text-white"
                      }`}
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
                    {product.imageUrls.length > 0 ? (
                        <img
                            src={`https://localhost:7048/${product.imageUrls[0]}`} // Assumes imageUrls is an array
                            alt={product.productName}
                            className="h-16 w-16 object-cover rounded border"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                        />
                    ) : (
                        <img
                            src="https://via.placeholder.com/150"
                            alt="No image"
                            className="h-16 w-16 object-cover rounded border"
                        />
                    )}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <IconButton
                          onClick={() => handleDelete(product.productId)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                      >
                        <span className="text-xl">{deleteIcon}</span>
                      </IconButton>
                      <IconButton
                          onClick={() => handleViewDetails(product.productId)}
                          className="text-green-500 hover:text-green-700"
                          title="View Details"
                      >
                        <span className="text-xl">{viewIcon}</span>
                      </IconButton>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-center items-center">
          <Pagination
              count={Math.ceil(filteredProducts.length / productsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
          />
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
