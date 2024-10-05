import React, { useEffect, useState } from 'react';
import ProductService from "../../../_services/ProductService";
import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { FaNotesMedical } from "react-icons/fa";
import {Visibility} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

const AdminProduct = ({ adminId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await ProductService.GetProductByAdminId(adminId.id);

                setProducts(fetchedProducts);
            } catch (err) {
                setError(err.message || 'Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [adminId]);

    const formatPrice = (price) => {
        return price.toFixed(2); // Format price to 2 decimal places
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }
    const handleViewDetails = (productId) => {
        navigate(`/admin/products/${productId}`);
    };

    return (
        <div className="container mx-auto mt-2">
                <div className="rounded-t bg-white mb-0 px-6 py-6">
                    <h6 className="text-blueGray-700 text-xl font-bold">Products Added by {adminId.fullName}</h6>
                </div>
            {products.length === 0 ? (
                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6  font-bold uppercase" style={{marginLeft:"2%"}}>
                        No products found for this admin.
                    </h6>

            ) : (
                <div className="p-4">
                    <Typography variant="h6" className="flex items-center text-gray-700 mb-4">
                        <FaNotesMedical className="mr-2 text-gray-500" />
                        Products
                    </Typography>
                    <br/>
                    <TableContainer component={Paper} className="mb-4">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="center">Price</TableCell>
                                    <TableCell align="center">Stock Quantity</TableCell>
                                    <TableCell align="center">Discount (%)</TableCell>
                                    <TableCell align="center">Final Price</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map(item => {
                                    const discountPercentage = item.discountPercentage || 0; // Assuming discountPercentage is a product property
                                    const originalPrice = item.productPrice || 0;
                                    const finalPrice = originalPrice * (1 - discountPercentage / 100); // Calculate price after discount
                                    return (
                                        <TableRow key={item.productId}>
                                            <TableCell>
                                                <Box display="flex" alignItems="center">
                                                    <img
                                                        src={item.imageUrls ? `https://localhost:7048/${item.imageUrls[0]}` : 'https://via.placeholder.com/64x64'}
                                                        alt={item.productName}
                                                        className="w-16 h-16 object-cover mr-4"
                                                    />
                                                    <Typography variant="body1" className="text-gray-800">
                                                        {item.productName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">${formatPrice(originalPrice)}</TableCell>
                                            <TableCell align="center">{item.stockQuantity}</TableCell>
                                            <TableCell align="center">{discountPercentage}%</TableCell>
                                            <TableCell align="center">${formatPrice(finalPrice)}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    onClick={() => handleViewDetails(item.productId)}
                                                    className="text-green-500 hover:text-green-700"
                                                    title="View Details"
                                                >
                                                    <span className="text-xl"><Visibility/></span>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
        </div>
    );
};

export default AdminProduct;
