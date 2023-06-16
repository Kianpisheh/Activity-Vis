import React from "react";

interface FilterFieldProps {
    handleFilterChange: (filtText: string) => void;
    filterText: string;
}

const FilterField: React.FC<FilterFieldProps> = ({ handleFilterChange, filterText }) => {
    return (
        <div id="filter-field-container">
            <label>Text Field:</label>
            <input
                type="text"
                value={filterText}
                onChange={(event) => {
                    handleFilterChange(event.target.value);
                }}
            />
        </div>
    );
};

export default FilterField;
