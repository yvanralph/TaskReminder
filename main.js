const prompt = require('prompt-sync')();

// function for main menu
function getMenu(){
    console.log("*** Welcome To TaskReminder ***");
    console.log("");
    console.log("1. Today Tasks");
    console.log("2. Schedule Task");
    console.log("3. View Tasks");
    console.log("4. Exit");
    console.log("");
}

// function main(){
//     getMenu();
//     let choice;
//     while (true){
//         choice = prompt("Enter your choice [1-4]: ");
//         if (choice === "1"){
//             console.log("Today's Section+++++++");
//         }
//         else if(choice === "2"){
//             console.log("Schedule section ++++++++++++++");
//         }
//         else if(choice === "3"){
//             console.log("view Section+++++++++++++++++++");
//         }
//         else if(choice === "4"){
//             return;
//         }
//         else{
//             console.log("Invalid Input!!  Please Try Again");
//         }
//     }
// }
// main();
