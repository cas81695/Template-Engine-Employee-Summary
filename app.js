// Node packages

const inquirer = require("inquirer");
const fs = require("fs");

// The Lib javascript 

const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");

var bunchList = [];
const managerQuestions = [
    {
        type: "input",
        name: "name",
        message: "Enter manager name:",
        validate: async (input) => {
            if (input == "" || /\s/.test(input)) {
                return "Please enter first or last name.";
            }
            return true;
        }
    },
    {
        type: "input",
        name: "email",
        message: "Enter manager's email:",
        validate: async (input) => {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
                return true;
            }
            return "Please enter a valid email address.";
        }
    },
    {
        type: "input",
        name: "officeNum",
        message: "Enter office number:",
        validate: async (input) => {
            if (isNaN(input)) {
                return "Please enter a number";
            }
            return true;
        }
    },
    {
        type: "list",
        name: "hasBunch",
        message: "Do you have any group members?",
        choices: ["Yes", "No"]
    }
]

const employeeQuestions = [
    {
        type: "input",
        name: "name",
        message: "Enter employee name:",
        validate: async (input) => {
            if (input == "") {
                return "Please enter a name.";
            }
            return true;
        }
    },
    {
        type: "input",
        name: "email",
        message: "Enter the email:",
        validate: async (input) => {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
                return true;
            }
            return "Please enter a valid email address.";
        }
    },
    {
        type: "list",
        name: "role",
        message: "What is their role?",
        choices: ["engineer", "intern"]
    },
    {
        when: input => {
            return input.role == "engineer"
        },
        type: "input",
        name: "github",
        message: "Enter the github username:",
        validate: async (input) => {
            if (input == "" || /\s/.test(input)) {
                return "Please, enter the GitHub username";
            }
            return true;
        }
    },
    {
        when: input => {
            return input.role == "intern"
        },
        type: "input",
        name: "school",
        message: "Intern, enter your school name:",
        validate: async (input) => {
            if (input == "") {
                return "Please, enter a name.";
            }
            return true;
        }
    },
    {
        type: "list",
        name: "addAnother",
        message: "Add another group member?",
        choices: ["Yes", "No"]
    }
]

function buildBunchList() {
    inquirer.prompt(employeeQuestions).then(employeeInfo => {
        if (employeeInfo.role == "engineer") {
            var newMember = new Engineer(employeeInfo.name, bunchList.length + 1, employeeInfo.email, employeeInfo.github);
        } else {
            var newMember = new Intern(employeeInfo.name, bunchList.length + 1, employeeInfo.email, employeeInfo.school);
        }
        bunchList.push(newMember);
        if (employeeInfo.addAnother === "Yes") {
            console.log(" ");
            buildBunchList();
        } else {
            buildHtmlPage();
        }
    })
}

function buildHtmlPage() {
    let newFile = fs.readFileSync("./templates/main.html")
    fs.writeFileSync("./output/bunch.html", newFile, function (err) {
        if (err) throw err;
    })

    console.log("Base page generated!");

    for (member of bunchList) {
        if (member.getRole() == "Manager") {
            buildHtmlCard("manager", member.getName(), member.getId(), member.getEmail(), "Office: " + member.getOfficeNumber());
        } else if (member.getRole() == "Engineer") {
            buildHtmlCard("engineer", member.getName(), member.getId(), member.getEmail(), "Github: " + member.getGithub());
        } else if (member.getRole() == "Intern") {
            buildHtmlCard("intern", member.getName(), member.getId(), member.getEmail(), "School: " + member.getSchool());
        }
    }
    fs.appendFileSync("./output/bunch.html", "</div></main></body></html>", function (err) {
        if (err) throw err;
    });
    console.log("Completed.")

}

function buildHtmlCard(memberType, name, id, email, propertyValue) {
    let data = fs.readFileSync(`./templates/${memberType}.html`, 'utf8')
    data = data.replace("nameHere", name);
    data = data.replace("idHere", `ID: ${id}`);
    data = data.replace("emailHere", `Email: <a href="mailto:${email}">${email}</a>`);
    data = data.replace("propertyHere", propertyValue);
    fs.appendFileSync("./output/bunch.html", data, err => { if (err) throw err; })
    console.log("Card appended");
}

function start() {
    inquirer.prompt(managerQuestions).then(managerInfo => {
        let bunchManager = new Manager(managerInfo.name, 1, managerInfo.email, managerInfo.officeNum);
        bunchList.push(bunchManager);
        console.log(" ");
        if (managerInfo.hasBunch === "Yes") {
            buildBunchList();    
        } else {
            buildHtmlPage();
        }
    })
}

start();