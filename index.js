const fs = require('fs');
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_db'
});

function init() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: "Select an option below: ",
                name: 'choice',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Exit']
            }

        ])
        .then((response) => {
            console.log(response.choice);
            if (response.choice == 'View all departments') {
                db.query(`SELECT * FROM departments`, function (err, results) {
                    console.log('\n', '\n', cTable.getTable(results), '\n');
                });
                init();
            } else if (response.choice == 'View all roles') {
                db.query(`SELECT * FROM roles`, function (err, results) {
                    console.log('\n', '\n', cTable.getTable(results), '\n');
                });
                init();
            } else if (response.choice == 'View all employees') {
                db.query(`SELECT * FROM employees`, function (err, results) {
                    console.log('\n', '\n', cTable.getTable(results), '\n');
                });
                init();
            } else if (response.choice == 'Add a department') {
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'Enter new department name',
                        name: 'department',
                    }
                ])
                    .then((response) => {
                        db.query(`INSERT INTO departments (department) VALUES ("${response.department}")`, function (err, results) {
                        });
                        init();
                    });
            } else if (response.choice == 'Add a role') {
                db.query(`SELECT * from departments;`, function (err, results) {
                    const departmentsArray = [];
                    for (let i = 0; i < results.length; i++) {
                        departmentsArray.push(`${results[i].id} ${results[i].department}`);
                    }
                    // console.log(departmentsArray)
                    inquirer.prompt([
                        {
                            type: 'input',
                            message: 'Enter new role',
                            name: 'title',
                        },
                        {
                            type: 'input',
                            message: 'Enter salary',
                            name: 'salary',
                        },
                        {
                            //CHANGE TO LIST
                            type: 'list',
                            message: 'Enter department id',
                            name: 'department_id',
                            choices: departmentsArray,
                        }
                    ])
                        .then((response) => {
                            // console.log(response);
                            var dept = response.department_id.split(" ");
                            const { title, salary, id } = response;
                            db.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${title}","${salary}","${dept[0]}")`, function (err, results) {
                            });
                            init();
                        });
                })

            } else if (response.choice == 'Add an employee') {
                db.query(`SELECT * from roles;`, function (err, results) {
                    // console.log(results);
                    const rolesArray = [];
                    for (let i = 0; i < results.length; i++) {
                        rolesArray.push(`${results[i].id} ${results[i].title}`);
                    }

                    db.query(`SELECT * from employees`, function (err, results) {
                        const employeeArray = [];
                        for (let i = 0; i < results.length; i++) {
                            employeeArray.push(`${results[i].id} ${results[i].first_name} ${results[i].last_name}`);
                        }
                        employeeArray.push("None");
                        inquirer.prompt([
                            {
                                type: 'input',
                                message: 'Enter in first name',
                                name: 'first_name',
                            },
                            {
                                type: 'input',
                                message: 'Enter in last name',
                                name: 'last_name',
                            },
                            {
                                //CHANGE TO LIST
                                type: 'list',
                                message: 'Select your role',
                                name: 'role_id',
                                choices: rolesArray
                            },
                            {
                                //CHANGE TO LiST
                                type: 'list',
                                message: 'Enter in manager_id',
                                name: 'manager_id',
                                choices: employeeArray
                            }
                        ])
                            .then((response) => {

                                const { first_name: first, last_name: last, role_id: role, manager_id: id } = response;
                                const roleID = role.split(" ")[0];
     
                                if (id == "None"){
                                    const managerID = null;
                                    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${first}","${last}","${roleID}",${managerID})`, function (err, results) {
                                    });
                                }else{
                                    const managerID = id.split(" ")[0];
                                    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${first}","${last}","${roleID}","${managerID}")`, function (err, results) {
                                    });
                                }
                                
                                
                                init();
                            });

                    })

                })



            } else if (response.choice == 'Update employee role') {
                db.query('SELECT * from employees', function (err, results) {
                    // console.log(results);
                    const employeeArray = [];
                    const roleArray = [];
                    for (let i = 0; i < results.length; i++) {
                        employeeArray.push(`${results[i].first_name} ${results[i].last_name}`);
                    }
                    console.log(employeeArray);
                    db.query(`SELECT * from roles;`, function (err, results) {
                        for (let i = 0; i < results.length; i++) {
                            roleArray.push(`${results[i].id} ${results[i].title}`);
                        }
                        // console.log("role array: ", roleArray);

                        inquirer.prompt([
                            {
                                type: "list",
                                message: "Select an employee to update role",
                                name: "employee",
                                choices: employeeArray
                            },
                            {
                                type: 'list',
                                message: 'Select new employee role',
                                name: 'role_id',
                                choices: roleArray
                            }
                        ])
                            .then((response) => {
                                var name = response.employee.split(" ");
                                var roleid = response.role_id.split(" ");
                                console.log(roleid);
                                db.query(`UPDATE employees SET role_id = ? WHERE first_name = ? AND last_name = ?`, [roleid[0], name[0], name[1]])
                                init();
                            })


                    })

                });
            } else if (response.choice == 'Exit') {
                process.kill(process.pid, 'SIGTERM')
            }
        });

}
init();