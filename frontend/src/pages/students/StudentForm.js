import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem,
  Grid, Paper, CircularProgress, Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { getStudentById, createStudent, updateStudent } from '../../services/studentService';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: null,
    address: '',
    gender: '',
  });

  // Add validation state
  const [validation, setValidation] = useState({
    firstName: { error: false, message: '' },
    lastName: { error: false, message: '' },
    email: { error: false, message: '' },
    phoneNumber: { error: false, message: '' }
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          const data = await getStudentById(id);
          setFormData({
            ...data,
            dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : null,
          });
          setLoading(false);
        } catch (err) {
          console.error('Error loading student:', err);
          setError('Failed to load student data. Please try again.');
          setLoading(false);
        }
      };

      fetchStudent();
    }
  }, [id, isEditMode]);

  const validateField = (name, value) => {
    let error = false;
    let message = '';

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (value.trim().length < 2) {
          error = true;
          message = 'Must be at least 2 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          error = true;
          message = 'Only letters, spaces, hyphens and apostrophes allowed';
        }
        break;
      case 'email':
        // Basic email validation regex
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = true;
          message = 'Enter a valid email address';
        }
        break;
      case 'phoneNumber':
        // Allow digits, spaces, parentheses, hyphens, and plus sign
        if (!/^[0-9\s()+.-]+$/.test(value)) {
          error = true;
          message = 'Enter a valid phone number';
        } else if (value.replace(/\D/g, '').length < 10) {
          error = true;
          message = 'Phone number too short';
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
    if (['firstName', 'lastName', 'email', 'phoneNumber'].includes(name)) {
      const fieldValidation = validateField(name, value);
      setValidation(prev => ({
        ...prev,
        [name]: fieldValidation
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: date,
    }));
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
      
      // Format date of birth if it exists
      if (submissionData.dateOfBirth) {
        if (typeof submissionData.dateOfBirth.format === 'function') {
          submissionData.dateOfBirth = submissionData.dateOfBirth.format('YYYY-MM-DD');
        }
      } else {
        submissionData.dateOfBirth = null;
      }
      
      // Remove any properties not needed for the API
      delete submissionData.id; // In case the id is included in data fetching
      
      console.log('Submitting student data:', submissionData);
      
      if (isEditMode) {
        await updateStudent(id, submissionData);
      } else {
        await createStudent(submissionData);
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/students');
      }, 1500);
    } catch (err) {
      console.error('Error saving student:', err);
      setError('Failed to save student. Please check your input and try again.');
      setLoading(false);
    }
  };

  return (
    <Box className="page-container">
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {isEditMode ? 'Edit Student' : 'Add New Student'}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Student {isEditMode ? 'updated' : 'created'} successfully!
            </Alert>
          )}
          
          {loading && !error ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={validation.firstName.error}
                    helperText={validation.firstName.message}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={validation.lastName.error}
                    helperText={validation.lastName.message}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="email"
                    label="Email"
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
                    name="phoneNumber"
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={validation.phoneNumber.error}
                    helperText={validation.phoneNumber.message || "Format: (123) 456-7890"}
                    inputProps={{ maxLength: 20 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={handleDateChange}
                    slotProps={{ 
                      textField: { 
                        fullWidth: true,
                        helperText: "MM/DD/YYYY"
                      } 
                    }}
                    disableFuture
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      label="Gender"
                    >
                      <MenuItem value="MALE">Male</MenuItem>
                      <MenuItem value="FEMALE">Female</MenuItem>
                      <MenuItem value="OTHER">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="address"
                    label="Address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    inputProps={{ maxLength: 255 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/students')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      {isEditMode ? 'Update Student' : 'Add Student'}
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

export default StudentForm; 