async function generateHash(){
    let input = document.getElementById("hashInput").value;
    let output = document.getElementById("hashOutput");

    if(!input){
        output.innerHTML = "❌ Please enter a password";
        return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2,'0')).join('');

    output.innerHTML = "SHA-256 Hash:<br><code>" + hashHex + "</code>";
}
