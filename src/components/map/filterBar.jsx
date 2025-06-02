// src/components/map/filterBar.js
import React, { useState } from 'react';

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
  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col">
        <label htmlFor="genre-filter" className="text-sm font-medium text-white mb-1 self-start">
          Show me:
        </label>
        <select
          id="genre-filter"
          value={genre}
          onChange={handleGenreChange}
          className="px-3 py-2 rounded-full text-sm text-white bg-transparent border border-white focus:outline-none"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g.toLowerCase()}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="sort-filter" className="text-sm font-medium text-white mb-1 self-start">
          Sort by:
        </label>
        <select
          id="sort-filter"
          value={sortBy}
          onChange={handleSortChange}
          className="px-3 py-2 rounded-full text-sm text-white bg-transparent border border-white focus:outline-none"
        >
          <option value="">Default</option>
          <option value="nearest">Nearest</option>
          <option value="date">Date</option>
        </select>
      </div>
      
      <div className="flex flex-col">
        <label htmlFor="distance-filter" className="text-sm font-medium text-white mb-1 self-start">
          Distance:
        </label>
        <select
          id="distance-filter"
          value={distance}
          onChange={handleDistanceChange}
          className="px-3 py-2 rounded-full text-sm text-white bg-transparent border border-white focus:outline-none"
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
      </div>

    </div>
  );
};

export default FilterBar;
