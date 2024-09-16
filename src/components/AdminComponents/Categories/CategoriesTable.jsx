import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {Card, CardContent, Grid, IconButton, Pagination, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";
import CategoryService from "../../../_services/CategoryService";
import { useNavigate } from "react-router-dom";

export default function CategoriesTable() {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage] = useState(5); // Number of categories per page
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await CategoryService.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    }, []);

    const handleDelete = async (categoryId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
            });
            if (result.isConfirmed) {
                await CategoryService.deleteCategory(categoryId);
                setCategories(categories.filter((category) => category.categoryId !== categoryId));
                Swal.fire(
                    'Deleted!',
                    'Your category has been deleted.',
                    'success'
                );
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const handleViewDetails = (categoryId) => {
        navigate(`/admin/categories/${categoryId}`);
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    // Pagination logic
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

    // Statistics
    const totalCategories = categories.length;
    const totalPages = Math.ceil(totalCategories / categoriesPerPage);

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-lg text-blueGray-700">Categories Table</h3>
                    </div>
                </div>
            </div>

            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                    <tr>
                        {["Category Name", "Description",""].map((heading) => (
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
                    {currentCategories.map((category) => (
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
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 flex  items-center justify-center">
                <Pagination
                    count={Math.ceil(categories.length / categoriesPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </div>

            <Card variant="outlined" sx={{ marginBottom: 2 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="subtitle1">
                                Total Categories: {totalCategories}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="subtitle1">
                                Categories per Page: {categoriesPerPage}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="subtitle1">
                                Total Pages: {totalPages}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

        </div>
    );
}

CategoriesTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
