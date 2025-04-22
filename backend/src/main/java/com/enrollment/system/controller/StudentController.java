package com.enrollment.system.controller;

import com.enrollment.system.dto.StudentDTO;
import com.enrollment.system.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {
    
    private final StudentService studentService;
    
    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<StudentDTO> getStudentByEmail(@PathVariable String email) {
        return ResponseEntity.ok(studentService.getStudentByEmail(email));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<StudentDTO>> getStudentsByLastName(@RequestParam String lastName) {
        return ResponseEntity.ok(studentService.getStudentsByLastName(lastName));
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<StudentDTO>> getStudentsByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(studentService.getStudentsByCourseId(courseId));
    }
    
    @PostMapping
    public ResponseEntity<StudentDTO> createStudent(@Valid @RequestBody StudentDTO studentDTO) {
        return new ResponseEntity<>(studentService.createStudent(studentDTO), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentDTO studentDTO) {
        return ResponseEntity.ok(studentService.updateStudent(id, studentDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{studentId}/enroll/{courseId}")
    public ResponseEntity<StudentDTO> enrollStudentInCourse(
            @PathVariable Long studentId, @PathVariable Long courseId) {
        return ResponseEntity.ok(studentService.enrollStudentInCourse(studentId, courseId));
    }
    
    @DeleteMapping("/{studentId}/withdraw/{courseId}")
    public ResponseEntity<StudentDTO> withdrawStudentFromCourse(
            @PathVariable Long studentId, @PathVariable Long courseId) {
        return ResponseEntity.ok(studentService.withdrawStudentFromCourse(studentId, courseId));
    }
} 