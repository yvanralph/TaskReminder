const prompt = require('prompt-sync')();

// ******JSON files**********
function loadData() {
  if (!fs.existsSync(file)) {
    return { idCounter: 0, tasks: [] };
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveData(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Global Variable for IDcounter
let data = loadData();
let idcounter = data.idCounter;






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


//function to get validated taskname
function getName(){
    let name;
    while (true){
        name = prompt("Enter Taskname: ");
        if (name.trim() !== ""){
            return name;
        }
        console.log("Input can't be Empty, Enter Valid Taskname")
    }
}

// function to get validated TaskDate
function getuserDate(){
    let regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    let date;
    
    while (true){
        date = prompt("Enter Date for task [YYYY-MM-DD]: ");
        if (regex.test(date)){
            return date;
        }

        console.log("Invalid input: [Valid Input YYYY-MM-DD]")
    }
}

// function to get currentdate
function getcurrentdate(){
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    let currentdate = `${year}-${month}-${day}`;
    return currentdate; 
}


//function to get validated time which must be for that day
function getvalidatedTime(){
    let regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    let time;
    while(true){
        time = prompt("Enter Time for task [HH:MM]: ");
        if(!regex.test(time)){
            console.log("Invalid Input, Please Enter Time in 24hrs Format");
            continue;
        }

        const[hours, minutes] = time.split(":").map(Number);
        const inputMinutes = hours*60 + minutes;

        const now = new Date();
        const currentminutes = now.getHours() * 60 + now.getMinutes();

        if(inputMinutes > currentminutes){
            return time;
        }
        else{
            console.log("Time has already passed, Please select Future Time");
        }

    }
}





// function to validate time in 24hours input
function getTime(){
    let regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    let time;
    while(true){
        time = prompt("Enter Time for task [HH:MM]: ");
        if(regex.test(time)){
            return time;
        }
        console.log("Invalid Input, Please Enter Time in 24hrs Format")
    }
}




// function to add task in Today's section
function addTodaytask(){
    console.log("Existing tasks are listed HERE !!!!!")
    let addchoice;
    while (true){
        addchoice = prompt("Would you like to add new Task [y/n]: ");
        if (addchoice === "y" || addchoice === "yes"){
            let taskid = idcounter++
            let name = getName();
            let usertime = getvalidatedTime();
            let currentdate = getcurrentdate();
            let section = "Today";
            let status = "Upcoming";

            let task ={
                taskId : taskid,
                taskName : name,
                taskTime : usertime,
                taskDate : currentdate,
                taskSection : section,
                taskStatus: status,                
            }
            return task;

        }
        else if(addchoice === "n" || addchoice === "no"){
            return;
        }
        else{
            console.log("Invalid Input!! Please Enter y or n | Yes or No");
        }


    }
}






// Main function
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
