import api from './api';

const ENDPOINT = '/students';
const STORAGE_KEY = 'mock_students';

// Initialize mock data if not already in localStorage
const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const initialStudents = [
      { 
        id: 1, 
        firstName: 'Rahul', 
        lastName: 'Sharma', 
        email: 'rahul.sharma@example.com', 
        phoneNumber: '9876543210', 
        gender: 'MALE',
        dateOfBirth: '2000-05-15',
        address: '123, Vikram Nagar, New Delhi - 110001',
        enrollmentDate: '2022-07-15',
        status: 'ACTIVE'
      },
      { 
        id: 2, 
        firstName: 'Priya', 
        lastName: 'Patel', 
        email: 'priya.patel@example.com', 
        phoneNumber: '9898765432', 
        gender: 'FEMALE',
        dateOfBirth: '2001-08-21',
        address: '45, Gandhi Road, Mumbai - 400001',
        enrollmentDate: '2022-07-10',
        status: 'ACTIVE'
      },
      { 
        id: 3, 
        firstName: 'Arjun', 
        lastName: 'Singh', 
        email: 'arjun.singh@example.com', 
        phoneNumber: '7778889990', 
        gender: 'MALE',
        dateOfBirth: '2000-11-03',
        address: '789, MG Road, Bangalore - 560001',
        enrollmentDate: '2022-07-12',
        status: 'ACTIVE'
      },
      { 
        id: 4, 
        firstName: 'Meera', 
        lastName: 'Desai', 
        email: 'meera.desai@example.com', 
        phoneNumber: '9876123450', 
        gender: 'FEMALE',
        dateOfBirth: '2001-03-25',
        address: '56, Civil Lines, Pune - 411001',
        enrollmentDate: '2022-07-05',
        status: 'ACTIVE'
      },
      { 
        id: 5, 
        firstName: 'Vikram', 
        lastName: 'Verma', 
        email: 'vikram.verma@example.com', 
        phoneNumber: '8765432109', 
        gender: 'MALE',
        dateOfBirth: '2000-07-30',
        address: '321, Lake Gardens, Kolkata - 700045',
        enrollmentDate: '2022-07-20',
        status: 'INACTIVE'
      },
      { 
        id: 6, 
        firstName: 'Anjali', 
        lastName: 'Agarwal', 
        email: 'anjali.agarwal@example.com', 
        phoneNumber: '7654321098', 
        gender: 'FEMALE',
        dateOfBirth: '2001-12-12',
        address: '23, Park Street, Chennai - 600001',
        enrollmentDate: '2022-07-08',
        status: 'ACTIVE'
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStudents));
  }
};

// Helper to get students from localStorage
const getMockStudents = () => {
  initializeMockData();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

// Helper to save students to localStorage
const saveMockStudents = (students) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

// Fetch all students
export const getStudents = async () => {
  try {
    // For now, return mock data from localStorage
    return getMockStudents();
    
    // Uncomment when backend is ready
    // const response = await api.get(ENDPOINT);
    // return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    return []; // Return empty array instead of throwing to prevent UI crashes
  }
};

// Fetch a student by ID
export const getStudentById = async (id) => {
  try {
    // Get student from localStorage
    const students = getMockStudents();
    const student = students.find(s => s.id === parseInt(id));
    
    if (student) {
      return student;
    }
    
    throw new Error(`Student with ID ${id} not found`);
    
    // Uncomment when backend is ready
    // const response = await api.get(`${ENDPOINT}/${id}`);
    // return response.data;
  } catch (error) {
    console.error(`Error fetching student ${id}:`, error);
    throw error;
  }
};

// Fetch students by course ID
export const getStudentsByCourseId = async (courseId) => {
  try {
    // Mock data for students in a specific course
    const mockStudents = [
      { id: 1, firstName: 'Rahul', lastName: 'Sharma', email: 'rahul.sharma@example.com' },
      { id: 2, firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@example.com' },
      { id: 3, firstName: 'Arjun', lastName: 'Singh', email: 'arjun.singh@example.com' },
    ];
    
    return mockStudents;
    
    // Uncomment when backend is ready
    // const response = await api.get(`${ENDPOINT}/course/${courseId}`);
    // return response.data;
  } catch (error) {
    console.error(`Error fetching students for course ${courseId}:`, error);
    return [];
  }
};

// Create a new student
export const createStudent = async (studentData) => {
  try {
    // Get current students
    const students = getMockStudents();
    
    // Create new student with ID
    const newStudent = {
      ...studentData,
      id: Math.max(0, ...students.map(s => s.id)) + 1,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };
    
    // Add to students and save
    students.push(newStudent);
    saveMockStudents(students);
    
    console.log('Created student:', newStudent);
    return newStudent;
    
    // Uncomment when backend is ready
    // const response = await api.post(ENDPOINT, studentData);
    // return response.data;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

// Update a student
export const updateStudent = async (id, studentData) => {
  try {
    // Get current students
    const students = getMockStudents();
    const studentIndex = students.findIndex(s => s.id === parseInt(id));
    
    if (studentIndex === -1) {
      throw new Error(`Student with ID ${id} not found`);
    }
    
    // Update student
    const updatedStudent = { 
      ...studentData, 
      id: parseInt(id),
      enrollmentDate: students[studentIndex].enrollmentDate,
      status: studentData.status || students[studentIndex].status
    };
    
    students[studentIndex] = updatedStudent;
    
    // Save updated students
    saveMockStudents(students);
    
    console.log(`Updated student ${id}:`, updatedStudent);
    return updatedStudent;
    
    // Uncomment when backend is ready
    // const response = await api.put(`${ENDPOINT}/${id}`, studentData);
    // return response.data;
  } catch (error) {
    console.error(`Error updating student ${id}:`, error);
    throw error;
  }
};

// Delete a student
export const deleteStudent = async (id) => {
  try {
    // Get current students
    const students = getMockStudents();
    const filteredStudents = students.filter(s => s.id !== parseInt(id));
    
    // Save filtered students
    saveMockStudents(filteredStudents);
    
    console.log(`Deleted student ${id}`);
    return true;
    
    // Uncomment when backend is ready
    // await api.delete(`${ENDPOINT}/${id}`);
    // return true;
  } catch (error) {
    console.error(`Error deleting student ${id}:`, error);
    throw error;
  }
};

// Enroll a student in a course
export const enrollStudentInCourse = async (studentId, courseId) => {
  try {
    // Mock implementation - normally this would update a database relationship
    console.log(`Enrolled student ${studentId} in course ${courseId}`);
    return { success: true };
    
    // Uncomment when backend is ready
    // const response = await api.post(`${ENDPOINT}/${studentId}/enroll/${courseId}`);
    // return response.data;
  } catch (error) {
    console.error(`Error enrolling student ${studentId} in course ${courseId}:`, error);
    throw error;
  }
};

// Withdraw a student from a course
export const withdrawStudentFromCourse = async (studentId, courseId) => {
  try {
    // Mock implementation - normally this would update a database relationship
    console.log(`Withdrew student ${studentId} from course ${courseId}`);
    return { success: true };
    
    // Uncomment when backend is ready
    // const response = await api.delete(`${ENDPOINT}/${studentId}/withdraw/${courseId}`);
    // return response.data;
  } catch (error) {
    console.error(`Error withdrawing student ${studentId} from course ${courseId}:`, error);
    throw error;
  }
}; 