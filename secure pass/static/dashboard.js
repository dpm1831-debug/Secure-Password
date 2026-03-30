function openStrength(){
alert("Password strength analyzer opened!");
}

/* LOGIN LOG */
function addLog(status){

let table = document.getElementById("logTable");

let row = table.insertRow();

let time = new Date().toLocaleTimeString();

row.insertCell(0).innerHTML = time;
row.insertCell(1).innerHTML = status;
}

/* ATTACK TABLE */
function addAttack(ip, attempts, status){

let table = document.getElementById("attackTable");

let row = table.insertRow();

row.insertCell(0).innerHTML = ip;
row.insertCell(1).innerHTML = attempts;
row.insertCell(2).innerHTML = status;
}

/* BRUTE FORCE SIMULATION */
function simulateAttack(){

for(let i=1;i<=5;i++){

setTimeout(()=>{
addLog("Failed Login");

addAttack(
"192.168.0."+i,
i*3,
"Blocked"
);
}, i*700);

}

/* SHOW ALERT */
setTimeout(()=>{
document.getElementById("alertBox")
.classList.remove("hidden");
},4000);
}


let logTable = document.getElementById("logTable");
let attackTable = document.getElementById("attackTable");
let alertBox = document.getElementById("alertBox");

let ipAttempts = {};


/* Generate random IP */
function generateIP(){
return Math.floor(Math.random()*255)+"."+
Math.floor(Math.random()*255)+"."+
Math.floor(Math.random()*255)+"."+
Math.floor(Math.random()*255);
}


/* Current time */
function getTime(){
let now = new Date();
return now.toLocaleTimeString();
}


/* Simulate Attack */
function simulateAttack(){

let ip = generateIP();
let time = getTime();

/* login attempt log */

let row = logTable.insertRow(-1);

let cell1 = row.insertCell(0);
let cell2 = row.insertCell(1);

cell1.innerHTML = time;
cell2.innerHTML = "Failed Login";


/* attack monitoring */

if(!ipAttempts[ip]){
ipAttempts[ip] = 0;
}

ipAttempts[ip]++;

updateAttackTable(ip);


/* show alert */

if(ipAttempts[ip] >= 3){

alertBox.classList.remove("hidden");

}
}


/* Update attack table */

function updateAttackTable(ip){

let table = document.getElementById("attackTable");

let rows = table.rows;

for(let i=1;i<rows.length;i++){

if(rows[i].cells[0].innerHTML === ip){

rows[i].cells[1].innerHTML = ipAttempts[ip];

if(ipAttempts[ip] >= 3){

rows[i].cells[2].innerHTML = "Blocked";
rows[i].cells[2].style.color = "red";

}else{

rows[i].cells[2].innerHTML = "Suspicious";
rows[i].cells[2].style.color = "orange";

}

return;
}

}


/* create new row */

let row = table.insertRow(-1);

let ipCell = row.insertCell(0);
let attemptCell = row.insertCell(1);
let statusCell = row.insertCell(2);

ipCell.innerHTML = ip;
attemptCell.innerHTML = ipAttempts[ip];

if(ipAttempts[ip] >= 3){

statusCell.innerHTML = "Blocked";
statusCell.style.color = "red";

}else{

statusCell.innerHTML = "Monitoring";
statusCell.style.color = "green";

}

}



let totalAttacks = 0;

function analyzePassword(){

let pass = document.getElementById("entropyPass").value;

if(pass.length === 0) return;

let charset = 0;

if(/[a-z]/.test(pass)) charset += 26;
if(/[A-Z]/.test(pass)) charset += 26;
if(/[0-9]/.test(pass)) charset += 10;
if(/[^A-Za-z0-9]/.test(pass)) charset += 32;

let entropy = pass.length * Math.log2(charset);

document.getElementById("entropyResult").innerHTML =
"Entropy: " + entropy.toFixed(2) + " bits";

estimateCrackTime(entropy);
}


/* Crack Time Estimation */

function estimateCrackTime(entropy){

let guessesPerSecond = 1e9; // 1 billion guesses/sec

let seconds = Math.pow(2, entropy) / guessesPerSecond;

let years = seconds / (60*60*24*365);

document.getElementById("crackTime").innerHTML =
"Estimated Crack Time: " + years.toFixed(2) + " years";

updateSecurityLevel(years);
}


/* Security Level */

function updateSecurityLevel(years){

let level = document.getElementById("securityLevel");

if(years < 1){
level.innerHTML="Security Level: 🔴 Weak";
level.style.color="red";
}
else if(years < 1000){
level.innerHTML="Security Level: 🟠 Medium";
level.style.color="orange";
}
else{
level.innerHTML="Security Level: 🟢 Strong";
level.style.color="lime";
}

}
