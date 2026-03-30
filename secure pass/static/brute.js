let wordlist = [];

// Demo credentials (SAFE)
const correctUsername = "d_mane";
const correctPassword = "dhanu123";

// Generate wordlist
function generateWordlist() {
    wordlist = ["123456", "password", "dhanu", "dhanu123", "admin"];
    alert("Wordlist Generated!");
}

// File upload
document.getElementById("fileInput").addEventListener("change", function(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        wordlist = e.target.result.split("\n");
        alert("Wordlist Loaded!");
    };
    reader.readAsText(event.target.files[0]);
});

// Start attack (simulation)
function startAttack() {
    const username = document.getElementById("username").value;
    const output = document.getElementById("output");

    output.innerHTML = "";

    if (username !== correctUsername) {
        output.innerHTML = "❌ Username not found!";
        return;
    }

    let i = 0;

    let interval = setInterval(() => {
        if (i >= wordlist.length) {
            output.innerHTML += "<br>❌ Password not found!";
            clearInterval(interval);
            return;
        }

        let attempt = wordlist[i].trim();
        output.innerHTML += `<br>Trying: ${attempt}`;

        if (attempt === correctPassword) {
            output.innerHTML += `<br><br>✅ SUCCESS! Password Found: ${attempt}`;
            clearInterval(interval);
        }

        i++;
    }, 500);
}