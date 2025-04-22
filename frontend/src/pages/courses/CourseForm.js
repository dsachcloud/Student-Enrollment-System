import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, Container, Typography, Button, Paper, 
  Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Alert, FormHelperText
} from '@mui/material';
import { getCourseById, createCourse, updateCourse } from '../../services/courseService';
import { getDepartments } from '../../services/departmentService';

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState([]);
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    department: '',
    credits: 3,
    capacity: 30,
    status: 'ACTIVE'
  });

  // Add validation state
  const [validation, setValidation] = useState({
    code: { error: false, message: '' },
    name: { error: false, message: '' },
    credits: { error: false, message: '' },
    capacity: { error: false, message: '' },
    department: { error: false, message: '' }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments for the dropdown
        const departmentsData = await getDepartments();
        setDepartments(departmentsData.map(dept => dept.name));
        
        // If in edit mode, fetch the course data
        if (isEditMode) {
          const courseData = await getCourseById(id);
          setFormData({
            code: courseData.code || '',
            name: courseData.name || '',
            description: courseData.description || '',
            department: courseData.department || '',
            credits: courseData.credits || 3,
            capacity: courseData.capacity || 30,
            status: courseData.status || 'ACTIVE'
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading form data:', err);
        setError('Failed to load form data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const validateField = (name, value) => {
    let error = false;
    let message = '';

    switch (name) {
      case 'code':
        // Course code format: 2-4 letters followed by 3-4 numbers (e.g., CS101, MATH2010)
        if (!/^[A-Z]{2,4}\d{3,4}$/i.test(value)) {
          error = true;
          message = 'Format: 2-4 letters followed by 3-4 numbers (e.g., CS101)';
        }
        break;
      case 'name':
        if (value.trim().length < 3) {
          error = true;
          message = 'Must be at least 3 characters';
        } else if (value.trim().length > 100) {
          error = true;
          message = 'Cannot exceed 100 characters';
        }
        break;
      case 'credits':
        const creditsNum = Number(value);
        if (isNaN(creditsNum) || creditsNum < 1 || creditsNum > 6) {
          error = true;
          message = 'Credits must be between 1 and 6';
        }
        break;
      case 'capacity':
        const capacityNum = Number(value);
        if (isNaN(capacityNum) || capacityNum < 5 || capacityNum > 300) {
          error = true;
          message = 'Capacity must be between 5 and 300';
        }
        break;
      case 'department':
        if (!value || value.trim() === '') {
          error = true;
          message = 'Department is required';
        }
        break;
      default:
        break;
    }

    return { error, message };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field if it's one we care about
    if (['code', 'name', 'credits', 'capacity', 'department'].includes(name)) {
      const fieldValidation = validateField(name, value);
      setValidation(prev => ({
        ...prev,
        [name]: fieldValidation
      }));
    }
  };

  const validateForm = () => {
    const newValidation = {};
    let isValid = true;

    // Validate each required field
    Object.keys(validation).forEach(field => {
      const fieldValue = formData[field];
      const fieldValidation = validateField(field, fieldValue);
      newValidation[field] = fieldValidation;
      
      if (fieldValidation.error) {
        isValid = false;
      }
    });

    // Update validation state
    setValidation(newValidation);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create a copy of the form data to avoid modifying state directly
      const submissionData = { ...formData };
      
      // Convert numeric strings to numbers
      if (typeof submissionData.credits === 'string') {
        submissionData.credits = parseInt(submissionData.credits, 10);
      }
      
      if (typeof submissionData.capacity === 'string') {
        submissionData.capacity = parseInt(submissionData.capacity, 10);
      }
      
      console.log('Submitting course data:', submissionData);
      
      if (isEditMode) {
        await updateCourse(id, submissionData);
      } else {
        await createCourse(submissionData);
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/courses');
      }, 1500);
    } catch (err) {
      console.error('Error saving course:', err);
      setError('Failed to save course. Please check your input and try again.');
      setLoading(false);
    }
  };

  return (
    <Box className="page-container">
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/courses"
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Edit Course' : 'Add New Course'}
          </Typography>
        </Box>
        
        <Paper elevation={3} sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Course {isEditMode ? 'updated' : 'created'} successfully!
            </Alert>
          )}
          
          {loading && !error ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="code"
                    label="Course Code"
                    value={formData.code}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={validation.code.error}
                    helperText={validation.code.message || "e.g., CS101, MTH201"}
                    inputProps={{ 
                      maxLength: 10,
                      style: { textTransform: 'uppercase' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="name"
                    label="Course Name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={validation.name.error}
                    helperText={validation.name.message}
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    inputProps={{ maxLength: 500 }}
                    helperText={`${formData.description.length}/500 characters`}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl 
                    fullWidth 
                    required
                    error={validation.department.error}
                  >
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      label="Department"
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </Select>
                    {validation.department.error && (
                      <FormHelperText>{validation.department.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="credits"
                    label="Credits"
                    type="number"
                    value={formData.credits}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={validation.credits.error}
                    helperText={validation.credits.message || "1-6 credits"}
                    inputProps={{ min: 1, max: 6 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="capacity"
                    label="Capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={validation.capacity.error}
                    helperText={validation.capacity.message || "Maximum number of students"}
                    inputProps={{ min: 5, max: 300 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      label="Status"
                    >
                      <MenuItem value="ACTIVE">Active</MenuItem>
                      <MenuItem value="INACTIVE">Inactive</MenuItem>
                    </Select>
                    <FormHelperText>Current state of the course</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/courses')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      {isEditMode ? 'Update Course' : 'Add Course'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CourseForm; 