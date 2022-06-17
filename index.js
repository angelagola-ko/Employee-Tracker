const db = require('./config/connection');
const { prompt } = require('inquirer');

init();

function init() {
    prompt([
        {
            type: 'list',
            name: 'task',
            message: 'What would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees','add a department',' add a role', 'add an employee', 'update an employee role']
        }
    ]).then(console.log)
}