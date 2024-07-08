import React from 'react';
import { Box, TextField, MenuItem, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const SearchFields = ({ searchFields, fields, selectedCategory, onFieldChange, onAddField, onRemoveField }) => (
    <>
        {searchFields.map((searchField, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                    select
                    label="Field"
                    value={searchField.field}
                    onChange={(e) => onFieldChange(index, 'field', e.target.value)}
                    sx={{ mr: 2 }}
                    disabled={!selectedCategory}
                >
                    {fields[selectedCategory] && fields[selectedCategory].map((field) => (
                        <MenuItem key={field.field} value={field.field}>
                            {field.headerName}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Value"
                    value={searchField.value}
                    onChange={(e) => onFieldChange(index, 'value', e.target.value)}
                    sx={{ mr: 2, flexGrow: 1 }}
                    disabled={!searchField.field}
                />
                {searchFields.length > 1 && (
                    <IconButton onClick={() => onRemoveField(index)} color="primary">
                        <RemoveCircleIcon />
                    </IconButton>
                )}
                {index === searchFields.length - 1 && (
                    <IconButton onClick={onAddField} color="primary">
                        <AddCircleIcon />
                    </IconButton>
                )}
            </Box>
        ))}
    </>
);

export default SearchFields;
