// SlidingSidebar.js
import React, { useState } from 'react';
import { Drawer, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function SlidingSidebar() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };

  return (
    <div>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{ position: 'absolute', top: 16, left: 16 }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{ width: 240, flexShrink: 0 }}
      >
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="About" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Contact" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
}

export default SlidingSidebar;
