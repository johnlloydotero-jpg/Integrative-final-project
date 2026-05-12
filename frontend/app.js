const API = "http://localhost:5000/api/links";
const AUTH = "http://localhost:5000/api/auth";

/* =========================
   PROFILE SYSTEM (PER USER)
========================= */

// upload profile (from file input)
function uploadProfile(event) {

  const file = event.target.files[0];
  if (!file) return;

  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return;

  const reader = new FileReader();

  reader.onload = function (e) {

    const image = e.target.result;

    localStorage.setItem(`profile_${currentUser}`, image);

    const mainPic = document.getElementById("profilePreview");
    if (mainPic) mainPic.src = image;

    const editPic = document.getElementById("editProfilePreview");
    if (editPic) editPic.src = image;
  };

  reader.readAsDataURL(file);
}

/* =========================
   EDIT PROFILE MODAL
========================= */

function openEditProfile() {

  const currentUser = localStorage.getItem("currentUser");
  const saved = localStorage.getItem(`profile_${currentUser}`);

  document.getElementById("editProfileModal").classList.remove("hidden");

  document.getElementById("editProfilePreview").src =
    saved || "assets/default-profile.png";
}

function closeEditProfile() {
  document.getElementById("editProfileModal").classList.add("hidden");
}

function changeProfile(event) {

  const file = event.target.files[0];
  if (!file) return;

  const currentUser = localStorage.getItem("currentUser");

  const reader = new FileReader();

  reader.onload = function (e) {

    const image = e.target.result;

    localStorage.setItem(`profile_${currentUser}`, image);

    document.getElementById("profilePreview").src = image;
    document.getElementById("editProfilePreview").src = image;
  };

  reader.readAsDataURL(file);
}

/* =========================
   REGISTER
========================= */

async function register() {

  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  if (!email || !password) {
    alert("Please fill all fields!");
    return;
  }

  const res = await fetch(`${AUTH}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Registered successfully!");
    showLogin();
  } else {
    alert(data.message || "Registration failed");
  }
}

/* =========================
   LOGIN
========================= */

async function login() {

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please fill all fields!");
    return;
  }

  const res = await fetch(`${AUTH}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {

    localStorage.setItem("token", data.token);
    localStorage.setItem("currentUser", email);

    document.getElementById("guestButtons").classList.add("hidden");
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("registerBox").classList.add("hidden");

    document.getElementById("dashboardBar").classList.remove("hidden");

    // PROFILE LOAD
    const savedProfile = localStorage.getItem(`profile_${email}`);
    if (savedProfile) {
      document.getElementById("profilePreview").src = savedProfile;
    }

    document.getElementById("usernameDisplay").textContent = email.split("@")[0];
    document.getElementById("emailDisplay").textContent = email;

    showSavedSection();

  } else {
    alert(data.message || "Login failed");
  }
}

/* =========================
   LOAD LINKS
========================= */

async function loadLinks() {

  const token = localStorage.getItem("token");

  const res = await fetch(API, {
    headers: { Authorization: "Bearer " + token }
  });

  const links = await res.json();

  const container = document.getElementById("links");
  container.innerHTML = "";

  const totalSlots = 24;

  for (let i = 0; i < totalSlots; i++) {

    if (links[i]) {

      container.innerHTML += `
        <div class="link-card">

          <div>
            <h3>${links[i].title}</h3>
            <a href="${links[i].url}" target="_blank">
              ${links[i].url}
            </a>
          </div>

          <div class="actions">

            <button onclick="deleteLink('${links[i]._id || links[i].id}')">
              Delete
            </button>

          </div>

        </div>
      `;

    } else {

      container.innerHTML += `
        <div class="empty-slot"></div>
      `;

    }
  }
}

/* =========================
   ADD LINK
========================= */

async function addLink() {

  const token = localStorage.getItem("token");

  const title = document.getElementById("title").value;
  const url = document.getElementById("url").value;

  if (!title || !url) {
    alert("Please fill all fields!");
    return;
  }

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ title, url })
  });

  if (res.ok) {
    showMessage("Link Saved ✔️");
    loadLinks();
  } else {
    alert("Failed to save link");
  }
}

/* =========================
   DELETE LINK
========================= */

async function deleteLink(id) {

  const token = localStorage.getItem("token");

  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  loadLinks();
}

/* =========================
   MESSAGE
========================= */

function showMessage(text) {

  const msg = document.createElement("div");
  msg.innerText = text;

  msg.style.position = "fixed";
  msg.style.bottom = "20px";
  msg.style.right = "20px";
  msg.style.background = "#22c55e";
  msg.style.color = "white";
  msg.style.padding = "12px 18px";
  msg.style.borderRadius = "10px";
  msg.style.zIndex = "9999";

  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 2000);
}

/* =========================
   UI SWITCH
========================= */

function showLogin() {
  document.getElementById("loginBox").classList.remove("hidden");
  document.getElementById("registerBox").classList.add("hidden");
}

function showRegister() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("registerBox").classList.remove("hidden");
}

function showAddSection() {
  document.getElementById("addSection").classList.remove("hidden");
  document.getElementById("savedSection").classList.add("hidden");
}

function showSavedSection() {
  document.getElementById("addSection").classList.add("hidden");
  document.getElementById("savedSection").classList.remove("hidden");
  loadLinks();
}

/* =========================
   LOGOUT
========================= */

function logout() {

  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");

  document.getElementById("dashboardBar").classList.add("hidden");
  document.getElementById("guestButtons").classList.remove("hidden");

  document.getElementById("loginBox").classList.remove("hidden");
  document.getElementById("registerBox").classList.add("hidden");

  document.getElementById("addSection").classList.add("hidden");
  document.getElementById("savedSection").classList.add("hidden");
}

/* =========================
   SEARCH
========================= */

function searchLinks() {

  const input = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".link-card");

  cards.forEach(card => {

    const text = card.innerText.toLowerCase();

    card.style.display = text.includes(input) ? "flex" : "none";

  });
}

/* =========================
   INIT
========================= */

window.onload = function () {

  const token = localStorage.getItem("token");
  const currentUser = localStorage.getItem("currentUser");

  if (token) {

    document.getElementById("guestButtons").classList.add("hidden");
    document.getElementById("dashboardBar").classList.remove("hidden");

    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("registerBox").classList.add("hidden");

    document.getElementById("addSection").classList.remove("hidden");

    if (currentUser) {

      const savedProfile = localStorage.getItem(`profile_${currentUser}`);

      if (savedProfile) {
        document.getElementById("profilePreview").src = savedProfile;
      }

      document.getElementById("usernameDisplay").textContent =
        currentUser.split("@")[0];

      document.getElementById("emailDisplay").textContent =
        currentUser;
    }

    showSavedSection();
  }
};

async function toggleFavorite(id, currentState) {

  const token = localStorage.getItem("token");

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      favorite: !currentState
    })
  });

  loadLinks();
}