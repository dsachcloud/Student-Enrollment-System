import api from './api';

const ENDPOINT = '/departments';
const STORAGE_KEY = 'mock_departments';

// Clear department data from localStorage and reinitialize
export const resetDepartmentData = () => {
  localStorage.removeItem(STORAGE_KEY);
  initializeMockData();
  console.log('Department data has been reset with new values');
  return true;
};

// Initialize mock data if not already in localStorage
const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const initialDepartments = [
      { id: 1, name: 'Information Technology', head: 'Prof. Rajendra Kumar Sharma', foundedYear: 1985, status: 'ACTIVE', studentsCount: 120, coursesCount: 15 },
      { id: 2, name: 'Mechanical Engineering', head: 'Prof. Suresh Kumar Patel', foundedYear: 1950, status: 'ACTIVE', studentsCount: 85, coursesCount: 12 },
      { id: 3, name: 'Electronics & Communication', head: 'Prof. Vikram Singh Malhotra', foundedYear: 1960, status: 'ACTIVE', studentsCount: 65, coursesCount: 10 },
      { id: 4, name: 'Biotechnology', head: 'Prof. Sunita Rajesh Sharma', foundedYear: 1970, status: 'ACTIVE', studentsCount: 90, coursesCount: 14 },
      { id: 5, name: 'Ancient Indian History', head: 'Prof. Arjun Krishnan Reddy', foundedYear: 1955, status: 'ACTIVE', studentsCount: 40, coursesCount: 8 },
      { id: 6, name: 'Hindi Literature', head: 'Prof. Meera Anand Patel', foundedYear: 1965, status: 'ACTIVE', studentsCount: 75, coursesCount: 9 },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDepartments));
  }
};

// Helper to get departments from localStorage
const getMockDepartments = () => {
  initializeMockData();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

// Helper to save departments to localStorage
const saveMockDepartments = (departments) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(departments));
};

// Fetch all departments
export const getDepartments = async () => {
  try {
    // Force reset data to ensure new names are loaded
    resetDepartmentData();
    
    // For now, return mock data from localStorage
    return getMockDepartments();
    
    // Uncomment when backend is ready
    // const response = await api.get(ENDPOINT);
    // return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    return []; // Return empty array instead of throwing to prevent UI crashes
  }
};

// Fetch a department by ID
export const getDepartmentById = async (id) => {
  try {
    // Get department from localStorage
    const departments = getMockDepartments();
    const department = departments.find(d => d.id === parseInt(id));
    
    if (department) {
      // Add additional details not stored in the list view
      return {
        ...department,
        description: department.description || 'Department focused on cutting-edge technology fields with emphasis on developing skills relevant to Indian IT industry.',
        location: department.location || 'APJ Abdul Kalam Block, Second Floor',
        budget: department.budget || 50000000,
        email: department.email || 'it.department@university.ac.in',
        phone: department.phone || '011-2345-6789',
        courses: department.courses || [
          { id: 1, code: 'IT101', name: 'Introduction to Programming', credits: 3 },
          { id: 2, code: 'IT201', name: 'Data Structures and Algorithms', credits: 4 },
          { id: 3, code: 'IT301', name: 'Database Management Systems', credits: 4 },
        ],
        faculty: department.faculty || [
          { id: 1, name: department.head, position: 'Department Head', email: department.head.toLowerCase().replace(/\s+/g, '.').replace(/\./g, '.') + '@university.ac.in' },
          { id: 2, name: 'Dr. Anjali Narayan Singh', position: 'Professor', email: 'anjali.singh@university.ac.in' },
          { id: 3, name: 'Dr. Rajendra Mohan Prasad', position: 'Associate Professor', email: 'rajendra.prasad@university.ac.in' },
          { id: 4, name: 'Dr. Aishwarya Krishnan', position: 'Assistant Professor', email: 'aishwarya.krishnan@university.ac.in' },
          { id: 5, name: 'Dr. Gopal Chandra Verma', position: 'Assistant Professor', email: 'gopal.verma@university.ac.in' },
        ]
      };
    }
    
    throw new Error(`Department with ID ${id} not found`);
    
    // Uncomment when backend is ready
    // const response = await api.get(`${ENDPOINT}/${id}`);
    // return response.data;
  } catch (error) {
    console.error(`Error fetching department ${id}:`, error);
    throw error;
  }
};

// Create a new department
export const createDepartment = async (departmentData) => {
  try {
    // Get current departments
    const departments = getMockDepartments();
    
    // Create new department with ID
    const newDepartment = {
      ...departmentData,
      id: Math.max(0, ...departments.map(d => d.id)) + 1,
      studentsCount: 0,
      coursesCount: 0
    };
    
    // Add to departments and save
    departments.push(newDepartment);
    saveMockDepartments(departments);
    
    console.log('Created department:', newDepartment);
    return newDepartment;
    
    // Uncomment when backend is ready
    // const response = await api.post(ENDPOINT, departmentData);
    // return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

// Update a department
export const updateDepartment = async (id, departmentData) => {
  try {
    // Get current departments
    const departments = getMockDepartments();
    const departmentIndex = departments.findIndex(d => d.id === parseInt(id));
    
    if (departmentIndex === -1) {
      throw new Error(`Department with ID ${id} not found`);
    }
    
    // Preserve student and course counts
    const existingCounts = {
      studentsCount: departments[departmentIndex].studentsCount || 0,
      coursesCount: departments[departmentIndex].coursesCount || 0
    };
    
    // Update department
    const updatedDepartment = { 
      ...departmentData, 
      id: parseInt(id),
      ...existingCounts
    };
    
    departments[departmentIndex] = updatedDepartment;
    
    // Save updated departments
    saveMockDepartments(departments);
    
    console.log(`Updated department ${id}:`, updatedDepartment);
    return updatedDepartment;
    
    // Uncomment when backend is ready
    // const response = await api.put(`${ENDPOINT}/${id}`, departmentData);
    // return response.data;
  } catch (error) {
    console.error(`Error updating department ${id}:`, error);
    throw error;
  }
};

// Delete a department
export const deleteDepartment = async (id) => {
  try {
    // Get current departments
    const departments = getMockDepartments();
    const filteredDepartments = departments.filter(d => d.id !== parseInt(id));
    
    // Save filtered departments
    saveMockDepartments(filteredDepartments);
    
    console.log(`Deleted department ${id}`);
    return true;
    
    // Uncomment when backend is ready
    // await api.delete(`${ENDPOINT}/${id}`);
    // return true;
  } catch (error) {
    console.error(`Error deleting department ${id}:`, error);
    throw error;
  }
};

// Get courses in a department
export const getCoursesByDepartmentId = async (departmentId) => {
  try {
    // Get department details which already has courses
    const department = await getDepartmentById(departmentId);
    return department.courses || [];
    
    // Uncomment when backend is ready
    // const response = await api.get(`${ENDPOINT}/${departmentId}/courses`);
    // return response.data;
  } catch (error) {
    console.error(`Error fetching courses for department ${departmentId}:`, error);
    return [];
  }
}; 