const db = require("./config/connection");
const { prompt } = require("inquirer");

init();

function init() {
  let addEmp = true;
  prompt([
    {
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
      ],
    },
  ]).then((resp) => {
    console.log(resp.task);
    switch (resp.task) {
      case "view all departments":
        viewAllDepartments();
        break;
      case "view all roles":
        viewAllRoles();
        break;
      case "add a role":
        addARole();
        break;
    }
  });
}

function viewAllDepartments() {
  console.log("yep");
}

function viewAllRoles() {
  console.log("roles");
}

function addARole() {
  console.log("roles");
  prompt([
    {
      type: "text",
      name: "role",
      message: "What is the name of the role?",
    },
    {
      type: "text",
      name: "salary",
      message: "What is the salary?",
    },
    {
      type: "list",
      name: "department",
      message: "What department does the role belong to?",
      choices: ["Engineering", "Sales", "Human Resources", "Marketing"],
    },
  ]).then((resp) => {
    console.log(resp);
    // let departmentId;
    // switch (resp.addDepartment) {
    //   case "Engineering":
    //     departmentId = 1;
    //     break;
    //   case "Sales":
    //     departmentId = 2;
    //     break;
    //   case "Human Resources":
    //     departmentId = 3;
    //     break;
    //   case "Marketing":
    //     departmentId = 4;
    //     break;
    // }
    const sql = "INSERT INTO roles (title, salary, department_id) VALUES ?";
    const params = [[resp.role, resp.salary, getDepartmentId(resp.department)]];
    db.query(sql, [params], (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
    });
  });
}

function getDepartmentId(departmentName){
    let departmentId;
    switch (departmentName) {
      case "Engineering":
        departmentId = 1;
        break;
      case "Sales":
        departmentId = 2;
        break;
      case "Human Resources":
        departmentId = 3;
        break;
      case "Marketing":
        departmentId = 4;
        break;
    }
    return departmentId;
};

//What is the name of the department
//'Added service to the database'
//What would you like to do? Add Role
//What is the name of the role?
//What is the salary of the role?
//Which department does the role belong to?
//'Added customer service to the database'
//What woulf you like to do?
//What is the employee's first name?
//What is the employee's last nae?
//What is the employee's role?
//Who is the employee's mgr?
//'Added sam kash to the database'
//What would you ike t do?
//which employee's role do you want to update?
//maria/
//ffsfsd/sdf
//fdsfsdfsdf
