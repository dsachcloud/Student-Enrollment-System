import api from './api';

const ENDPOINT = '/courses';
const STORAGE_KEY = 'mock_courses';

// Initialize mock data if not already in localStorage
const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const initialCourses = [
      { id: 1, code: 'IT101', name: 'Fundamentals of Programming', department: 'Information Technology', credits: 3, status: 'ACTIVE' },
      { id: 2, code: 'ME201', name: 'Engineering Mechanics', department: 'Mechanical Engineering', credits: 4, status: 'ACTIVE' },
      { id: 3, code: 'HIN105', name: 'Contemporary Hindi Literature', department: 'Hindi Literature', credits: 3, status: 'ACTIVE' },
      { id: 4, code: 'BT110', name: 'Biodiversity of Indian Subcontinent', department: 'Biotechnology', credits: 4, status: 'ACTIVE' },
      { id: 5, code: 'AIH100', name: 'Vedic History and Culture', department: 'Ancient Indian History', credits: 3, status: 'ACTIVE' },
      { id: 6, code: 'EC202', name: 'Microprocessors and Microcontrollers', department: 'Electronics & Communication', credits: 4, status: 'ACTIVE' },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCourses));
  }
};

// Helper to get courses from localStorage
const getMockCourses = () => {
  initializeMockData();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

// Helper to save courses to localStorage
const saveMockCourses = (courses) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
};

// Fetch all courses
export const getCourses = async () => {
  try {
    // For now, return mock data from localStorage
    return getMockCourses();
    
    // Uncomment when backend is ready
    // const response = await api.get(ENDPOINT);
    // return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return []; // Return empty array instead of throwing to prevent UI crashes
  }
};

// Fetch a course by ID
export const getCourseById = async (id) => {
  try {
    // Get course from localStorage
    const courses = getMockCourses();
    const course = courses.find(c => c.id === parseInt(id));
    
    if (course) {
      // Add additional details based on course department
      let courseDetails = {
        description: 'An introductory course covering fundamental concepts with practical applications relevant to Indian industry.',
        capacity: 30,
        enrolledStudents: 22,
        instructor: 'Dr. Rajesh Khanna',
        schedule: 'Mon, Wed, Fri 10:00 AM - 11:15 AM',
        location: 'APJ Abdul Kalam Block, Room 101',
        prerequisites: ['None'],
        startDate: '2023-07-15',
        endDate: '2023-11-30'
      };
      
      // Customize details based on course
      if (course.department === 'Information Technology') {
        courseDetails.description = 'A comprehensive course on programming fundamentals with emphasis on practical applications in the Indian IT industry.';
        courseDetails.instructor = 'Dr. Rajesh Khanna';
        courseDetails.location = 'APJ Abdul Kalam Block, Lab 101';
      } else if (course.department === 'Mechanical Engineering') {
        courseDetails.description = 'Study of forces and their effect on rigid bodies, with applications in Indian manufacturing sector.';
        courseDetails.instructor = 'Dr. Suresh Patel';
        courseDetails.location = 'Visvesvaraya Block, Room 205';
      } else if (course.department === 'Hindi Literature') {
        courseDetails.description = 'Exploration of modern Hindi literary works by prominent Indian authors.';
        courseDetails.instructor = 'Dr. Meera Patel';
        courseDetails.location = 'Premchand Bhavan, Room 102';
      } else if (course.department === 'Ancient Indian History') {
        courseDetails.description = 'Study of ancient Indian civilizations, cultural heritage and historical developments.';
        courseDetails.instructor = 'Dr. Arjun Reddy';
        courseDetails.location = 'Tagore Block, Room 110';
      } else if (course.department === 'Biotechnology') {
        courseDetails.description = 'Study of India\'s rich biodiversity and its applications in biotechnology.';
        courseDetails.instructor = 'Dr. Sunita Sharma';
        courseDetails.location = 'CV Raman Block, Lab 203';
      } else if (course.department === 'Electronics & Communication') {
        courseDetails.description = 'Study of microprocessor architecture and applications in embedded systems.';
        courseDetails.instructor = 'Dr. Vikram Malhotra';
        courseDetails.location = 'JC Bose Block, Lab 105';
      }
      
      // Return course with additional details
      return {
        ...course,
        ...courseDetails
      };
    }
    
    throw new Error(`Course with ID ${id} not found`);
    
    // Uncomment when backend is ready
    // const response = await api.get(`${ENDPOINT}/${id}`);
    // return response.data;
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    throw error;
  }
};

// Create a new course
export const createCourse = async (courseData) => {
  try {
    // Get current courses
    const courses = getMockCourses();
    
    // Create new course with ID
    const newCourse = {
      ...courseData,
      id: Math.max(0, ...courses.map(c => c.id)) + 1
    };
    
    // Add to courses and save
    courses.push(newCourse);
    saveMockCourses(courses);
    
    console.log('Created course:', newCourse);
    return newCourse;
    
    // Uncomment when backend is ready
    // const response = await api.post(ENDPOINT, courseData);
    // return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

// Update a course
export const updateCourse = async (id, courseData) => {
  try {
    // Get current courses
    const courses = getMockCourses();
    const courseIndex = courses.findIndex(c => c.id === parseInt(id));
    
    if (courseIndex === -1) {
      throw new Error(`Course with ID ${id} not found`);
    }
    
    // Update course
    const updatedCourse = { ...courseData, id: parseInt(id) };
    courses[courseIndex] = updatedCourse;
    
    // Save updated courses
    saveMockCourses(courses);
    
    console.log(`Updated course ${id}:`, updatedCourse);
    return updatedCourse;
    
    // Uncomment when backend is ready
    // const response = await api.put(`${ENDPOINT}/${id}`, courseData);
    // return response.data;
  } catch (error) {
    console.error(`Error updating course ${id}:`, error);
    throw error;
  }
};

// Delete a course
export const deleteCourse = async (id) => {
  try {
    // Get current courses
    const courses = getMockCourses();
    const filteredCourses = courses.filter(c => c.id !== parseInt(id));
    
    // Save filtered courses
    saveMockCourses(filteredCourses);
    
    console.log(`Deleted course ${id}`);
    return true;
    
    // Uncomment when backend is ready
    // await api.delete(`${ENDPOINT}/${id}`);
    // return true;
  } catch (error) {
    console.error(`Error deleting course ${id}:`, error);
    throw error;
  }
};

// Get students enrolled in a course
export const getStudentsByCourseId = async (courseId) => {
  try {
    // Mock data for now
    const mockStudents = [
      { id: 1, firstName: 'Rahul', lastName: 'Sharma', email: 'rahul.sharma@example.com' },
      { id: 2, firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@example.com' },
      { id: 3, firstName: 'Arjun', lastName: 'Singh', email: 'arjun.singh@example.com' },
    ];
    
    return mockStudents;
    
    // Uncomment when backend is ready
    // const response = await api.get(`${ENDPOINT}/${courseId}/students`);
    // return response.data;
  } catch (error) {
    console.error(`Error fetching students for course ${courseId}:`, error);
    return [];
  }
}; 