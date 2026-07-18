const menuButton = document.querySelectorAll(".menu-button");
const screenOverlay = document.querySelector(".screen-overlay");
const themeButton = document.querySelector(".theme-button i");

if (localStorage.getItem("darkMode") === "enable") {
  document.body.classList.add("dark-mode");
  if (themeButton) themeButton.classList.replace("fa-moon", "fa-sun");
} else {
  if (themeButton) themeButton.classList.replace("fa-sun", "fa-moon");
}

if (themeButton) {
  themeButton.addEventListener("click", () => {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", isDarkMode ? "enable" : "disable");
    themeButton.classList.toggle("fa-sun", isDarkMode);
    themeButton.classList.toggle("fa-moon", !isDarkMode);
  });
}

menuButton.forEach((button) => {
  button.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-hidden");
  });
});

if (screenOverlay) {
  screenOverlay.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-hidden");
  });
}

function createVideoCardHTML(video, index, isWatchLaterPage) {
  const videoId = video.id.videoId;
  return `
    <div class="video-card">
      <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="video-link">
        <div class="thumbnail-container">
          <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}" class="thumbnail" loading="lazy" />
          <p class="duration">10:00</p>
        </div>
      </a>
      <div class="video-info">
        <img src="images/icon.jpg" alt="channel logo" class="icon" />
        <div class="video-details">
          <h2 class="video-title">${video.snippet.title}</h2>
          <p class="channel-name">${video.snippet.channelTitle}</p>
          <p class="views">${new Date(video.snippet.publishedAt).toLocaleDateString()}</p>
        </div>
        
        ${
          isWatchLaterPage
            ? `<button class="nav-button remove-btn" data-id="${videoId}" type="button" title="Remove" style="color: #ff0000; cursor: pointer;">
                 <i class="fa-solid fa-trash"></i>
               </button>`
            : `<button class="nav-button watch-later-btn" data-index="${index}" type="button" title="Watch later">
                 <i class="fa-regular fa-clock"></i>
               </button>`
        }
      </div>
    </div>`;
}


const videoListContainer = document.getElementById("video-list");

if (window.location.href.includes("watch-later.html")) {
  
  renderWatchLater();

} else if (videoListContainer) {
  
  const API_KEY = "AIzaSyAz57jO0VVT9RtXvQzCK5TRfl1lzKSivio";
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=programming&type=video&key=${API_KEY}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      videoListContainer.innerHTML = "";
      data.items.forEach((video, index) => {
        videoListContainer.innerHTML += createVideoCardHTML(video, index, false);
      });
      attachWatchLaterListeners(data.items);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function renderWatchLater() {
  const container = document.getElementById("video-list");
  if (!container) return;

  const videos = JSON.parse(localStorage.getItem("watchLater")) || [];
  container.innerHTML = "";

  if (videos.length === 0) {
    container.innerHTML = "<p style='padding: 20px; color: var(--black-color);'>No videos added yet.</p>";
    return;
  }

  videos.forEach((video, index) => {
    container.innerHTML += createVideoCardHTML(video, index, true);
  });

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); 
      const videoId = btn.getAttribute("data-id");
      removeVideo(videoId);
    });
  });
}

function removeVideo(id) {
  let watchLater = JSON.parse(localStorage.getItem("watchLater")) || [];
  watchLater = watchLater.filter((item) => item.id.videoId !== id);
  localStorage.setItem("watchLater", JSON.stringify(watchLater));
  renderWatchLater(); 
}

function attachWatchLaterListeners(items) {
  document.querySelectorAll(".watch-later-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); 
      
      const idx = button.getAttribute("data-index");
      const video = items[idx];
      let watchLater = JSON.parse(localStorage.getItem("watchLater")) || [];
      
      if (!watchLater.find((item) => item.id.videoId === video.id.videoId)) {
        watchLater.push(video);
        localStorage.setItem("watchLater", JSON.stringify(watchLater));
        alert("Added to Watch Later");
      } else {
        alert("Already added!");
      }
    });
  });
}



const homeNavLink = document.getElementById("nav-home");
const watchLaterNavLink = document.getElementById("nav-watch-later");

if (homeNavLink) homeNavLink.classList.remove("active");
if (watchLaterNavLink) watchLaterNavLink.classList.remove("active");

if (window.location.href.includes("watch-later.html")) {
    if (watchLaterNavLink) watchLaterNavLink.classList.add("active");
} else {
    if (homeNavLink) homeNavLink.classList.add("active");
}











function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function setError(inputElement, errorElement, message) {
  if (message) {
    inputElement.classList.add("invalid-input");
    errorElement.textContent = message;
  } else {
    inputElement.classList.remove("invalid-input");
    errorElement.textContent = "";
  }
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    
    let isValid = true;

    if (!email.value.trim()) {
      setError(email, emailError, "Email is required");
      isValid = false;
    } else if (!validateEmail(email.value)) {
      setError(email, emailError, "Please enter a valid email address");
      isValid = false;
    } else {
      setError(email, emailError, "");
    }

    if (!password.value) {
      setError(password, passwordError, "Password is required");
      isValid = false;
    } else if (password.value.length < 6) {
      setError(password, passwordError, "Password must be at least 6 characters");
      isValid = false;
    } else {
      setError(password, passwordError, "");
    }

    if (isValid) {
      alert("Login Successful!");
      window.location.href = "index.html"; 
    }
  });
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    
    const usernameError = document.getElementById("usernameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    
    let isValid = true;

    if (!username.value.trim()) {
      setError(username, usernameError, "Full name is required");
      isValid = false;
    } else {
      setError(username, usernameError, "");
    }

    if (!email.value.trim()) {
      setError(email, emailError, "Email is required");
      isValid = false;
    } else if (!validateEmail(email.value)) {
      setError(email, emailError, "Please enter a valid email address");
      isValid = false;
    } else {
      setError(email, emailError, "");
    }

    if (!password.value) {
      setError(password, passwordError, "Password is required");
      isValid = false;
    } else if (password.value.length < 6) {
      setError(password, passwordError, "Password must be at least 6 characters");
      isValid = false;
    } else {
      setError(password, passwordError, "");
    }

    if (!confirmPassword.value) {
      setError(confirmPassword, confirmPasswordError, "Please confirm your password");
      isValid = false;
    } else if (confirmPassword.value !== password.value) {
      setError(confirmPassword, confirmPasswordError, "Passwords do not match");
      isValid = false;
    } else {
      setError(confirmPassword, confirmPasswordError, "");
    }

    if (isValid) {
      alert("Registration Successful! Welcome to YouTube Clone.");
      window.location.href = "login.html"; 
    }
  });
}