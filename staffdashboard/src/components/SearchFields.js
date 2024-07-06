import React from 'react';
import { Box, TextField, IconButton, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const SearchFields = ({ searchFields, fields, selectedCategory, onFieldChange, onAddField, onRemoveField }) => {
    return (
        <Box>
            {searchFields.map((searchField, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                        select
                        label="Field"
                        value={searchField.field}
                        onChange={(e) => onFieldChange(index, 'field', e.target.value)}
                        sx={{ mr: 2 }}
                    >
                        {(fields.Appointments && Array.isArray(fields.Appointments)) ? (
                            fields.Appointments.map((field) => (
                                <MenuItem key={field.field} value={field.field}>
                                    {field.field}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem value="" disabled>No fields available</MenuItem>
                        )}
                    </TextField>
                    <TextField
                        label="Value"
                        value={searchField.value}
                        onChange={(e) => onFieldChange(index, 'value', e.target.value)}
                        sx={{ mr: 2 }}
                    />
                    <IconButton onClick={() => onRemoveField(index)} color="secondary">
                        <RemoveIcon />
                    </IconButton>
                </Box>
            ))}
            <IconButton onClick={onAddField} color="primary">
                <AddIcon />
            </IconButton>
        </Box>
    );
};

export default SearchFields;
