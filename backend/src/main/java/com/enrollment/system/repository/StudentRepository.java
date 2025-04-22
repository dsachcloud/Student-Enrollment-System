package com.enrollment.system.repository;

import com.enrollment.system.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByEmail(String email);
    
    List<Student> findByLastNameContainingIgnoreCase(String lastName);
    
    @Query("SELECT s FROM Student s JOIN s.enrolledCourses c WHERE c.id = :courseId")
    List<Student> findStudentsByCourseId(Long courseId);
    
    boolean existsByEmail(String email);
} 