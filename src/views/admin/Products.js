import React from "react";

// components

import CardTable from "components/Cards/CardTable.js";
import ProductForm from "../../components/Products/ProductForm";

export default function Products() {
  return (
    <>
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
                <ProductForm/>
            </div>
            <div className="w-full mb-12 px-4">
                <CardTable/>
            </div>
        </div>
    </>
  );
}
