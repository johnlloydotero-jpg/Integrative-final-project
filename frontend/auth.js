const API_AUTH = "http://localhost:5000/api/auth";

/* =========================
   REGISTER
========================= */
async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword")?.value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  // optional confirm password check (safe even if wala sa page)
  if (confirmPassword !== undefined && password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const res = await fetch(`${API_AUTH}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Registered successfully!");
    window.location.href = "login.html";
  } else {
    alert(data.message || "Registration failed");
  }
}

/* =========================
   LOGIN
========================= */
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  const res = await fetch(`${API_AUTH}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } else {
    alert(data.message || "Login failed");
  }
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}