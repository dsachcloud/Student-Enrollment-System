package com.enrollment.system.config;

import com.enrollment.system.model.Course;
import com.enrollment.system.model.Department;
import com.enrollment.system.model.Student;
import com.enrollment.system.repository.CourseRepository;
import com.enrollment.system.repository.DepartmentRepository;
import com.enrollment.system.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create Departments
        Department computerScience = new Department();
        computerScience.setName("Computer Science");
        computerScience.setCode("CS");
        computerScience.setDescription("Department of Computer Science and Engineering");

        Department mathematics = new Department();
        mathematics.setName("Mathematics");
        mathematics.setCode("MATH");
        mathematics.setDescription("Department of Mathematics and Statistics");

        Department physics = new Department();
        physics.setName("Physics");
        physics.setCode("PHY");
        physics.setDescription("Department of Physics and Astronomy");

        departmentRepository.saveAll(Arrays.asList(computerScience, mathematics, physics));

        // Create Courses
        Course javaProgramming = new Course();
        javaProgramming.setCourseCode("CS101");
        javaProgramming.setCourseName("Java Programming");
        javaProgramming.setDescription("Introduction to Java Programming Language");
        javaProgramming.setCreditHours(4);
        javaProgramming.setCourseType(Course.CourseType.CORE);
        javaProgramming.setStartDate(LocalDate.now());
        javaProgramming.setEndDate(LocalDate.now().plusMonths(3));
        javaProgramming.setCapacity(30);
        javaProgramming.setDepartment(computerScience);

        Course dataStructures = new Course();
        dataStructures.setCourseCode("CS201");
        dataStructures.setCourseName("Data Structures and Algorithms");
        dataStructures.setDescription("Advanced data structures and algorithms");
        dataStructures.setCreditHours(4);
        dataStructures.setCourseType(Course.CourseType.CORE);
        dataStructures.setStartDate(LocalDate.now());
        dataStructures.setEndDate(LocalDate.now().plusMonths(3));
        dataStructures.setCapacity(25);
        dataStructures.setDepartment(computerScience);

        Course calculus = new Course();
        calculus.setCourseCode("MATH101");
        calculus.setCourseName("Calculus I");
        calculus.setDescription("Introduction to differential and integral calculus");
        calculus.setCreditHours(3);
        calculus.setCourseType(Course.CourseType.CORE);
        calculus.setStartDate(LocalDate.now());
        calculus.setEndDate(LocalDate.now().plusMonths(3));
        calculus.setCapacity(40);
        calculus.setDepartment(mathematics);

        Course mechanics = new Course();
        mechanics.setCourseCode("PHY101");
        mechanics.setCourseName("Mechanics");
        mechanics.setDescription("Classical mechanics and dynamics");
        mechanics.setCreditHours(4);
        mechanics.setCourseType(Course.CourseType.CORE);
        mechanics.setStartDate(LocalDate.now());
        mechanics.setEndDate(LocalDate.now().plusMonths(3));
        mechanics.setCapacity(35);
        mechanics.setDepartment(physics);

        courseRepository.saveAll(Arrays.asList(javaProgramming, dataStructures, calculus, mechanics));

        // Create Students
        Student john = new Student();
        john.setFirstName("John");
        john.setLastName("Doe");
        john.setEmail("john.doe@example.com");
        john.setPhoneNumber("1234567890");
        john.setDateOfBirth(LocalDate.of(2000, 5, 15));
        john.setAddress("123 Main St, Anytown, USA");
        john.setGender(Student.Gender.MALE);
        john.setEnrollmentDate(LocalDate.now().minusMonths(2));
        john.setEnrolledCourses(new HashSet<>(Arrays.asList(javaProgramming, calculus)));

        Student jane = new Student();
        jane.setFirstName("Jane");
        jane.setLastName("Smith");
        jane.setEmail("jane.smith@example.com");
        jane.setPhoneNumber("9876543210");
        jane.setDateOfBirth(LocalDate.of(2001, 8, 22));
        jane.setAddress("456 Elm St, Anytown, USA");
        jane.setGender(Student.Gender.FEMALE);
        jane.setEnrollmentDate(LocalDate.now().minusMonths(1));
        jane.setEnrolledCourses(new HashSet<>(Arrays.asList(dataStructures, mechanics)));

        Student mike = new Student();
        mike.setFirstName("Mike");
        mike.setLastName("Johnson");
        mike.setEmail("mike.johnson@example.com");
        mike.setPhoneNumber("5551234567");
        mike.setDateOfBirth(LocalDate.of(1999, 3, 10));
        mike.setAddress("789 Oak St, Anytown, USA");
        mike.setGender(Student.Gender.MALE);
        mike.setEnrollmentDate(LocalDate.now().minusMonths(3));
        mike.setEnrolledCourses(new HashSet<>(Arrays.asList(javaProgramming, mechanics)));

        studentRepository.saveAll(Arrays.asList(john, jane, mike));
    }
} 