package com.enrollment.system.service;

import com.enrollment.system.dto.StudentDTO;

import java.util.List;

public interface StudentService {
    
    List<StudentDTO> getAllStudents();
    
    StudentDTO getStudentById(Long id);
    
    StudentDTO getStudentByEmail(String email);
    
    List<StudentDTO> getStudentsByLastName(String lastName);
    
    List<StudentDTO> getStudentsByCourseId(Long courseId);
    
    StudentDTO createStudent(StudentDTO studentDTO);
    
    StudentDTO updateStudent(Long id, StudentDTO studentDTO);
    
    void deleteStudent(Long id);
    
    StudentDTO enrollStudentInCourse(Long studentId, Long courseId);
    
    StudentDTO withdrawStudentFromCourse(Long studentId, Long courseId);
} 