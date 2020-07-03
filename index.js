const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Password!",
  database: "employee_DB"
});

connection.connect(function (err) {
  if (err) {
    throw err;
  }
  start();
});

function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Employees Menu",
        "View Roles Menu",
        "View Departments Menu",
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View Employees Menu":
          employeesMenu();
          break;

        case "View Roles Menu":
          rolesMenu();
          break;

        case "View Departments Menu":
          departmentsMenu();
          break;

        default:
          process.exit();
      }
    });
}

async function employeesMenu() {
  const response = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: ["View All Employees",
      "View Employees By Manager",
      "Add Employee",
      "Delete Employee",
      "Return"
    ]
  })

  switch (response.action) {
    case "View All Employees":
      viewAllEmployees();
      break;
    case "Add Employee":
      addEmployee();
      break;
    case "Delete Employee":
      deleteEmployee();
      break;
    default:
      start();
      break;
  }
}

function viewAllEmployees() {
  const query = `SELECT employees.first_name AS First_Name, employees.last_name AS Last_Name, roles.title AS Role, departments.name AS Department, roles.salary As Salary, CONCAT(managers.first_name, " ", managers.last_name) AS Manager FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id
  LEFT JOIN employees AS managers ON employees.manager_id = managers.id`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("Employees:");
    console.table(res);
    employeesMenu();
  })
}

async function rolesMenu() {
  const response = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: ["View All Roles",
      "Add Roles",
      "Delete Roles",
      "Return"
    ]
  })

  switch (response.action) {
    case "View All Roles":
      viewAllRoles();
      break;
    case "Add Roles":
      addRoles();
      break;
    case "Delete Roles":
      deleteRoles();
      break;
    default:
      start();
      break;
  }
}

function viewAllRoles() {
  const query = "SELECT * FROM roles";
  connection.query(query, function (err, results) {
    if (err) {
      throw err;
    }
    console.table(results);

    rolesMenu();
  })
}

function addRoles() {
  const departments = [];
  let departmentList = [];
  const query = "SELECT * FROM departments";
  connection.query(query, function (err, results) {
    if (err) {
      throw err;
    }
    departmentList = results;
    for (let i = 0; i < results.length; i++) {
      departments.push(results[i].name);
    }
  });
  let prompts = [
    {
      type: "input",
      message: "What Role do you want to add?",
      name: "role"
    },
    {
      type: "input",
      message: "What is the Salary for this Role?",
      name: "salary"
    },
    {
      type: "list",
      message: "Please select the department for this Role.",
      choices: departments,
      name: "department"
    }
  ];
  inquirer.prompt(prompts)
    .then(function (answer) {
      const departmentID = departmentList.filter(record => {
        return record.name == answer.department;
      })
      const query = `INSERT INTO roles (title, salary, department_id) VALUES ('${answer.role}', '${answer.salary}', '${departmentID[0].id}')`;
      connection.query(query, function (err, results) {
        if(err){
          throw err;
        }
        rolesMenu();
      })
    })
}

function deleteRoles() {
  const roles = [];
  let rolesList = [];
  const query = "SELECT * FROM roles";
  connection.query(query, function (err, results) {
    if (err) {
      throw err;
    }
    rolesList = results;
    for (let i = 0; i < results.length; i++) {
      roles.push(results[i].name);
    }
  });
  inquirer.prompt({
    type: "list",
    message: "What role would you like to delete?",
    choices: roles,
    name: "role"
  }).then(function (answer) {
    let query = `DELETE FROM roles WHERE name=('${answer.role}')`;
    connection.query(query, function (err, results) {
      if(err){
        throw err;
      }
      rolesMenu();
    })
  })
}

async function departmentsMenu() {
  const response = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: ["View All Departments",
      "Add Departments",
      "Delete Departments",
      "Return"
    ]
  })

  switch (response.action) {
    case "View All Departments":
      viewAllDepartments();
      break;
    case "Add Departments":
      addDepartment();
      break;
    case "Delete Departments":
      deleteDepartment();
      break;
    default:
      start();
      break;
  }
}

//selects everything in the departments table
function viewAllDepartments() {
  connection.query("SELECT * FROM departments", function (err, results) {
    console.table(results);

    departmentsMenu();
  })
}
// inserts into the departments table a name of your choice
function addDepartment() {
  inquirer.prompt({
    type: "input",
    message: "What Department would you like to add?",
    name: "department"
  }).then(function (answer) {
    let query = `INSERT INTO departments (name) VALUES ('${answer.department}')`;
    connection.query(query, function (err, results) {
      departmentsMenu();
    })
  })
}


function deleteDepartment() {
  connection.query("SELECT * FROM departments", function (err, results) {
    if(err){
      throw err;
    }
    console.table(results);
  })
  inquirer.prompt({
    type: "input",
    message: "What Department would you like to delete?",
    name: "department"
  }).then(function (answer) {
    let query = `DELETE FROM departments WHERE name=('${answer.department}')`;
    connection.query(query, function (err, results) {
      if(err){
        throw err;
      }
      departmentsMenu();
    })
  })
}