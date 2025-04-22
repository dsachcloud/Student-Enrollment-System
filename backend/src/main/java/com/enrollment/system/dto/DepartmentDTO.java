package com.enrollment.system.dto;

import com.enrollment.system.model.Department;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDTO {
    
    private Long id;
    
    @NotBlank(message = "Department name is required")
    private String name;
    
    @NotBlank(message = "Department code is required")
    private String code;
    
    private String description;
    
    private Set<Long> courseIds;
    
    // Convert Department entity to DTO
    public static DepartmentDTO fromEntity(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setCode(department.getCode());
        dto.setDescription(department.getDescription());
        
        if (department.getCourses() != null) {
            dto.setCourseIds(department.getCourses().stream()
                    .map(course -> course.getId())
                    .collect(Collectors.toSet()));
        }
        
        return dto;
    }
} 