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
                choices: ['View all departments','View all roles','View all employees','Add a department','Add a role','Add an employee','Update employee role']
            }

        ])
        .then((response) => {
            // const manager = new Manager(response.name, response.id, response.email, response.number);
            // teamCards.push(manager);
            // console.log('manager: ',manager);
            // addEmployee();
            console.log(response);

        });

}
init();