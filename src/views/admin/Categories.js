import React from "react";

import CategoryForm from "../../components/Categories/CategeriesForm";
import CategoriesTable from "../../components/Categories/CategoriesTable";

export default function Categories() {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <CategoryForm/>
                </div>
                <div className="w-full mb-12 px-4">
                    <CategoriesTable/>
                </div>
            </div>
        </>
    );
}
