import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Paper, Grid, Divider,
  List, ListItem, ListItemText, CircularProgress, Alert, Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { getStudentById, deleteStudent } from '../../services/studentService';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudentById(id);
        setStudent(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading student:', err);
        setError('Failed to load student details. Please try again.');
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        navigate('/students');
      } catch (err) {
        console.error('Error deleting student:', err);
        setError('Failed to delete student. Please try again.');
      }
    }
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
            to="/students"
            sx={{ mt: 2 }}
          >
            Back to Students
          </Button>
        </Container>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box className="page-container">
        <Container maxWidth="md">
          <Alert severity="info">Student not found.</Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={RouterLink}
            to="/students"
            sx={{ mt: 2 }}
          >
            Back to Students
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
            to="/students"
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Student Details
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            component={RouterLink}
            to={`/students/${id}/edit`}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {student.firstName} {student.lastName}
            </Typography>
            <Chip 
              label={student.gender || 'Unknown'} 
              color="primary" 
              size="small" 
              sx={{ mb: 2 }}
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Contact Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Email" secondary={student.email} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Phone" secondary={student.phoneNumber} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Address" secondary={student.address || 'Not provided'} />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Personal Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Date of Birth" 
                    secondary={student.dateOfBirth || 'Not provided'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Enrollment Date" 
                    secondary={student.enrollmentDate || 'Not provided'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Student ID" 
                    secondary={student.id} 
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" component="h3" gutterBottom>
            Enrolled Courses
          </Typography>
          
          {student.enrolledCourseIds && student.enrolledCourseIds.length > 0 ? (
            <List>
              {student.enrolledCourseIds.map((courseId) => (
                <ListItem key={courseId} button component={RouterLink} to={`/courses/${courseId}`}>
                  <ListItemText primary={`Course ID: ${courseId}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Not enrolled in any courses.
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default StudentDetails; 