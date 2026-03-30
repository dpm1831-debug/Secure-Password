async function login(){

let username = document.getElementById("username").value;
let password = document.getElementById("password").value;
let message = document.getElementById("message");
let info = document.getElementById("attemptInfo");

let response = await fetch("/login",{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body: JSON.stringify({
        username: username,
        password: password
    })
});

let data = await response.json();

message.innerHTML = data.message;

if(data.status === "success"){
    message.style.color="green";
    setTimeout(()=>{
        window.location.href="/dashboard";
    },1200);
}
else if(data.status === "locked"){
    message.style.color="red";
    info.innerHTML="Security System Activated";
}
else{
    message.style.color="orange";
    info.innerHTML="Remaining Attempts: " + data.remaining;
}
}