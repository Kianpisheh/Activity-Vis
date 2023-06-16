import React, { useState } from "react";

interface FilterFieldProps {
    onFilterTextChange: (currentFilterText: string, prevFilterText: string) => void;
}

const FilterField: React.FC<FilterFieldProps> = ({ onFilterTextChange }) => {
    const [filterText, setFilterText] = useState("");

    return (
        <div id="filter-field-container">
            <label id="filter-field-label" htmlFor="filt-field">
                Filter events
                <input
                    id="filter-field"
                    name="filt-field"
                    type="text"
                    placeholder="Type events..."
                    value={filterText}
                    onChange={(event) => {
                        onFilterTextChange(event.target.value, filterText);
                        setFilterText(event.target.value);
                    }}
                />{" "}
            </label>
        </div>
    );
};

export default FilterField;
