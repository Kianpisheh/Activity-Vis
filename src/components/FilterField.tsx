import React, { useEffect } from "react";

import "./FilterField.css";

interface FilterFieldProps {
    onFilterTextChange: (currentFilterText: string) => void;
    filterText: string;
}

const FilterField: React.FC<FilterFieldProps> = ({ onFilterTextChange, filterText }) => {
    useEffect(() => {
        onFilterTextChange(filterText);
    }, [filterText]);

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
                        onFilterTextChange(event.target.value);
                    }}
                />{" "}
            </label>
        </div>
    );
};

export default FilterField;
