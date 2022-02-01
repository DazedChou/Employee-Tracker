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
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role']
            }

        ])
        .then((response) => {
            // const manager = new Manager(response.name, response.id, response.email, response.number);
            // teamCards.push(manager);
            // console.log('manager: ',manager);s
            // addEmployee();
            console.log(response.choice);
            if (response.choice == 'View all departments'){
                db.query(`SELECT * FROM departments`, function (err, results) {
                    console.log('\n','\n',cTable.getTable(results),'\n');
                });
                init();
            } else if (response.choice == 'View all roles'){
                db.query(`SELECT * FROM roles`, function (err, results) {
                    console.log('\n','\n',cTable.getTable(results),'\n');
                });
                init();
            }else if (response.choice == 'View all employees'){
                db.query(`SELECT * FROM employees`, function (err, results) {
                    console.log('\n','\n',cTable.getTable(results),'\n');
                });
                init();
            }else if (response.choice == 'Add a department'){
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
                    db.query(`SELECT * FROM departments`, function (err, results) {
                        console.log('\n','\n',cTable.getTable(results),'\n');
                    });
                });
            }

        });

}
init();