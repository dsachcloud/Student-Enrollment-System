import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box } from '@mui/material';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/students/StudentList';
import StudentForm from './pages/students/StudentForm';
import StudentDetails from './pages/students/StudentDetails';
import CourseList from './pages/courses/CourseList';
import CourseForm from './pages/courses/CourseForm';
import CourseDetails from './pages/courses/CourseDetails';
import DepartmentList from './pages/departments/DepartmentList';
import DepartmentForm from './pages/departments/DepartmentForm';
import DepartmentDetails from './pages/departments/DepartmentDetails';
import NotFound from './pages/NotFound';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box sx={{ flex: 1, paddingTop: '64px' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/new" element={<StudentForm />} />
              <Route path="/students/:id" element={<StudentDetails />} />
              <Route path="/students/:id/edit" element={<StudentForm />} />
              
              <Route path="/courses" element={<CourseList />} />
              <Route path="/courses/new" element={<CourseForm />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/courses/:id/edit" element={<CourseForm />} />
              
              <Route path="/departments" element={<DepartmentList />} />
              <Route path="/departments/new" element={<DepartmentForm />} />
              <Route path="/departments/:id" element={<DepartmentDetails />} />
              <Route path="/departments/:id/edit" element={<DepartmentForm />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </LocalizationProvider>
  );
}

export default App;