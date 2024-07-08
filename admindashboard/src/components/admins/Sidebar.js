import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';

const Sidebar = ({ onInboxClick }) => {
    return (
        <Box sx={{ height: '100vh', overflowY: 'auto' }}>
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <ArchiveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Lưu trữ" />
                </ListItem>
                <ListItem button onClick={onInboxClick}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Hộp thư đến" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <SendIcon />
                    </ListItemIcon>
                    <ListItemText primary="Gửi email" />
                </ListItem>

                <ListItem button>
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Thùng rác" />
                </ListItem>
                {/* Thêm các mục khác ở đây */}
            </List>
        </Box>
    );
};

export default Sidebar;
