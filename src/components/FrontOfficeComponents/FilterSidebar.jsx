import React, { useEffect, useState } from 'react';
import CategoryService from "../../_services/CategoryService";
import { Slider, Typography, Switch, Divider } from "@mui/material";

const FilterSidebar = ({ onFilterChange,products }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 100000]); // Default value until fetched from products
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100000); // Default max value
    const [searchTerm, setSearchTerm] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryList = await CategoryService.getAllCategories();
                setCategories(categoryList);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        const fetchProductPriceRange = async () => {
            try {
                const productPrices = products.map(product => product.productPrice);
                const minPrice = Math.min(...productPrices);
                const maxPrice = Math.max(...productPrices);
                setMinPrice(minPrice);
                setMaxPrice(maxPrice);
                setPriceRange([minPrice, maxPrice]); // Set initial price range
            } catch (err) {
                console.error('Failed to fetch product prices:', err);
            }
        };

        fetchCategories();
        fetchProductPriceRange();
    }, []);

    const updateFilters = (newFilters = {}) => {
        onFilterChange({
            categories: selectedCategories,
            priceRange: priceRange,
            isAvailable: isAvailable,
            ...newFilters,
        });
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories(prevSelectedCategories => {
            const updatedCategories = prevSelectedCategories.includes(categoryId)
                ? prevSelectedCategories.filter(id => id !== categoryId)
                : [...prevSelectedCategories, categoryId];
            updateFilters({ categories: updatedCategories });
            return updatedCategories;
        });
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
        updateFilters({ priceRange: newValue });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAvailabilityChange = (event) => {
        setIsAvailable(event.target.checked);
        updateFilters({ isAvailable: event.target.checked });
    };

    const filteredCategories = categories.filter(cat =>
        cat.categorydName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleResetFilters = () => {
        setSelectedCategories([]);
        setPriceRange([minPrice, maxPrice]);
        setSearchTerm('');
        setIsAvailable(false);

        updateFilters({
            categories: [],
            priceRange: [minPrice, maxPrice],
            isAvailable: false
        });
    };

    return (
        <div className="w-full lg:w-4/12 px-4 mb-6">
            <div className="bg-white p-4 shadow-lg rounded-lg space-y-6 border border-gray-200">
                <h4 className="text-2xl font-bold mb-4">Filters</h4>

                <Divider />

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="border border-gray-300 rounded-lg p-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <Divider />

                <div>
                    <h5 className="text-xl font-semibold mb-4 text-gray-800 p-2">Categories</h5>
                    <div className="flex flex-col gap-3">
                        {filteredCategories.map(category => (
                            <div key={category.categoryId} className="flex items-center space-x-3 p-2">
                                <input
                                    type="checkbox"
                                    id={category.categoryId}
                                    checked={selectedCategories.includes(category.categoryId)}
                                    onChange={() => handleCategoryChange(category.categoryId)}
                                    className="h-5 w-5 text-blue-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-150"
                                />
                                <label
                                    htmlFor={category.categoryId}
                                    className="text-gray-800 cursor-pointer hover:text-blue-700 transition duration-150"
                                >
                                    {category.categorydName}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <Divider />

                <div>
                    <h5 className="text-lg font-semibold mb-2">Price Range</h5>
                    <Slider
                        value={priceRange}
                        onChange={handlePriceRangeChange}
                        valueLabelDisplay="auto"
                        min={minPrice}
                        max={maxPrice}
                        step={10}
                        aria-labelledby="price-range-slider"
                        className="w-full"
                        sx={{
                            color: '#3b82f6',
                            '& .MuiSlider-thumb': {
                                backgroundColor: '#fff',
                                border: '2px solid #3b82f6',
                            },
                        }}
                    />
                    <div className="flex justify-between text-sm mt-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </div>

                <Divider />

                <div className="flex gap-4">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full"
                        onClick={() => updateFilters()}
                    >
                        Apply Filters
                    </button>
                    <button
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300 w-full"
                        onClick={handleResetFilters}
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
