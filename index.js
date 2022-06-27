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
    //Select questions, goto this function
    console.log(resp.task);
    switch (resp.task) {
      case "view all departments":
        viewAllDepartments();
        break;
      case "view all roles":
        viewAllRoles();
        break;
      case "view all employees":
        viewAllEmp();
        break;
      case "add a department":
        addADepartment();
        break;
      case "add a role":
        addARole();
        break;
      case "add an employee":
        addEmployee();
        break;
      case "update an employee role":
        updateEmployeeRole();
        break;
    }
  });
}
//Prints all departments
function viewAllDepartments() {
  const sql = "SELECT name FROM department";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
   // console.log(result);
    console.table(result);
    init();
  });
}
//view all roles
function viewAllRoles() {
  console.log("roles");
  const sql = `SELECT * FROM roles`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    init();
  });
}
//view all employees
function viewAllEmp() {
  db.query("SELECT * FROM employee", (err, res) => {
    console.table(res);
    init();
  });
}
//add a department
function addADepartment() {
  console.log("hey");
  prompt([
    {
      type: "text",
      name: "department",
      message: "What is the name of the department?",
    },
  ]).then((resp) => {
    console.log("Department added!");
    const sql = `INSERT INTO department (name) VALUES (\'${resp.department}\')`;
    db.query(sql, (err, result) => {
      if (err) throw err;
    });
    console.table(resp);
    init();
  });
}
//Add a role
function addARole() {
  console.log("roles");
  db.query("SELECT name FROM department", (err, result) => {
    let departments = [];
    for (let i = 0; i < result.length; i++) {
      departments.push({ name: result[i].name });
    }
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
        choices: departments,
      },
    ]).then (async (resp) => {
      console.table(resp);
      const sql = `INSERT INTO roles (title, salary, department_id) VALUES ("${resp.role}", "${resp.salary}", (SELECT id FROM department WHERE name = "${resp.department}"));`
      // //
      // getDepartmentId(resp.department).then((res) => {
      //   const params = [
      //     [resp.role, resp.salary, res],
      //   ];
      //   db.query(sql, params, (err, result) => {
      //     //console.log(params);
      //     //console.log(params[0]);
      //     if (err) {
      //       console.log(err);
      //     }
      //     console.log("Successfully added to roles!");
      //     init();
      //   });
      // })
      
      //
      const handleDepartment = async () => {
        return await getDepartmentId(resp.department)
        };
      
      const dID =await handleDepartment();
    //  console.log("this is dID = " + dID);

      const params = [
        [resp.role, resp.salary, getDepartmentId(resp.department)],
      ];
      db.query(sql, params, (err, result) => {
        //console.log(params);
        //console.log(params[0]);
        if (err) {
          console.log(err);
        }
        console.log("Successfully added to roles!");
        init();
      });
    });
  });
}

async function getDepartmentId(departmentName) {
 // console.log("Searching for " + departmentName);
  let departmentId;
  let query = `SELECT id FROM department WHERE name=\'${departmentName}\'`;
  let dbQuery = new Promise((resolve, reject) => {
    db.query(query, (err, res) => {
      if (err) throw reject(err);
      else {
    //    console.log(res[0].id);
        departmentId = res[0].id;
        resolve(departmentId);
      }
    });
  });
  departmentId = await dbQuery.then((res) => {
    console.log(res);
    return res;
  });
  console.log("departmentId = " + departmentId);
  return departmentId;
  // switch (departmentName) {
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
  //return departmentId;
}

function addEmployee() {
  //connection.query()
  //query database to get all employees
  db.query("SELECT id, title FROM roles;", (err, result) => {
    let roles = [];
    for (let i = 0; i < result.length; i++) {
      roles.push({ name: result[i].title, value: result[i].id });
    }
  db.query("SELECT id, title FROM roles", (err, result) => {
    let roles = [];
      for (let i = 0; i < result.length; i++) {
        roles.push({ name: result[i].title, value: result[i].id });
    }
  db.query(
      "SELECT id, first_name, last_name FROM employee;",
        (err, result) => {
          let employees = [];
          for (let i = 0; i < result.length; i++) {
              employees.push({
                name: `${result[i].first_name} ${result[i].last_name}`,
                value: result[i].id,
              });
            }
            prompt([
              {
                type: "text",
                name: "firstname",
                message: "What is the employees first name?",
              },
              {
                type: "text",
                name: "lastname",
                message: "What is the employees last name?",
        
                //in array instead of hardcoded.
              },
              {
                type: "list",
                name: "role",
                message: "What is employee's role?",
                choices: roles,
              },
              {
                type: "list",
                name: "supervisor",
                message: "Who is the employee's manager/supervisor?",
                choices: employees,
              },
            ]).then((newEmployee) => {
              const sql =
                "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ?";
              const params = [
                [
                  newEmployee.firstname,
                  newEmployee.lastname,
                  1,
                  1
                  //getRoleId(newEmployee.role),
                 // getManagerId(newEmployee.supervisor),
                ],
              ];
              db.query(sql, [params], (err, result) => {
                if (err) throw err;
                viewAllEmp();
              });
            });
          }
        );
      });
    });
  };



  // prompt([
  //   {
  //     type: "text",
  //     name: "first_name",
  //     message: "What is the employees first name?"
  //   },
  //   {
  //     type: "text",
  //     name: "last_name",
  //     message: "What is the employees last name?"
  //   },
  //   {
  //     type: "list",
  //     name: "role_id",
  //     message: "What is the employee's role?",
  //     choices: ["Engineer", "Sales Manager", "Human Resources", "Marketing Manager"]
  //   }
  // ])

function updateEmployeeRole() {
  //query database to get all employees
  db.query("SELECT id, first_name, last_name FROM employee;", (err, result) => {
    let employees = [];
    for (let i = 0; i < result.length; i++) {
      employees.push({
        name: `${result[i].first_name} ${result[i].last_name}`,
        value: result[i].id,
      });
    }
    prompt([
      {
        type: "list",
        name: "updateEmp",
        message: "Which employee would you like to update?",
        choices: employees,
        //in array instead of hardcoded.
      },
    ]).then(({ updateEmp }) => {
      db.query("SELECT id, title FROM roles", (err, result) => {
        let roles = [];
        for (let i = 0; i < result.length; i++) {
          roles.push({ name: result[i].title, value: result[i].id });
        }

        prompt([
          {
            type: "list",
            name: "updateRole",
            message: "What is employee's new role?",
            choices: roles,
          },
        ]).then(({ updateRole }) => {
          db.query(
            "UPDATE employee SET role_id=? WHERE id=?",
            [updateRole, updateEmp],
            (err, res) => {
              if (err) throw err;
              viewAllEmp();
              init();
            }
          );
        });
      });
    });
  });
  //   }//.then... //send thru prompt
  //   //.then? //pick name //update by id
  //   //update this with this
  // ])
}

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
