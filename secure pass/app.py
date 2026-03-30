from flask import Flask, render_template, request, redirect, jsonify, session
import math
import bcrypt
from datetime import datetime
import random
import hashlib
import string

app = Flask(__name__)
app.secret_key = "secure_main_secret_2026_xyz"

# ======================================
# IN-MEMORY DATABASE
# ======================================

users = []
login_logs = []
attack_monitor = {}
total_attacks = 0

# ======================================
# HELPERS
# ======================================

def generate_ip():
    return ".".join(str(random.randint(1, 255)) for _ in range(4))

def analyze_password(password):
    charset = 0
    if any(c.islower() for c in password): charset += 26
    if any(c.isupper() for c in password): charset += 26
    if any(c.isdigit() for c in password): charset += 10
    if any(not c.isalnum() for c in password): charset += 32

    entropy = len(password) * math.log2(charset or 1)

    if entropy < 40:
        strength = "Weak"
    elif entropy < 70:
        strength = "Medium"
    else:
        strength = "Strong"

    return strength, round(entropy, 2)

def check_leak(password):
    leaked_words = ["123456", "password", "admin", "qwerty", "admin123"]
    return password.lower() in leaked_words

def record_attempt(ip, success):
    global total_attacks
    if success:
        attack_monitor[ip] = 0
        return False
    attack_monitor[ip] = attack_monitor.get(ip, 0) + 1
    total_attacks += 1
    return attack_monitor[ip] >= 3

# ======================================
# PAGE ROUTES (CLEAN)
# ======================================

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/login")
def login_page():
    return render_template("login.html")

@app.route("/register_page")
def register_page():
    return render_template("register.html")

@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect("/login")
    return render_template("dashboard.html")

@app.route("/checker")
def checker():
    if "user" not in session:
        return redirect("/login")
    return render_template("checker.html")

@app.route("/hash")
def hash_page():
    if "user" not in session:
        return redirect("/login")
    return render_template("hash.html")

@app.route("/brute")
def brute():
    if "user" not in session:
        return redirect("/login")
    return render_template("brute.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")

# ======================================
# REGISTER
# ======================================

@app.route("/register", methods=["POST"])
def register():
    name = request.form.get("name", "")
    email = request.form.get("email", "")
    password = request.form.get("password", "")

    if not email or not password:
        return redirect("/register_page")

    if any(u["email"] == email for u in users):
        return redirect("/register_page")

    strength, entropy = analyze_password(password)
    leaked = check_leak(password)
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    users.append({
        "name": name,
        "email": email,
        "password": hashed,
        "strength": strength,
        "entropy": entropy,
        "leaked": leaked
    })

    return redirect("/login")

# ======================================
# LOGIN
# ======================================

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", "")
    password = data.get("password", "")
    ip = request.remote_addr

    user = next((u for u in users if u["email"] == username), None)

    if user and bcrypt.checkpw(password.encode(), user["password"]):
        record_attempt(ip, True)
        session["user"] = username
        login_logs.append({"time": datetime.now().strftime("%H:%M:%S"), "status": "Success"})
        return jsonify({"status": "success"})

    attack = record_attempt(ip, False)
    login_logs.append({"time": datetime.now().strftime("%H:%M:%S"), "status": "Failed"})

    if attack:
        return jsonify({"status": "locked", "message": "Too many attempts"})

    return jsonify({"status": "error", "message": "Invalid credentials"})

# ======================================
# APIs
# ======================================

@app.route("/api/check_password", methods=["POST"])
def check_password():
    data = request.get_json()
    password = data.get("password", "")
    strength, entropy = analyze_password(password)
    return jsonify({"strength": strength, "entropy": entropy})

@app.route("/generate_hash", methods=["POST"])
def generate_hash():
    data = request.get_json()
    text = data.get("input", "")
    return jsonify({"hash": hashlib.sha256(text.encode()).hexdigest()})

@app.route("/api/get_logs")
def get_logs():
    return jsonify(login_logs)

@app.route("/api/simulate_attack", methods=["POST"])
def simulate_attack():
    global total_attacks
    ip = generate_ip()
    attack_monitor[ip] = attack_monitor.get(ip, 0) + 1
    total_attacks += 1

    return jsonify({
        "ip": ip,
        "attempts": attack_monitor[ip],
        "status": "Blocked" if attack_monitor[ip] >= 3 else "Monitoring",
        "total_attacks": total_attacks
    })

# ======================================
# RUN
# ======================================

if __name__ == "__main__":
    app.run(debug=True)