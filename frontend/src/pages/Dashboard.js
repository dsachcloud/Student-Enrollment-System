import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { getStudents } from '../services/studentService';

const Dashboard = () => {
  const theme = useTheme();
  const [studentsCount, setStudentsCount] = useState(0);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const students = await getStudents();
        setStudentsCount(students.length);
        
        // Sort students by enrollment date (newest first) and take the first 5
        const sortedStudents = [...students].sort((a, b) => 
          new Date(b.enrollmentDate) - new Date(a.enrollmentDate)
        ).slice(0, 5);
        
        setRecentStudents(sortedStudents);
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mock data for summary cards
  const summaryCards = [
    {
      title: 'Total Students',
      value: studentsCount,
      icon: <PersonIcon fontSize="large" />,
      color: theme.palette.primary.main,
      link: '/students',
    },
    {
      title: 'Active Courses',
      value: 15,
      icon: <BookIcon fontSize="large" />,
      color: theme.palette.secondary.main,
      link: '/courses',
    },
    {
      title: 'Departments',
      value: 6,
      icon: <SchoolIcon fontSize="large" />,
      color: theme.palette.success.main,
      link: '/departments',
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    // Re-fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const students = await getStudents();
        setStudentsCount(students.length);
        
        // Sort students by enrollment date (newest first) and take the first 5
        const sortedStudents = [...students].sort((a, b) => 
          new Date(b.enrollmentDate) - new Date(a.enrollmentDate)
        ).slice(0, 5);
        
        setRecentStudents(sortedStudents);
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  };

  return (
    <Box className="page-container">
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <IconButton color="primary" onClick={handleRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>

        {error && (
          <Paper 
            sx={{ 
              p: 2, 
              mb: 4, 
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.contrastText
            }}
          >
            <Typography>{error}</Typography>
          </Paper>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {summaryCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.title}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderTop: `4px solid ${card.color}`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {card.title}
                  </Typography>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
                <Typography variant="h3" component="p" sx={{ mb: 2 }}>
                  {loading ? '...' : card.value}
                </Typography>
                <Box sx={{ mt: 'auto' }}>
                  <Button 
                    variant="outlined" 
                    component={RouterLink} 
                    to={card.link} 
                    size="small"
                    sx={{ color: card.color, borderColor: card.color }}
                  >
                    View Details
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    Recent Students
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small" 
                    startIcon={<AddIcon />}
                    component={RouterLink}
                    to="/students/new"
                  >
                    Add New
                  </Button>
                </Box>
                <Divider />
                {loading ? (
                  <Typography sx={{ p: 2 }}>Loading...</Typography>
                ) : recentStudents.length > 0 ? (
                  <List sx={{ pt: 0 }}>
                    {recentStudents.map((student) => (
                      <React.Fragment key={student.id}>
                        <ListItem 
                          button 
                          component={RouterLink} 
                          to={`/students/${student.id}`}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={`${student.firstName} ${student.lastName}`} 
                            secondary={student.email} 
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography sx={{ p: 2 }}>No students found.</Typography>
                )}
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  component={RouterLink} 
                  to="/students" 
                  sx={{ ml: 'auto' }}
                >
                  View All Students
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    Quick Actions
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ py: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        component={RouterLink} 
                        to="/students/new"
                        startIcon={<PersonIcon />}
                        sx={{ mb: 2 }}
                      >
                        Add New Student
                      </Button>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        component={RouterLink} 
                        to="/courses/new"
                        startIcon={<BookIcon />}
                        sx={{ mb: 2 }}
                      >
                        Create New Course
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        component={RouterLink} 
                        to="/departments/new"
                        startIcon={<SchoolIcon />}
                        sx={{ mb: 2 }}
                      >
                        Add New Department
                      </Button>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        component={RouterLink} 
                        to="/students"
                        sx={{ mb: 2 }}
                      >
                        Manage Enrollments
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 