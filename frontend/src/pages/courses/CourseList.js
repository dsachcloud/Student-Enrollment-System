import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Paper, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress, Alert,
  Chip
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { getCourses } from '../../services/courseService';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading courses:', err);
        setError('Failed to load courses. Please try again.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getStatusColor = (status) => {
    return status === 'ACTIVE' ? 'success' : 'error';
  };

  return (
    <Box className="page-container">
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Courses
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/courses/new"
          >
            Add New Course
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
        ) : courses.length === 0 ? (
          <Alert severity="info">No courses found. Add a new course to get started.</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Credits</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.department}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>
                      <Chip 
                        label={course.status} 
                        color={getStatusColor(course.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        component={RouterLink}
                        to={`/courses/${course.id}`}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                      <Button
                        component={RouterLink}
                        to={`/courses/${course.id}/edit`}
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

export default CourseList; 