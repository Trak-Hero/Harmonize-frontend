import React, { useState } from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('');

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
          <option value="rock">Rock</option>
          <option value="jazz">Jazz</option>
          <option value="classical">Classical</option>
          <option value="pop">Pop</option>
          <option value="indie">Indie</option>
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
    </div>
  );
};

export default FilterBar;
