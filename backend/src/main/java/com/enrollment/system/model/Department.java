package com.enrollment.system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Department name is required")
    private String name;
    
    @NotBlank(message = "Department code is required")
    @Column(unique = true)
    private String code;
    
    private String description;
    
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    private Set<Course> courses = new HashSet<>();
} 