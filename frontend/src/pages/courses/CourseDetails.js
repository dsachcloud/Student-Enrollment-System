import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Paper, Grid, Divider,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, 
  CircularProgress, Alert, Chip, Card, CardContent
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Book as BookIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { getCourseById, deleteCourse, getStudentsByCourseId } from '../../services/courseService';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourseById(id);
        setCourse(courseData);
        
        // Fetch enrolled students
        const studentsData = await getStudentsByCourseId(id);
        setEnrolledStudents(studentsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading course:', err);
        setError('Failed to load course details. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        navigate('/courses');
      } catch (err) {
        console.error('Error deleting course:', err);
        setError('Failed to delete course. Please try again.');
      }
    }
  };

  const getEnrollmentStatus = () => {
    if (!course) return { text: 'Unknown', color: 'default' };
    
    const percentFull = (course.enrolledStudents / course.capacity) * 100;
    
    if (percentFull >= 100) return { text: 'Full', color: 'error' };
    if (percentFull >= 80) return { text: 'Almost Full', color: 'warning' };
    if (percentFull >= 50) return { text: 'Half Full', color: 'info' };
    return { text: 'Open', color: 'success' };
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
            to="/courses"
            sx={{ mt: 2 }}
          >
            Back to Courses
          </Button>
        </Container>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box className="page-container">
        <Container maxWidth="md">
          <Alert severity="info">Course not found.</Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={RouterLink}
            to="/courses"
            sx={{ mt: 2 }}
          >
            Back to Courses
          </Button>
        </Container>
      </Box>
    );
  }

  const enrollmentStatus = getEnrollmentStatus();

  return (
    <Box className="page-container">
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={RouterLink}
            to="/courses"
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Course Details
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            component={RouterLink}
            to={`/courses/${id}/edit`}
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
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BookIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {course.code}
                </Typography>
                <Typography variant="h5" component="h2">
                  {course.name}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', mt: 2 }}>
              <Chip 
                label={course.status} 
                color={course.status === 'ACTIVE' ? 'success' : 'error'} 
                size="small" 
                sx={{ mr: 1 }}
              />
              <Chip 
                label={enrollmentStatus.text} 
                color={enrollmentStatus.color} 
                size="small"
                sx={{ mr: 1 }}
              />
              <Chip 
                label={`${course.credits} Credits`} 
                variant="outlined" 
                size="small" 
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Course Information</Typography>
                  </Box>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Department" 
                        secondary={
                          <Button 
                            size="small" 
                            component={RouterLink} 
                            to={`/departments/1`} // Assuming department ID is 1 for this mock
                            sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
                          >
                            {course.department}
                          </Button>
                        } 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Instructor" secondary={course.instructor} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Enrollment" 
                        secondary={`${course.enrolledStudents} / ${course.capacity} students`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Prerequisites" 
                        secondary={course.prerequisites ? course.prerequisites.join(', ') : 'None'} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Schedule Information</Typography>
                  </Box>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Schedule" secondary={course.schedule} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Location" secondary={course.location} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Start Date" secondary={course.startDate} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="End Date" secondary={course.endDate} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {course.description && (
            <>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body1">
                    {course.description}
                  </Typography>
                </Paper>
              </Box>
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" component="h3" gutterBottom>
            Enrolled Students ({course.enrolledStudents})
          </Typography>
          
          {enrolledStudents.length > 0 ? (
            <List>
              {enrolledStudents.map((student) => (
                <Paper variant="outlined" sx={{ mb: 1 }} key={student.id}>
                  <ListItem 
                    button 
                    component={RouterLink} 
                    to={`/students/${student.id}`}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={`${student.firstName} ${student.lastName}`} 
                      secondary={student.email} 
                    />
                  </ListItem>
                </Paper>
              ))}
              {course.enrolledStudents > enrolledStudents.length && (
                <Button 
                  variant="text" 
                  sx={{ mt: 1 }}
                  component={RouterLink} 
                  to={`/courses/${id}/students`}
                >
                  View All Students ({course.enrolledStudents})
                </Button>
              )}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No students enrolled in this course.
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CourseDetails; 