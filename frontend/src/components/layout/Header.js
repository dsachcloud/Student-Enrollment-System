import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Book as BookIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

const navItems = [
  { name: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { name: 'Students', path: '/students', icon: <PersonIcon /> },
  { name: 'Courses', path: '/courses', icon: <BookIcon /> },
  { name: 'Departments', path: '/departments', icon: <SchoolIcon /> },
];

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.name} 
            component={RouterLink} 
            to={item.path}
            selected={isActive(item.path)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'common.white',
                '& .MuiListItemIcon-root': {
                  color: 'common.white',
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: isMobile ? 1 : 0
            }}
          >
            Student Enrollment
          </Typography>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', ml: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    mx: 1,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isActive(item.path) ? 'primary.dark' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                  startIcon={item.icon}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </Container>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header; 