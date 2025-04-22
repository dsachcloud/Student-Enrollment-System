import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, Container, Typography, Button, Paper, 
  Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Alert, FormHelperText
} from '@mui/material';
import { getDepartmentById, createDepartment, updateDepartment } from '../../services/departmentService';

const DepartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    description: '',
    foundedYear: 2000,
    location: '',
    status: 'ACTIVE',
    budget: '',
    email: '',
    phone: ''
  });

  // Add validation state
  const [validation, setValidation] = useState({
    name: { error: false, message: '' },
    head: { error: false, message: '' },
    foundedYear: { error: false, message: '' },
    email: { error: false, message: '' },
    phone: { error: false, message: '' },
    budget: { error: false, message: '' }
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchDepartment = async () => {
        try {
          const departmentData = await getDepartmentById(id);
          
          setFormData({
            name: departmentData.name || '',
            head: departmentData.head || '',
            description: departmentData.description || '',
            foundedYear: departmentData.foundedYear || 2000,
            location: departmentData.location || '',
            status: departmentData.status || 'ACTIVE',
            budget: departmentData.budget ? departmentData.budget.toString() : '',
            email: departmentData.email || '',
            phone: departmentData.phone || ''
          });
          
          setLoading(false);
        } catch (err) {
          console.error('Error loading department:', err);
          setError('Failed to load department data. Please try again.');
          setLoading(false);
        }
      };

      fetchDepartment();
    }
  }, [id, isEditMode]);

  const validateField = (name, value) => {
    let error = false;
    let message = '';

    switch (name) {
      case 'name':
        if (value.trim().length < 3) {
          error = true;
          message = 'Must be at least 3 characters';
        } else if (value.trim().length > 100) {
          error = true;
          message = 'Cannot exceed 100 characters';
        }
        break;
      case 'head':
        if (value.trim() === '') {
          error = true;
          message = 'Department head is required';
        } else if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
          error = true;
          message = 'Invalid name format';
        }
        break;
      case 'foundedYear':
        const year = Number(value);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1800 || year > currentYear) {
          error = true;
          message = `Year must be between 1800 and ${currentYear}`;
        }
        break;
      case 'email':
        if (value.trim() === '') {
          error = true;
          message = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = true;
          message = 'Enter a valid email address';
        }
        break;
      case 'phone':
        if (value.trim() === '') {
          error = true;
          message = 'Phone number is required';
        } else if (!/^[0-9\s()+.-]+$/.test(value)) {
          error = true;
          message = 'Enter a valid phone number';
        }
        break;
      case 'budget':
        if (value !== '') { // Budget can be empty
          const budget = Number(value);
          if (isNaN(budget) || budget < 0) {
            error = true;
            message = 'Budget must be a positive number';
          } else if (budget > 10000000) {
            error = true;
            message = 'Budget cannot exceed 10 million';
          }
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
    if (['name', 'head', 'foundedYear', 'email', 'phone', 'budget'].includes(name)) {
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
      
      // Convert string values to appropriate types
      if (typeof submissionData.foundedYear === 'string') {
        submissionData.foundedYear = parseInt(submissionData.foundedYear, 10);
      }
      
      if (submissionData.budget) {
        submissionData.budget = parseInt(submissionData.budget, 10);
      }
      
      console.log('Submitting department data:', submissionData);
      
      if (isEditMode) {
        await updateDepartment(id, submissionData);
      } else {
        await createDepartment(submissionData);
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/departments');
      }, 1500);
    } catch (err) {
      console.error('Error saving department:', err);
      setError('Failed to save department. Please check your input and try again.');
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
            to="/departments"
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Edit Department' : 'Add New Department'}
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
              Department {isEditMode ? 'updated' : 'created'} successfully!
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
                    name="name"
                    label="Department Name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={validation.name.error}
                    helperText={validation.name.message}
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="head"
                    label="Department Head"
                    value={formData.head}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={validation.head.error}
                    helperText={validation.head.message || "Name and title of department head"}
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
                  <TextField
                    name="foundedYear"
                    label="Founded Year"
                    type="number"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={validation.foundedYear.error}
                    helperText={validation.foundedYear.message}
                    inputProps={{ min: 1800, max: new Date().getFullYear() }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="location"
                    label="Location"
                    value={formData.location}
                    onChange={handleChange}
                    fullWidth
                    helperText="Building and floor"
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="email"
                    label="Department Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={validation.email.error}
                    helperText={validation.email.message}
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="phone"
                    label="Department Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={validation.phone.error}
                    helperText={validation.phone.message || "Format: (123) 456-7890"}
                    inputProps={{ maxLength: 20 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="budget"
                    label="Annual Budget"
                    value={formData.budget}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                    error={validation.budget.error}
                    helperText={validation.budget.message}
                    InputProps={{
                      startAdornment: '$',
                    }}
                    inputProps={{ min: 0 }}
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
                    <FormHelperText>Current state of the department</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/departments')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      {isEditMode ? 'Update Department' : 'Add Department'}
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

export default DepartmentForm; 