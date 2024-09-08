import React from "react";
import OrdersTable from "../../components/Orders/OrdersTable";
import OrderDetails from "../../components/Orders/OrderDetails";


export default function Orders() {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <OrderDetails/>
                </div>
                <div className="w-full mb-12 px-4">
                  <OrdersTable/>
                </div>
            </div>
        </>
    );
}
