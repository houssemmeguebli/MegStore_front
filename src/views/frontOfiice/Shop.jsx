import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbars/AuthNavbar";
import Footer from "../../components/Footers/Footer";
import ProductService from "../../_services/ProductService";
import FilterSidebar from "../../components/FrontOfficeComponents/FilterSidebar";
import ProductList from "../../components/FrontOfficeComponents/Product/ProductList";
import {CircularProgress} from "@mui/material";

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({categories: [], priceRange: [0, 1000000]});
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('price-asc'); // 'price-asc', 'price-desc', 'popularity'

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await ProductService.getAllProducts();
                setProducts(fetchedProducts);
                setFilteredProducts(fetchedProducts); // Ensure filteredProducts is initialized
                console.log("fetchedProducts", fetchedProducts);
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            let filtered = products;

            // Search functionality
            if (searchQuery) {
                filtered = filtered.filter(product =>
                    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            // Category filter
            if (filters.categories.length > 0) {
                filtered = filtered.filter(product => filters.categories.includes(product.categoryId));
            }

            // Price range filter
            filtered = filtered.filter(product =>
                product.productPrice >= filters.priceRange[0] && product.productPrice <= filters.priceRange[1]
            );

            // Sorting functionality
            switch (sortOption) {
                case 'price-asc':
                    filtered.sort((a, b) => a.productPrice - b.productPrice);
                    break;
                case 'price-desc':
                    filtered.sort((a, b) => b.productPrice - a.productPrice);
                    break;
                default:
                    break;
            }

            setFilteredProducts(filtered);
        };

        applyFilters();
    }, [filters, products, searchQuery, sortOption]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    if (loading) return <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">MEGSTORE</h1>
        <CircularProgress color="primary"/>
        <p className="text-gray-600 mt-2">Loading, please wait...</p>
    </div>

    return (
        <>
            <Navbar/>
            <main className="relative pt-16 pb-32 flex flex-col min-h-screen bg-gray-100">
                <div className="relative z-10 container mx-auto px-4">
                    <div className="flex flex-wrap gap-4">
                        {/* Hero Section */}
                        <section
                            className="relative w-full mb-12 mt-16 bg-gradient-to-r from-gray-900 to-gray-700 text-gray-100 py-12 rounded-lg shadow-lg overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-30"></div>
                            <div
                                className="relative container mx-auto px-6 lg:px-12 py-12 flex flex-col items-center text-center">
                                <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight">
                                    Transform Your Shopping Journey
                                </h2>
                                <p className="text-lg lg:text-xl mb-6">
                                    Explore a curated selection of premium products and enjoy exceptional service.
                                    Elevate your shopping experience today.
                                </p>
                            </div>
                        </section>
                        {/* Main Content */}
                        <div className="flex flex-col lg:flex-row gap-4 ">
                            <FilterSidebar onFilterChange={handleFilterChange} products={products}/>
                            <div className="w-full lg:w-9/12 px-4">
                                {/* Search and Sort Controls */}
                                <div className="mb-4 flex flex-col lg:flex-row items-center justify-between gap-4">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="p-3 border border-gray-300 rounded-lg w-full lg:w-8/12 lg:mr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                                    />
                                    <select
                                        value={sortOption}
                                        onChange={handleSortChange}
                                        className="p-3 border border-gray-300 rounded-lg w-full lg:w-4/12 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                                    >
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                    </select>
                                </div>
                                {/* Product List */}
                                <ProductList products={filteredProducts}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="absolute bottom-0 left-0 right-0 w-full pointer-events-none overflow-hidden h-20 bg-gradient-to-t from-gray-100 to-transparent">
                    <svg
                        className="absolute bottom-0 overflow-hidden"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        version="1.1"
                        viewBox="0 0 2560 100"
                        x="0"
                        y="0"
                    >
                        <polygon className="text-gray-100 fill-current" points="2560 0 2560 100 0 100"></polygon>
                    </svg>
                </div>
            </main>
            <Footer/>
        </>
    );
}
