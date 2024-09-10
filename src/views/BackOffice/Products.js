import React from "react";

// components

import ProductForm from "../../components/AdminComponents/Products/ProductForm";
import ProductTable from "../../components/AdminComponents/Products/ProductTable";

export default function Products() {
  return (
    <>
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
                <ProductForm/>
            </div>
            <div className="w-full mb-12 px-4">
                <ProductTable/>
            </div>
        </div>
    </>
  );
}
