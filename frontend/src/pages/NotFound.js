import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Box className="page-container" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', fontWeight: 700, color: 'primary.main' }}>
            404
          </Typography>
          <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
            Page Not Found
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            The page you are looking for might have been removed or is temporarily unavailable.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<HomeIcon />}
            component={RouterLink}
            to="/"
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound; 