// src/components/map/filterBar.js
import React, { useState } from 'react';
import { CaretDown } from "@phosphor-icons/react";

const FilterBar = ({ onFilterChange, genres = [] }) => {
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [distance, setDistance] = useState('');

  const handleGenreChange = (e) => {
    const selectedGenre = e.target.value;
    setGenre(selectedGenre);
    onFilterChange({ genre: selectedGenre, sortBy });
  };

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortBy(selectedSort);
    onFilterChange({ genre, sortBy: selectedSort });
  };

  const handleDistanceChange = (e) => {
    const selectedDistance = e.target.value;
    setDistance(selectedDistance);
    onFilterChange({ genre, sortBy, distance: selectedDistance });
  };
  const selectWrapperClass = "flex flex-col relative";
  const selectClass = "appearance-none pl-3 pr-10 py-2 truncate rounded-full text-sm text-white bg-transparent border border-white focus:outline-none w-full"

  return (
    <div className="flex flex-row gap-4">
      <div className={selectWrapperClass}>
        <label htmlFor="genre-filter" className="text-sm font-medium text-white mb-1 self-start">
          Show me:
        </label>

        <div className="relative"> 
          <select
            id="genre-filter"
            value={genre}
            onChange={handleGenreChange}
            className={selectClass}
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g.toLowerCase()}>
                {g}
              </option>
            ))}
          </select>
          {/* arrow */}
          <CaretDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
          />
      </div>
    </div>

    {/* Sort */}
    <div className={selectWrapperClass}>
        <label htmlFor="sort-filter" className="text-sm font-medium text-white mb-1 self-start">
          Sort by:
        </label>
        <div className="relative">
          <select
            id="sort-filter"
            value={sortBy}
            onChange={handleSortChange}
            className={selectClass}
          >
            <option value="">Default</option>
            <option value="nearest">Nearest</option>
            <option value="date">Date</option>
          </select>
          <CaretDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
          />
        </div>
      </div>
      
      {/* Distance */}
      <div className={selectWrapperClass}>
        <label htmlFor="distance-filter" className="text-sm font-medium text-white mb-1 self-start">
          Distance:
        </label>
        <div className="relative">
          <select
            id="distance-filter"
            value={distance}
            onChange={handleDistanceChange}
            className={selectClass}
          >
            <option value="">Any</option>
            <option value="5">5 mi</option>
            <option value="10">10 mi</option>
            <option value="25">25 mi</option>
            <option value="50">50 mi</option>
            <option value="100">100 mi</option>
            <option value="200">200 mi</option>
            <option value="500">500 mi</option>
          </select>
          <CaretDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
