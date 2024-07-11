// src/component/SearchFields.js
import React from 'react';
import { TextField, IconButton, MenuItem } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const SearchFields = ({ searchFields, fields, selectedCategory, onFieldChange, onAddField, onRemoveField }) => {
    return (
        <div>
            {searchFields.map((searchField, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <TextField
                        select
                        label="Field"
                        value={searchField.field}
                        onChange={(e) => onFieldChange(index, 'field', e.target.value)}
                        style={{ marginRight: '8px' }}
                    >
                        {fields[selectedCategory]?.map((field) => (
                            <MenuItem key={field.field} value={field.field}>
                                {field.field}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Value"
                        value={searchField.value}
                        onChange={(e) => onFieldChange(index, 'value', e.target.value)}
                        style={{ marginRight: '8px' }}
                    />
                    <IconButton onClick={() => onRemoveField(index)} color="secondary">
                        <RemoveCircleIcon />
                    </IconButton>
                </div>
            ))}
            <IconButton onClick={onAddField} color="primary">
                Add Field
            </IconButton>
        </div>
    );
};

export default SearchFields;
