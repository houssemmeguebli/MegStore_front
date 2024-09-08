import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {Route, useNavigate} from "react-router-dom";
import CategoryService from "../../_services/CategoryService";
import ProductDetail from "../Products/ProductDetail";

export default function CategoriesTable() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await CategoryService.getAllCategories();
                setCategories(data);
                console.log("Category IDs:", data.map((category) => category.categoryId));
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    }, [categories]);

    const handleDelete = async (categoryId) => {
        try {
            await CategoryService.deleteCategory(categoryId);
            setCategories(categories.filter((category) => category.categoryId !== categoryId));
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const handleViewDetails = (categoryId) => {
        navigate(`/admin/categories/${categoryId}`);

    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-lg text-blueGray-700">
                            Categories Table
                        </h3>
                    </div>
                </div>
            </div>
            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                    <tr>
                        {["Category Name", "Description", "Actions"].map((heading) => (
                            <th
                                key={heading}
                                className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                            >
                                {heading}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((category) => (
                        <tr key={category.categoryId}>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-bold text-blueGray-600">
                                {category.categorydName}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {category.categoryDescription}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                <div className="flex justify-end space-x-2">
                                    <IconButton
                                        onClick={() => handleDelete(category.categoryId)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Delete"
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleViewDetails(category.categoryId)}
                                        className="text-green-500 hover:text-green-700"
                                        title="View Details"
                                    >
                                        <VisibilityIcon/>
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

CategoriesTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
