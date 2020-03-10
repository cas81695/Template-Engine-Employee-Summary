const inquirer = require("inquirer");
const jest = require("jest");

const Employee = require("./lib/main");
const Engineer = require("./lib/engineer");
const Intern = require("./lib/intern");
const Manager = require("./lib/manager");




function promptUser() {
    return inquirer.prompt([
        {
            type: "input",
            message: "Enter your first name:",
            name: "name"
        }, 
        {
            type: "input",
            message: "Enter your email address:",
            name: "email"
        }, 
        {
            type: "input",
            message: "What's your role within the company?",
            name: "role",
            choices: ['engineer', 'intern', 'manager']
        },
        {
            type: "input",
            message: "Enter your github username:",
            name: "username"
        }, 
    ]);
}