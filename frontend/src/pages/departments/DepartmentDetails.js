import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Paper, Grid, Divider,
  List, ListItem, ListItemText, CircularProgress, Alert, Chip,
  Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Book as BookIcon,
  Computer as ComputerIcon,
  Science as ScienceIcon,
  History as HistoryIcon,
  Build as BuildIcon,
  Memory as MemoryIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CurrencyRupee as CurrencyRupeeIcon
} from '@mui/icons-material';
import { getDepartmentById, deleteDepartment, getCoursesByDepartmentId, resetDepartmentData } from '../../services/departmentService';

const DepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        // Reset department data to ensure we have the latest Indian names
        resetDepartmentData();
        
        const data = await getDepartmentById(id);
        setDepartment(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading department:', err);
        setError('Failed to load department details. Please try again.');
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment(id);
        navigate('/departments');
      } catch (err) {
        console.error('Error deleting department:', err);
        setError('Failed to delete department. Please try again.');
      }
    }
  };

  const getDepartmentIcon = (name) => {
    switch(name) {
      case 'Information Technology':
        return <ComputerIcon sx={{ fontSize: 40, color: '#3f51b5', mr: 2 }} />;
      case 'Mechanical Engineering':
        return <BuildIcon sx={{ fontSize: 40, color: '#f44336', mr: 2 }} />;
      case 'Electronics & Communication':
        return <MemoryIcon sx={{ fontSize: 40, color: '#2196f3', mr: 2 }} />;
      case 'Biotechnology':
        return <ScienceIcon sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />;
      case 'Ancient Indian History':
        return <HistoryIcon sx={{ fontSize: 40, color: '#ff9800', mr: 2 }} />;
      case 'Hindi Literature':
        return <BookIcon sx={{ fontSize: 40, color: '#9c27b0', mr: 2 }} />;
      default:
        return <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />;
    }
  };

  const getStatusLabel = (status) => {
    return status === 'ACTIVE' ? 'Active' : 'Inactive';
  };

  if (loading) {
    return (
      <Box className="page-container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="page-container">
        <Container maxWidth="md">
          <Alert severity="error">{error}</Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={RouterLink}
            to="/departments"
            sx={{ mt: 2 }}
          >
            Back to Departments
          </Button>
        </Container>
      </Box>
    );
  }

  if (!department) {
    return (
      <Box className="page-container">
        <Container maxWidth="md">
          <Alert severity="info">Department not found.</Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={RouterLink}
            to="/departments"
            sx={{ mt: 2 }}
          >
            Back to Departments
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="page-container">
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={RouterLink}
            to="/departments"
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Department Details
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            component={RouterLink}
            to={`/departments/${id}/edit`}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            {getDepartmentIcon(department.name)}
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {department.name}
              </Typography>
              <Chip 
                label={getStatusLabel(department.status)} 
                color={department.status === 'ACTIVE' ? 'success' : 'error'} 
                size="small" 
                sx={{ mb: 1 }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Contact Information
              </Typography>
              <List dense>
                <ListItem>
                  <EmailIcon color="primary" sx={{ mr: 2, fontSize: 20 }} />
                  <ListItemText primary="Email" secondary={department.email} />
                </ListItem>
                <ListItem>
                  <PhoneIcon color="primary" sx={{ mr: 2, fontSize: 20 }} />
                  <ListItemText primary="Phone" secondary={department.phone} />
                </ListItem>
                <ListItem>
                  <LocationIcon color="primary" sx={{ mr: 2, fontSize: 20 }} />
                  <ListItemText primary="Location" secondary={department.location} />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                General Information
              </Typography>
              <List dense>
                <ListItem>
                  <PersonIcon color="primary" sx={{ mr: 2, fontSize: 20 }} />
                  <ListItemText primary="Department Head" secondary={department.head} />
                </ListItem>
                <ListItem>
                  <SchoolIcon color="primary" sx={{ mr: 2, fontSize: 20 }} />
                  <ListItemText primary="Founded Year" secondary={department.foundedYear} />
                </ListItem>
                <ListItem>
                  <CurrencyRupeeIcon color="primary" sx={{ mr: 2, fontSize: 20 }} />
                  <ListItemText 
                    primary="Annual Budget" 
                    secondary={`₹${department.budget ? department.budget.toLocaleString() : 0}`} 
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>

          {department.description && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {department.description}
              </Typography>
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" component="h3" gutterBottom>
            Faculty Members
          </Typography>
          
          {department.faculty && department.faculty.length > 0 ? (
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {department.faculty.map((member) => (
                    <TableRow key={member.id} hover>
                      <TableCell>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                      </TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{member.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              No faculty members listed.
            </Typography>
          )}

          <Typography variant="h6" component="h3" gutterBottom>
            Courses
          </Typography>
          
          {department.courses && department.courses.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Credits</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {department.courses.map((course) => (
                    <TableRow key={course.id} hover>
                      <TableCell>
                        <BookIcon color="primary" fontSize="small" />
                      </TableCell>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.credits}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No courses listed.
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default DepartmentDetails; 