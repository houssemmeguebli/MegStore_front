import React from "react";

import CouponTable from "../../components/AdminComponents/Coupons/CouponTable";
import CouponForm from "../../components/AdminComponents/Coupons/CouponForm";

export default function Coupons() {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <CouponForm/>
                </div>
                <div className="w-full mb-12 px-4">
                    <CouponTable/>
                </div>
            </div>
        </>
    );
}
