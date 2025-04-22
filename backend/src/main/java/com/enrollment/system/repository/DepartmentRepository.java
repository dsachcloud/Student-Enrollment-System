package com.enrollment.system.repository;

import com.enrollment.system.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    
    Optional<Department> findByCode(String code);
    
    List<Department> findByNameContainingIgnoreCase(String name);
    
    boolean existsByCode(String code);
} 