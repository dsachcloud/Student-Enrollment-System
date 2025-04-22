package com.enrollment.system.dto;

import com.enrollment.system.model.Course;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    
    private Long id;
    
    @NotBlank(message = "Course code is required")
    private String courseCode;
    
    @NotBlank(message = "Course name is required")
    private String courseName;
    
    private String description;
    
    @NotNull(message = "Credit hours are required")
    @Positive(message = "Credit hours must be positive")
    private Integer creditHours;
    
    private Course.CourseType courseType;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private Long departmentId;
    
    private String departmentName;
    
    private Set<Long> enrolledStudentIds;
    
    private Integer capacity;
    
    // Convert Course entity to DTO
    public static CourseDTO fromEntity(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setCourseCode(course.getCourseCode());
        dto.setCourseName(course.getCourseName());
        dto.setDescription(course.getDescription());
        dto.setCreditHours(course.getCreditHours());
        dto.setCourseType(course.getCourseType());
        dto.setStartDate(course.getStartDate());
        dto.setEndDate(course.getEndDate());
        dto.setCapacity(course.getCapacity());
        
        if (course.getDepartment() != null) {
            dto.setDepartmentId(course.getDepartment().getId());
            dto.setDepartmentName(course.getDepartment().getName());
        }
        
        if (course.getEnrolledStudents() != null) {
            dto.setEnrolledStudentIds(course.getEnrolledStudents().stream()
                    .map(student -> student.getId())
                    .collect(Collectors.toSet()));
        }
        
        return dto;
    }
} 