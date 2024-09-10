import React, { useEffect, useState } from 'react';
import CategoryService from "../../_services/CategoryService";
import { Slider, Typography } from "@mui/material";

const FilterSidebar = ({ onFilterChange }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratings, setRatings] = useState([0, 5]); // Example range: 0 to 5 stars
    const [selectedRating, setSelectedRating] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryList = await CategoryService.getAllCategories();
                // Assuming each category object has a `name` property
                const uniqueCategories = [...new Set(categoryList.map(cat => cat.categorydName))];
                setCategories(uniqueCategories);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategories(prevSelectedCategories => {
            const updatedCategories = prevSelectedCategories.includes(category)
                ? prevSelectedCategories.filter(c => c !== category)
                : [...prevSelectedCategories, category];

            onFilterChange({ categories: updatedCategories, priceRange, rating: selectedRating });
            return updatedCategories;
        });
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
        onFilterChange({ categories: selectedCategories, priceRange: newValue, rating: selectedRating });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };


    const filteredCategories = categories.filter(cat =>
        cat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleResetFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, 1000]);
        setSearchTerm('');
        setSelectedRating([]);
        onFilterChange({ categories: [], priceRange: [0, 1000], rating: [] });
    };

    return (
        <div className="w-full lg:w-4/12 px-4 mb-6 ">
            <div className="bg-white p-4 shadow-lg rounded-lg space-y-6 border border-gray-200">
                <h4 className="text-2xl font-bold mb-4">Filters</h4>

                {/* Search Bar for Categories */}
                <div>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="border border-gray-300 rounded-lg p-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Horizontal filter categories */}
                <div>
                    <h5 className="text-xl font-semibold mb-4 text-gray-800 p-2">Categories</h5>
                    <div className="flex flex-col gap-3">
                        {filteredCategories.map(category => (
                            <div key={category} className="flex items-center space-x-3 p-2">
                                <input
                                    type="checkbox"
                                    id={category}
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                    className="h-5 w-5 text-blue-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-150"
                                />
                                <label htmlFor={category}
                                       className="text-gray-800 cursor-pointer hover:text-blue-700 transition duration-150">
                                    {category}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Price Range Filter */}
                <div>
                    <h5 className="text-lg font-semibold mb-2">Price Range</h5>
                    <Slider
                        value={priceRange}
                        onChange={handlePriceRangeChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000}
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
                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full"
                        onClick={() => onFilterChange({
                            categories: selectedCategories,
                            priceRange,
                            rating: selectedRating
                        })}
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
