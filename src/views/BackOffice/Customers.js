import React from "react";

import CouponTable from "../../components/AdminComponents/Coupons/CouponTable";
import CouponForm from "../../components/AdminComponents/Coupons/CouponForm";
import CustomerTable from "../../components/AdminComponents/Customers/CustomersTable";

export default function Customers() {
    return (
        <>
            <div className="flex flex-wrap ">
                <div className="w-full mb-12 px-4  ">
                    <CustomerTable/>
                </div>
            </div>
        </>
    );
}
