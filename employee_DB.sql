  
DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE departments(
id INT AUTO_INCREMENT,
PRIMARY KEY (id),
name VARCHAR(30)
);

CREATE TABLE roles(
id INT AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL(10, 2),
department_id INT,
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees(
id INT AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT,
manager_id INT,
PRIMARY KEY (id),
FOREIGN KEY (role_id) REFERENCES roles(id),
FOREIGN KEY (manager_id) REFERENCES employees(id)
);

INSERT INTO departments (name) values ('testing');
INSERT INTO departments (name) values ('development');

INSERT INTO roles (title, salary) values ('tester', 10000);
INSERT INTO roles (title, salary) values ('developer', 20000);

INSERT INTO employees (first_name, last_name) values ('tester', 'testerson');
INSERT INTO employees (first_name, last_name) values ('developer', 'developerson');