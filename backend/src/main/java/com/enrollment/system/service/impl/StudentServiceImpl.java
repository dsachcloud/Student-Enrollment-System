package com.enrollment.system.service.impl;

import com.enrollment.system.dto.StudentDTO;
import com.enrollment.system.exception.ResourceNotFoundException;
import com.enrollment.system.model.Course;
import com.enrollment.system.model.Student;
import com.enrollment.system.repository.CourseRepository;
import com.enrollment.system.repository.StudentRepository;
import com.enrollment.system.service.StudentService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentServiceImpl implements StudentService {
    
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    @Override
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(StudentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return StudentDTO.fromEntity(student);
    }

    @Override
    public StudentDTO getStudentByEmail(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + email));
        return StudentDTO.fromEntity(student);
    }

    @Override
    public List<StudentDTO> getStudentsByLastName(String lastName) {
        return studentRepository.findByLastNameContainingIgnoreCase(lastName).stream()
                .map(StudentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getStudentsByCourseId(Long courseId) {
        return studentRepository.findStudentsByCourseId(courseId).stream()
                .map(StudentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDTO createStudent(StudentDTO studentDTO) {
        if (studentRepository.existsByEmail(studentDTO.getEmail())) {
            throw new ValidationException("Email already in use: " + studentDTO.getEmail());
        }
        
        Student student = new Student();
        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setEmail(studentDTO.getEmail());
        student.setPhoneNumber(studentDTO.getPhoneNumber());
        student.setDateOfBirth(studentDTO.getDateOfBirth());
        student.setAddress(studentDTO.getAddress());
        student.setGender(studentDTO.getGender());
        student.setEnrollmentDate(LocalDate.now());
        
        if (studentDTO.getEnrolledCourseIds() != null && !studentDTO.getEnrolledCourseIds().isEmpty()) {
            student.setEnrolledCourses(new HashSet<>());
            for (Long courseId : studentDTO.getEnrolledCourseIds()) {
                Course course = courseRepository.findById(courseId)
                        .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
                student.getEnrolledCourses().add(course);
            }
        }
        
        Student savedStudent = studentRepository.save(student);
        return StudentDTO.fromEntity(savedStudent);
    }

    @Override
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        if (!student.getEmail().equals(studentDTO.getEmail()) && 
                studentRepository.existsByEmail(studentDTO.getEmail())) {
            throw new ValidationException("Email already in use: " + studentDTO.getEmail());
        }
        
        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setEmail(studentDTO.getEmail());
        student.setPhoneNumber(studentDTO.getPhoneNumber());
        student.setDateOfBirth(studentDTO.getDateOfBirth());
        student.setAddress(studentDTO.getAddress());
        student.setGender(studentDTO.getGender());
        
        Student updatedStudent = studentRepository.save(student);
        return StudentDTO.fromEntity(updatedStudent);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    public StudentDTO enrollStudentInCourse(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        
        // Check if student is already enrolled in the course
        if (student.getEnrolledCourses().contains(course)) {
            throw new ValidationException("Student is already enrolled in this course");
        }
        
        // Check if the course has reached its capacity
        if (course.getCapacity() != null && course.getEnrolledStudents().size() >= course.getCapacity()) {
            throw new ValidationException("Course has reached its maximum capacity");
        }
        
        student.getEnrolledCourses().add(course);
        Student updatedStudent = studentRepository.save(student);
        
        return StudentDTO.fromEntity(updatedStudent);
    }

    @Override
    public StudentDTO withdrawStudentFromCourse(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        
        // Check if student is enrolled in the course
        if (!student.getEnrolledCourses().contains(course)) {
            throw new ValidationException("Student is not enrolled in this course");
        }
        
        student.getEnrolledCourses().remove(course);
        Student updatedStudent = studentRepository.save(student);
        
        return StudentDTO.fromEntity(updatedStudent);
    }
} 