import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Grid, IconButton, Pagination, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";
import CouponService from "../../../_services/CouponService"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";

export default function CouponTable() {
    const [coupons, setCoupons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [couponsPerPage] = useState(5); // Number of coupons per page
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCoupons() {
            try {
                const data = await CouponService.getAllCoupons();
                setCoupons(data);
                console.log("fetchCoupons",data);
            } catch (error) {
                console.error("Error fetching coupons:", error);
            }
        }
        fetchCoupons();
    }, [coupons]);

    const handleDelete = async (couponId) => {
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
                await CouponService.deleteCoupon(couponId);
                setCoupons(coupons.filter((coupon) => coupon.couponId !== couponId));
                Swal.fire('Deleted!', 'Your coupon has been deleted.', 'success');
            }
        } catch (error) {
            console.error("Error deleting coupon:", error);
        }
    };

    const handleViewDetails = (couponId) => {
        navigate(`/admin/coupons/${couponId}`);
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    // Pagination logic
    const indexOfLastCoupon = currentPage * couponsPerPage;
    const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
    const currentCoupons = coupons.slice(indexOfFirstCoupon, indexOfLastCoupon);

    // Statistics
    const totalCoupons = coupons.length;
    const totalPages = Math.ceil(totalCoupons / couponsPerPage);

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-lg text-blueGray-700">Coupons Table</h3>
                    </div>
                </div>
            </div>

            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse  ">
                    <thead>
                    <tr  >
                        {["Coupon Code", "Discount (%)", "Active", "Start Date", "Expiry Date", ""].map((heading) => (
                            <th
                                key={heading}
                                className="px-6 font-bold align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                            >
                                {heading}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {currentCoupons.map((coupon) => (
                        <tr key={coupon.couponId}className="font-bold">
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-bold text-blueGray-600">
                                {coupon.code}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {coupon.discountPercentage}%
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {coupon.isActive ? "Yes" : "No"}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {new Date(coupon.startDate).toLocaleDateString()}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                <div className="flex justify-end space-x-2">
                                    <IconButton
                                        onClick={() => handleDelete(coupon.couponId)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Delete"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleViewDetails(coupon.couponId)}
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
            <div className="p-4 flex items-center justify-center">
                <Pagination
                    count={totalPages}
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
                                Total Coupons: {totalCoupons}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="subtitle1">
                                Coupons per Page: {couponsPerPage}
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

CouponTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
