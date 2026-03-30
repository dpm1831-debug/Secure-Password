/* PASSWORD VISIBILITY TOGGLE */
function togglePassword(){
    let pass = document.getElementById("password");
    pass.type = pass.type === "password" ? "text" : "password";
}

/* EMAIL VERIFY */
function verifyEmail(){
    let email = document.getElementById("email").value;
    let msg = document.getElementById("emailMsg");
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if(email.length === 0){ msg.innerHTML = ""; return; }
    if(pattern.test(email)){
        msg.innerHTML = "✅ Valid Email";
        msg.style.color = "limegreen";
    } else {
        msg.innerHTML = "❌ Invalid Email Format";
        msg.style.color = "red";
    }
}

/* PASSWORD STRENGTH + ENTROPY + LEAK CHECK */
function checkStrength(){
    let pass = document.getElementById("password").value;
    let strengthBox = document.getElementById("strength");
    let entropyBox = document.getElementById("entropy");
    let leakBox = document.getElementById("leakCheck");

    if(pass.length === 0){
        strengthBox.innerHTML = "";
        entropyBox.innerHTML = "";
        leakBox.innerHTML = "";
        return;
    }

    let charset = 0;
    if(/[a-z]/.test(pass)) charset += 26;
    if(/[A-Z]/.test(pass)) charset += 26;
    if(/[0-9]/.test(pass)) charset += 10;
    if(/[^A-Za-z0-9]/.test(pass)) charset += 32;

    let entropy = (pass.length * Math.log2(charset || 1)).toFixed(2);

    let strength;
    if(entropy < 40){ strength = "🔴 Weak"; strengthBox.style.color = "red"; }
    else if(entropy < 70){ strength = "🟠 Medium"; strengthBox.style.color = "orange"; }
    else { strength = "🟢 Strong"; strengthBox.style.color = "#00ffd5"; }

    strengthBox.innerHTML = "Strength: " + strength;
    entropyBox.innerHTML = "Entropy Score: " + entropy + " bits";

    let leakedPasswords = ["123456","password","qwerty","admin123","welcome","iloveyou"];
    if(leakedPasswords.includes(pass.toLowerCase())){
        leakBox.innerHTML = "🚨 Password found in breach database!";
        leakBox.style.color = "red";
    } else {
        leakBox.innerHTML = "✅ Password not found in known leaks";
        leakBox.style.color = "limegreen";
    }
}

/* FORM SUBMIT — validate then let Flask handle it */
document.querySelector("form").addEventListener("submit", function(e){
    let email = document.querySelector("input[name='email']").value;
    let password = document.getElementById("password").value;

    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if(!emailPattern.test(email)){
        e.preventDefault();
        alert("❌ Invalid Email Format");
        return;
    }

    let strongPassword =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*]/.test(password);

    if(!strongPassword){
        e.preventDefault();
        alert("❌ Password must contain:\n• 8+ characters\n• Capital letter\n• Number\n• Symbol");
        return;
    }
    // Valid — form submits to Flask /register
});
