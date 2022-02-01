INSERT INTO departments (department)
VALUES 
    ("Research & Development"),
    ("Human Resources");

INSERT INTO roles (title, salary, department_id)
VALUES 
    ("Engineer","100000","1"),
    ("Office Manager","70000","2");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Farley","Bacon","2","1"),
    ("Chicken","Squiggles","1","1");


