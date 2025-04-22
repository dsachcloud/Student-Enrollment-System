package com.enrollment.system.dto;

import com.enrollment.system.model.Student;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    
    private Long id;
    
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number should be valid")
    private String phoneNumber;
    
    private LocalDate dateOfBirth;
    
    private String address;
    
    private Student.Gender gender;
    
    private Set<Long> enrolledCourseIds;
    
    private LocalDate enrollmentDate;
    
    // Convert Student entity to DTO
    public static StudentDTO fromEntity(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setEmail(student.getEmail());
        dto.setPhoneNumber(student.getPhoneNumber());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setAddress(student.getAddress());
        dto.setGender(student.getGender());
        dto.setEnrollmentDate(student.getEnrollmentDate());
        
        if (student.getEnrolledCourses() != null) {
            dto.setEnrolledCourseIds(student.getEnrolledCourses().stream()
                    .map(course -> course.getId())
                    .collect(Collectors.toSet()));
        }
        
        return dto;
    }
} 