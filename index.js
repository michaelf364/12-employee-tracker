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
  const prompts = [
    {
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Employees Menu",
        "View Roles Menu",
        "View Departments Menu",
        "Exit"
      ]
    }
  ]
  inquirer.prompt(prompts)
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
  const prompts = [
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["View All Employees",
        "Add Employee",
        "Delete Employee",
        "Return"
      ]
    }
  ]
  const response = await inquirer.prompt(prompts);

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
  const query = `SELECT * FROM employees`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("Employees:");
    console.table(res);
    employeesMenu();
  })
}

function addEmployee() {
  const query = `SELECT * FROM roles`;//queries the role db for all the roles
  connection.query(query, async function (err2, roleResult) {
      if (err2) {
        throw err2;
      }
      const roles = roleResult.map(a => a.title);
      console.log(roles);
      const prompts = [
        {
          type: "input",
          name: "first_name",
          message: "Enter the employees first name"
        },
        {
          type: "input",
          name: "last_name",
          message: "Enter the employees last name"
        },
        {
          type: "list",
          name: "role",
          message: "Select employee's role",
          choices: roles
        }
      ]
      const response = await inquirer.prompt(prompts);//inquirers user which role they want
      const roleIndex = roles.indexOf(response.role);
      console.log(roleResult[roleIndex])
      console.log(roleIndex)
      connection.query(
        `INSERT INTO employees (first_name, last_name, role_id) VALUES ('${response.first_name}', '${response.last_name}', '${roleResult[roleIndex].id}')`,
        function (err4, res) {
          if (err4) {
            throw err4;
          }
          console.log(`${response.first_name} ${response.last_name} successfully added as an employee.`);
          employeesMenu();
        }
      )

    })
}

async function deleteEmployee() {
  const query = `SELECT CONCAT(first_name, " ", last_name) as name, id FROM employees ORDER BY id`;
  connection.query(query, async function (err, res) {
      if (err) {
        throw err;
      }
      const employees = res.map(a => a.name);
      const prompts = [
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to delete?",
          choices: employees
        }
      ]
      const response = await inquirer.prompt(prompts);

      const index = employees.indexOf(response.employee);
const delQuery = `DELETE FROM employees WHERE id = '${res[index].id}'`;
      connection.query(delQuery, function (err2, res2) {
        if (err2) {
          throw err2;
        }
        console.log(`${response.employee} was successfully deleted.`);
        employeesMenu();
      });
    })
}

async function rolesMenu() {
  const prompts = [
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["View All Roles",
        "Add Roles",
        "Delete Roles",
        "Return"
      ]
    }
  ];
  const response = await inquirer.prompt(prompts);
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

//select all roles
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

function addRoles() {//asks what department you want the role in and then adds it
  const query = "SELECT * FROM departments";
  connection.query(query, async function (err, results) {
    if (err) {
      throw err;
    }
    const departments = results.map(a => a.name);
    const prompts = [
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
    const response = await inquirer.prompt(prompts);
    const index = departments.indexOf(response.department);
    const query1 = `INSERT INTO roles (title, salary, department_id) VALUES ('${response.role}', '${response.salary}', '${results[index].id}')`;
    connection.query(query1, function (err1, results1) {
      if (err1) {
        throw err1;
      }
      rolesMenu();
    })
  })
}


//deletes role based on user input
function deleteRoles() {
  connection.query("SELECT * FROM roles", async function (err, res) {
    if (err) throw err;
    const roles = res.map(a => a.title);
    const prompts = [
      {
        type: "list",
        name: "role",
        message: "Which role would you like to delete?",
        choices: roles
      }
    ]
    const response = await inquirer.prompt(prompts)

    const index = roles.indexOf(response.role);

    connection.query(`DELETE FROM roles WHERE id = '${res[index].id}'`, function (err2, res2) {
      if (err2) throw err2;
      console.log(`${response.role} role was successfully deleted.`);
      rolesMenu();
    });
  })
}

async function departmentsMenu() {
  const prompts = [
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["View All Departments",
        "Add Departments",
        "Delete Departments",
        "Return"
      ]
    }
  ]
  const response = await inquirer.prompt(prompts)

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
      if (err) {
        throw err;
      }
      departmentsMenu();
    })
  })
}


function deleteDepartment() {
  connection.query("SELECT name FROM departments;", async function (err, res) {
    if (err) {
      throw err;
    }
    const departments = res.map(a => a.name);
    const prompts = [
      {
        type: "list",
        name: "department",
        message: "Which department would you like to delete?",
        choices: departments
      }
    ]
    const response = await inquirer.prompt(prompts)
    connection.query(`DELETE FROM departments WHERE name = '${response.department}';`, function (err2, res2) {
      if (err2) {
        throw err2;
      }
      console.log(`'${response.department}' successfully deleted.`);
      departmentsMenu();
    })
  })
}