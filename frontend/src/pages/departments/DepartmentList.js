import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Paper, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress, Alert,
  Chip, IconButton, Tooltip, Avatar
} from '@mui/material';
import { 
  Add as AddIcon,
  School as SchoolIcon,
  Computer as ComputerIcon,
  Science as ScienceIcon,
  History as HistoryIcon,
  Book as BookIcon,
  Build as BuildIcon,
  Memory as MemoryIcon
} from '@mui/icons-material';
import { getDepartments, resetDepartmentData } from '../../services/departmentService';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Reset department data to ensure we have the latest Indian names
        resetDepartmentData();
        
        const data = await getDepartments();
        setDepartments(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading departments:', err);
        setError('Failed to load departments. Please try again.');
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const getStatusColor = (status) => {
    return status === 'ACTIVE' ? 'success' : 'error';
  };

  const getStatusLabel = (status) => {
    return status === 'ACTIVE' ? 'Active' : 'Inactive';
  };

  const getDepartmentIcon = (name) => {
    switch(name) {
      case 'Information Technology':
        return <ComputerIcon />;
      case 'Mechanical Engineering':
        return <BuildIcon />;
      case 'Electronics & Communication':
        return <MemoryIcon />;
      case 'Biotechnology':
        return <ScienceIcon />;
      case 'Ancient Indian History':
        return <HistoryIcon />;
      case 'Hindi Literature':
        return <BookIcon />;
      default:
        return <SchoolIcon />;
    }
  };

  const getDepartmentColor = (name) => {
    switch(name) {
      case 'Information Technology':
        return '#3f51b5'; // Indigo
      case 'Mechanical Engineering':
        return '#f44336'; // Red
      case 'Electronics & Communication':
        return '#2196f3'; // Blue
      case 'Biotechnology':
        return '#4caf50'; // Green
      case 'Ancient Indian History':
        return '#ff9800'; // Orange
      case 'Hindi Literature':
        return '#9c27b0'; // Purple
      default:
        return '#607d8b'; // Blue Grey
    }
  };

  return (
    <Box className="page-container">
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Departments
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/departments/new"
          >
            Add New Department
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : departments.length === 0 ? (
          <Alert severity="info">No departments found. Add a new department to get started.</Alert>
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Icon</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Department Head</TableCell>
                  <TableCell>Founded Year</TableCell>
                  <TableCell>Students</TableCell>
                  <TableCell>Courses</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departments.map((department) => (
                  <TableRow key={department.id} hover>
                    <TableCell>
                      <Tooltip title={department.name}>
                        <Avatar sx={{ 
                          bgcolor: getDepartmentColor(department.name),
                          width: 36, 
                          height: 36 
                        }}>
                          {getDepartmentIcon(department.name)}
                        </Avatar>
                      </Tooltip>
                    </TableCell>
                    <TableCell><strong>{department.name}</strong></TableCell>
                    <TableCell>{department.head}</TableCell>
                    <TableCell>{department.foundedYear}</TableCell>
                    <TableCell>{department.studentsCount}</TableCell>
                    <TableCell>{department.coursesCount}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusLabel(department.status)} 
                        color={getStatusColor(department.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        component={RouterLink}
                        to={`/departments/${department.id}`}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                      <Button
                        component={RouterLink}
                        to={`/departments/${department.id}/edit`}
                        size="small"
                        color="primary"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default DepartmentList; 