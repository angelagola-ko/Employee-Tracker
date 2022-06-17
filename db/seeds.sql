INSERT INTO department (name)
VALUES
    ('Engineering'),
    ('Sales'),
    ('Human Resources'),
    ('Marketing');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('engineer', 80000, 1),
    ('sales_mgr', 50000, 2),
    ('hr', 49000, 3),
    ('marketing_mgr', 75000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('angela','martinez', 2, NULL),
    ('bob','brown', 1, 1),
    ('Jess','Jay', 4, NULL),
    ('Ed', 'Sheeran', 3, 3);

