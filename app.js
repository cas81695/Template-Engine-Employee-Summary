// Node packages

const inquirer = require("inquirer");

const fs = require("fs");


// The Lib javascript 

const Manager = require("./lib/Manager");

const Intern = require("./lib/Intern");

const Engineer = require("./lib/Engineer");

// The start of the function

async function start(){

    console.log("Shall we create the fun bunch!");

    // Set variable to hold HTML
    let bunchHTML = "";

    // Variable to hold number of group members
    let bunchSize;

    // First Question to ask to set up loop
    await inquirer.prompt(
        {
            type: "number",
            message: "How many people are in the bunch?",
            name: "noOfBunchMem"
        }
    )
    .then((data) => {

        // Number of group members placed in bunchSize.

        // 1 is added start from 1 rather than 0 for user understanding.

        bunchSize = data.noOfBunchMem + 1;
    });
    
    // If Team Size is 0, will end program

    if (bunchSize === 0){
        console.log("I guess there is no one in your bunch...");
        return;
    }
    
    // Loop begins to ask questions depending on the size of the team

    for(i = 1; i < bunchSize; i++){

        let name;
        let id;
        let title;
        let email;

        // Prompts user to answer the basic questions of the employee

        await inquirer.prompt([ 
            {
                type: "input",
                message: `What is employee (${i})'s name?`,
                name: "name"
            },
            {
                type: "input",
                message: `What is the employee (${i})'s id?`,
                name: "id"
            },
            {
                type: "input",
                message: `What is the employee (${i})'s Email?`,
                name: "email"
            },
            {
                type: "list",
                message: `what the employee (${i})'s title?`,
                name: "title",
                choices: ["Engineer", "Intern", "Manager"]
            }
        ])
        .then((data) => {

            // Takes data from user and places value in let variables

            name = data.name;
            id = data.id;
            title = data.title;
            email = data.email;

        });

        // Switch Case depending on the title of the employee
        switch (title){
            case "Manager":

                // ask user of Manager's Office Number
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What is your Manager's Office Number?",
                        name: "officeNo"
                    }
                ])
                .then((data) => {

                    // Create a new object with all avaiable user input data

                    const manager = new Manager(name, id, email, data.officeNo);

                    // Reads and places HTML from manager.html in the bunchMember variable

                    bunchMember = fs.readFileSync("templates/Manager.html");

                    // Uses eval() to pass template literals from html files.
                    // Adds the string to the team HTML.
                    bunchHTML = bunchHTML + "\n" + eval('`'+ bunchMember +'`');
                });
                break;

            // Similar to Manager function but instead for an Intern

            case "Intern":
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What school is your Intern attending?",
                        name: "school"
                    }
                ])
                .then((data) => {
                    const intern = new Intern(name, id, email, data.school);

                    bunchMember = fs.readFileSync("templates/Intern.html");

                    bunchHTML = bunchHTML + "\n" + eval('`'+ bunchMember +'`');
                });
                break;

            // Similar to Manager function but instead for an Engineer

            case "Engineer":
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What is your Engineer's GitHub?",
                        name: "github"
                    }
                ])
                .then((data) => {
                    const engineer = new Engineer(name, id, email, data.github);

                    bunchMember = fs.readFileSync("templates/engineer.html");

                    bunchHTML = bunchHTML + "\n" + eval('`'+ bunchMember +'`');
                });

                break;

        } 

    } 

    // Reads the Employee.html and places the html in a variable

    const employeeHTML = fs.readFileSync("templates/Employee.html");
    

    bunchHTML = eval('`'+ employeeHTML +'`');

    // write file to new Bunch.html file

    fs.writeFile("output/Bunch.html", bunchHTML, function(err) {

        if (err) {
          return console.log(err);
        }
      
        console.log("Success!");
      
      });

}


start();