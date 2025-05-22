import React, { useState } from 'react';

function SearchBar(props) {
    const [searchTerm, setSearchTerm] = useState('');
    const onInputChange = (e) => {
        setSearchTerm(e.target.value);
        props.onSearchChange(e.target.value);
        console.log(e.target.value);
    };

    return (
        <div className="w-full">
            <input
                type="text"
                value={searchTerm}
                onChange={onInputChange}
                placeholder="Search for an event"
                className="w-full px-4 py-2 rounded-full bg-white/20 text-white placeholder-white focus:outline-none border border-white"
            />
        </div>
    );
}

export default SearchBar;
