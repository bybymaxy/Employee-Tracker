const inquirer = require("inquirer");
const mysql = require("mysql2");

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Halloween1!",
  database: "employee_tracker_db",
});

// Function to prompt the user for the main menu options
function promptMainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "mainMenuOption",
        message: "Select an option:",
        choices: [
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      const mainMenuOption = answers.mainMenuOption;

      switch (mainMenuOption) {
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateEmployeeRole();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter the name of the department:",
      },
    ])
    .then((answers) => {
      const departmentName = answers.departmentName;

      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        [departmentName],
        (err, res) => {
          if (err) throw err;
          console.log("Department added successfully!");
          promptMainMenu();
        }
      );
    });
}

// Function to add a role
// Function to add a role
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "Enter the title of the role:",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "Enter the salary for the role:",
      },
      {
        type: "input",
        name: "departmentId",
        message: "Enter the department ID for the role:",
      },
    ])
    .then((answers) => {
      const roleTitle = answers.roleTitle;
      const roleSalary = answers.roleSalary;
      const departmentId = answers.departmentId;

      connection.query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [roleTitle, parseFloat(roleSalary), departmentId],
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} role inserted!\n`);
          // Call the main menu function to display the menu again
          promptMainMenu();
        }
      );
    });
}

// Function to add an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the first name of the employee:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the last name of the employee:",
      },
      {
        type: "input",
        name: "roleId",
        message: "Enter the role ID for the employee:",
      },
      {
        type: "input",
        name: "managerId",
        message: "Enter the manager ID for the employee (leave blank if none):",
      },
    ])
    .then((answers) => {
      const firstName = answers.firstName;
      const lastName = answers.lastName;
      const roleId = answers.roleId;
      const managerId = answers.managerId || null;

      connection.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [firstName, lastName, roleId, managerId],
        (err, res) => {
          if (err) throw err;
          console.log("Employee added successfully!");
          promptMainMenu();
        }
      );
    });
}

// Function to update an employee role
function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employeeId",
        message: "Enter the ID of the employee to update:",
      },
      {
        type: "input",
        name: "newRoleId",
        message: "Enter the new role ID for the employee:",
      },
    ])
    .then((answers) => {
      const employeeId = answers.employeeId;
      const newRoleId = answers.newRoleId;

      connection.query(
        "UPDATE employee SET role_id = ? WHERE id = ?",
        [newRoleId, employeeId],
        (err, res) => {
          if (err) throw err;
          console.log("Employee role updated successfully!");
          promptMainMenu();
        }
      );
    });
}

// Connect to the database and start the application
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");

  // Prompt the user for the main menu options
  promptMainMenu();
});
