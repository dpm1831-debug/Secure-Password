function check(){

let pass = document.getElementById("checkPass").value;
let result = document.getElementById("result");

let score = 0;

/* length check */
if(pass.length >= 8) score++;

/* uppercase */
if(/[A-Z]/.test(pass)) score++;

/* numbers */
if(/[0-9]/.test(pass)) score++;

/* special characters */
if(/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;

/* lowercase */
if(/[a-z]/.test(pass)) score++;



/* evaluation */
if(score <= 2){
result.innerHTML = "❌ Weak Password";
result.style.color = "red";
}

else if(score <= 4){
result.innerHTML = "⚠ Medium Strength Password";
result.style.color = "orange";
}

else{
result.innerHTML = "✅ Strong Password";
result.style.color = "green";
}

}