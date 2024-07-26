import React from 'react';
import './SearchFields.css';

const SearchFields = ({ searchFields, fields, selectedCategory, onFieldChange, onAddField, onRemoveField }) => {
    return (
        <div className="search-fields">
            {searchFields.map((searchField, index) => (
                <div key={index} className="search-field">
                    <select
                        value={searchField.field}
                        onChange={(e) => onFieldChange(index, 'field', e.target.value)}
                        className="field-select"
                    >
                        {(fields.Appointments && Array.isArray(fields.Appointments)) ? (
                            fields.Appointments.map((field) => (
                                <option key={field.field} value={field.field}>
                                    {field.field}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No fields available</option>
                        )}
                    </select>
                    <input
                        type="text"
                        value={searchField.value}
                        onChange={(e) => onFieldChange(index, 'value', e.target.value)}
                        className="field-input"
                    />
                    <button onClick={() => onRemoveField(index)} className="remove-button">Remove</button>
                </div>
            ))}
            <button onClick={onAddField} className="add-button">Add Field</button>
        </div>
    );
};

export default SearchFields;
