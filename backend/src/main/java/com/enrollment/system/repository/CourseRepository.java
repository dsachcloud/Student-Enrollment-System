package com.enrollment.system.repository;

import com.enrollment.system.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    Optional<Course> findByCourseCode(String courseCode);
    
    List<Course> findByCourseNameContainingIgnoreCase(String courseName);
    
    List<Course> findByDepartmentId(Long departmentId);
    
    @Query("SELECT c FROM Course c JOIN c.enrolledStudents s WHERE s.id = :studentId")
    List<Course> findCoursesByStudentId(Long studentId);
    
    boolean existsByCourseCode(String courseCode);
} 