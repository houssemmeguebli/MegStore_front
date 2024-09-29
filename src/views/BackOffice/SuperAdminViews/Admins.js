import React from "react";
import AdminsTable from "../../../components/SuperAdminComponents/AdminsTable";


export default function Admins() {
    return (
        <>
            <div className="flex flex-wrap ">
                <div className="w-full mb-12 px-4  ">
                    <AdminsTable/>
                </div>
            </div>
        </>
    );
}
