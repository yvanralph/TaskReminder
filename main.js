const prompt = require('prompt-sync')();

// ******JSON files**********

const fs = require("fs");
const file = "tasks.json";

function loadData() {
  if (!fs.existsSync(file)) {
    return { idCounter: 1, tasks: [] };
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveData(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Global Variable for IDcounter
let data = loadData();
let idcounter = data.idcounter;



// function for main menu
function getMenu(){
    console.log("*** Welcome To TaskReminder ***");
    console.log("");
    console.log("1. Today Tasks");
    console.log("2. Schedule Task");
    console.log("3. View Tasks");
    console.log("4. Delete Tasks");
    console.log("5. Exit");
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


// function to validate time in 24hours input
function getuserTime(){
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



// function to get currentdate
function getcurrentdate(){
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    let currentdate = `${year}-${month}-${day}`;
    return currentdate; 
}

// function to get current time
function getcurrenttime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    let currenttime = `${hours}:${minutes}`;
    return currenttime;
}

// ************************************* Today's Section ************************************



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



// function to display overdue and upcoming tasks
function displaytasks(upcoming,overdue){
    if (upcoming.length === 0){
        console.log("No Upcoming tasks at the moment");
    }
    else{
        console.log("");
        console.log(`______Upcoming Tasks_________`)
        console.log("|")
        upcoming.forEach(task => {
            console.log(`| Task: ${task.taskName} - Time: ${task.taskTime} `);
    });
        console.log("");
    }
    if (overdue.length === 0){
        console.log("No Overdue tasks at the moment");
    }
    else{
        console.log(`______Overdue Tasks_________`)
        console.log("|")
        overdue.forEach(task => {
            console.log(`| Task: ${task.taskName} - Time: ${task.taskTime} `);
    });
        console.log("");
    }
}

// function to group tasks of the current date
function grouptasks(){
    let data = loadData();
    let group = [];
    let currentdate = getcurrentdate();
    for (const task of data.tasks){
        if (task.taskDate === currentdate){
            group.push(task);
        }
    }
    return group;

}



// Display Today's tasks Only update overdue by comparing tasktime with current
function Todaystasks() {
  let data = loadData(); 
  let upcoming = [];
  let overdue = [];

  let group = grouptasks();

  for (const time of group){
    let tasktime = time.taskTime;

    const[hours, minutes] = tasktime.split(":").map(Number);
    const inputMinutes = hours*60 + minutes;

    const now = new Date();
    const currentminutes = now.getHours() * 60 + now.getMinutes();
    
    if (inputMinutes > currentminutes){
        upcoming.push(time);
    }
    else{   
        for (const task of data.tasks){
            if (task.taskId === time.taskId){
                task.taskStatus = "Overdue";
            }
        }
        saveData(data);
        time.taskStatus = "Overdue";
        overdue.push(time);
    }
  }
  displaytasks(upcoming,overdue);

  
}

//function to add task for todaysection
function addTodaytask(){
    let data = loadData();
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

        data.tasks.push(task);
        data.idcounter = idcounter;
        saveData(data);
        
        return;

}


// function to add task in Today's section
function todaySection(){
    let addchoice;
    while (true){
        Todaystasks();
        addchoice = prompt("Would you like to add new Task [yes or y]: ").toLowerCase();
        if (addchoice === "y" || addchoice === "yes" || addchoice === "yep" || addchoice === "yeah"){
            addTodaytask();
        }
        else{
            break;
        }


    }
}


// **********************Schedule Section *****************************

function scheduleStatuscheck(userdate,usertime){
    let currentdate = getcurrentdate();
    let currenttime = getcurrenttime();
    let enteredtime = `${userdate}T${usertime}`;
    let timenow = `${currentdate}T${currenttime}`;

    if(enteredtime > timenow){
        return "Upcoming";
    }
    else if(enteredtime < timenow){
        return "Overdue";
    }
    else{
        return "Now";
    }
}



function scheduleSection(){
    let data = loadData();
    let taskid = idcounter++
    let name = getName();
    let userdate = getuserDate();
    let usertime = getuserTime();
    let section = "Schedule";
    let status = "";

    status = scheduleStatuscheck(userdate,usertime);

    let task ={
        taskId : taskid,
        taskName : name,
        taskTime : usertime,
        taskDate : userdate,
        taskSection : section,
        taskStatus: status,                
    }

    data.tasks.push(task);
    data.idcounter = idcounter;
    saveData(data);
        
    return;
}



// *********************************View Tasks Section************************************

//function to update status for Viewtask section
function updatetask(){
    let data = loadData();
    let currentdate = getcurrentdate();
    let currenttime = getcurrenttime();
    let timenow = `${currentdate}T${currenttime}`;

    for (const task of data.tasks){
        let timefortask = `${task.taskDate}T${task.taskTime}`;
        if(timefortask < timenow){
            task.taskStatus = "Overdue";
        }
    }
    saveData(data);
    return;
}

// function to display all tasks
function showAlltasks(){
    updatetask();
    let data = loadData();
    console.log(`_____________All Tasks____________`)
    console.log("|")
    data.tasks.forEach(task => {
        console.log(`|  -Task Name: ${task.taskName} \n|   Time: ${task.taskTime} - Status: ${task.taskStatus} - Date: ${task.taskDate} \n|`) });
    
}

//view section main function
function viewSection(){
    showAlltasks();
    let backchoice;
    while(true){
        backchoice = prompt("\n\n ***To Return Main Menu Enter just press [Enter]***");
        return;
    }
}

// *****************************************Delete Task section*************************************************



function deleteMenu(){
    console.log("");
    console.log("1. Delete One Task");
    console.log("2. Delete All Tasks");
    console.log("3. Return Home")
    console.log("");
}

// function to display all tasks for delete section
function deleteshowtasks(){
    updatetask();
    let data = loadData();
    console.log(`_____________All Tasks____________`)
    console.log("|")
    data.tasks.forEach(task => {
        console.log(`|  - Task Id: ${task.taskId} Task Name: ${task.taskName} \n|`) });
    
}

// function to delete one task
function deleteOnetask() {
    deleteshowtasks();
    let data = loadData();
    let userid;

    try {
        userid = parseInt(prompt("Please Enter Task-Id: "), 10); 

        function deleteTaskById(tasks, userid) {
            return tasks.filter(task => task.taskId !== userid);
        }

        let beforeLength = data.tasks.length;
        data.tasks = deleteTaskById(data.tasks, userid);

        if (data.tasks.length < beforeLength) {
            console.log("Task Deleted");
            deleteMenu();
        } else {
            console.log("No task found with that ID, Try again Later");
            deleteMenu();
            return;
        }

        saveData(data);
    } catch (err) {
        console.log("An error occurred:", err.message);
        deleteMenu();
        return;
    }
}

//function to delete all tasks
function deleteall(){
    let data = loadData();
    let confirmation = prompt("Do you want to DELETE all Tasks? [yes/no]: ").toLowerCase();
    if (confirmation === "yes" || confirmation === "y" || confirmation === "yeah" || confirmation === "yep"){
        data.idcounter = 1;
        data.tasks = [];
        saveData(data);
        console.log("\nAll Tasks Deleted");
        deleteMenu();

    }
    else{
        deleteMenu();
        return;
    }
}

//Main function for delete Section

function deleteSection(){
    deleteMenu();
    let deletechoice;
    while(true){
        deletechoice = prompt("Enter you choice [1-3]: ");
        if (deletechoice === "1"){
            deleteOnetask();
        }
        else if(deletechoice === "2"){
            deleteall();
        }
        else if(deletechoice === "3"){
            return;
        }
        else{
            console.log("Invalid input!!! Enter your choice from 1 to 3");
        }
    }

}

deleteSection();






// Main function
// function main(){
//     getMenu();
//     let choice;
//     while (true){
//         choice = prompt("Enter your choice [1-4]: ");
//         if (choice === "1"){
//             todaySection();
//         }
//         else if(choice === "2"){
//             console.log("Schedule section ++++++++++++++");
//         }
//         else if(choice === "3"){
//             console.log("view Section+++++++++++++++++++");
//         }
//         else if(choice === "4"){
//             console.log("Delete section ++++++++++++++++++++++++");
//         }
//         else if(choice ==== "5"){
//             return;
//          }
//         else{
//             console.log("Invalid Input!!  Please Try Again");
//         }
//     }
// }
// main();
