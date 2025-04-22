package com.enrollment.system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Course code is required")
    @Column(unique = true)
    private String courseCode;
    
    @NotBlank(message = "Course name is required")
    private String courseName;
    
    private String description;
    
    @NotNull(message = "Credit hours are required")
    @Positive(message = "Credit hours must be positive")
    private Integer creditHours;
    
    @Enumerated(EnumType.STRING)
    private CourseType courseType;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
    
    @ManyToMany(mappedBy = "enrolledCourses")
    private Set<Student> enrolledStudents = new HashSet<>();
    
    private Integer capacity;
    
    public enum CourseType {
        CORE, ELECTIVE, LAB, SEMINAR
    }
} 