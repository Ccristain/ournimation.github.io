// Shared Authentication System for Ournimation
// This file handles login, signup, logout, and session management across all pages

// Auth UI references
const accountInfo = document.getElementById("accountInfo");
const authButtons = document.getElementById("authButtons");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

// Auth Modal references (will be created dynamically)
let loginModal, signupModal, closeLoginModal, closeSignupModal;
let switchToSignup, switchToLogin, loginForm, signupForm;

// Initialize auth modals on page load
function initAuthModals() {
  // Create auth modals HTML
  const modalsHTML = `
    <!-- Login Modal -->
    <section class="auth-modal" id="loginModal" role="dialog" aria-modal="true">
      <section class="auth-card">
        <button class="close-auth-modal" id="closeLoginModal">
          <i class="fas fa-times"></i>
        </button>
        <header class="auth-card-header">
          <h2>Login</h2>
        </header>
        <form class="auth-form" id="loginForm">
          <div class="form-group">
            <label for="loginEmail">
              <i class="fas fa-envelope"></i> Username or Email
            </label>
            <input
              type="text"
              id="loginEmail"
              placeholder="Enter your username or email"
              required
            />
          </div>
          <div class="form-group">
            <label for="loginPassword">
              <i class="fas fa-lock"></i> Password
            </label>
            <input
              type="password"
              id="loginPassword"
              placeholder="Enter your password"
              required
            />
          </div>
          <div class="auth-remember-row">
            <div class="form-group-checkbox">
              <input type="checkbox" id="loginRemember" />
              <label for="loginRemember">Remember me</label>
            </div>
            <div class="auth-forgot">
              <a href="#">Forgot password?</a>
            </div>
          </div>
          <button type="submit" class="auth-submit-btn">
            <i class="fas fa-sign-in-alt"></i> Login
          </button>
        </form>
        <footer class="auth-switch">
          <p>Don't have an account?</p>
          <button class="switch-auth-btn" id="switchToSignup">Sign Up</button>
        </footer>
      </section>
    </section>

    <!-- Signup Modal -->
    <section class="auth-modal" id="signupModal" role="dialog" aria-modal="true">
      <section class="auth-card">
        <button class="close-auth-modal" id="closeSignupModal">
          <i class="fas fa-times"></i>
        </button>
        <header class="auth-card-header">
          <h2>Sign Up</h2>
        </header>
        <form class="auth-form" id="signupForm">
          <div class="form-group">
            <label for="signupEmail">
              <i class="fas fa-envelope"></i> Username or Email
            </label>
            <input
              type="text"
              id="signupEmail"
              placeholder="Enter your username or email"
              required
            />
          </div>
          <div class="form-group">
            <label for="signupPassword">
              <i class="fas fa-lock"></i> Password
            </label>
            <input
              type="password"
              id="signupPassword"
              placeholder="Enter your password"
              required
            />
          </div>
          <div class="form-group-checkbox">
            <input type="checkbox" id="signupRemember" />
            <label for="signupRemember">Remember me</label>
          </div>
          <button type="submit" class="auth-submit-btn">
            <i class="fas fa-user-plus"></i> Create Account
          </button>
        </form>
        <footer class="auth-switch">
          <p>Already have an account?</p>
          <button class="switch-auth-btn" id="switchToLogin">Login</button>
        </footer>
      </section>
    </section>
  `;

  // Append modals to body
  document.body.insertAdjacentHTML("beforeend", modalsHTML);

  // Get modal references
  loginModal = document.getElementById("loginModal");
  signupModal = document.getElementById("signupModal");
  closeLoginModal = document.getElementById("closeLoginModal");
  closeSignupModal = document.getElementById("closeSignupModal");
  switchToSignup = document.getElementById("switchToSignup");
  switchToLogin = document.getElementById("switchToLogin");
  loginForm = document.getElementById("loginForm");
  signupForm = document.getElementById("signupForm");

  // Setup event listeners
  setupAuthListeners();
}

// Auth UI: toggle between account-info and auth buttons
function showAuthButtons() {
  if (!accountInfo || !authButtons) {
    return;
  }
  accountInfo.style.display = "none";
  authButtons.style.display = "flex";
  authButtons.classList.add("fade-in");
}

function showAccountInfo() {
  if (!accountInfo || !authButtons) {
    return;
  }
  authButtons.classList.remove("fade-in");
  authButtons.classList.add("fade-out");

  setTimeout(() => {
    authButtons.style.display = "none";
    authButtons.classList.remove("fade-out");
  }, 300);

  accountInfo.style.display = "flex";
}

function openLoginModal() {
  if (!loginModal) {
    return;
  }
  loginModal.classList.add("active");
  showAccountInfo();
}

function closeLoginModalFunc() {
  if (!loginModal) {
    return;
  }
  loginModal.classList.remove("active");
}

function openSignupModal() {
  if (!signupModal) {
    return;
  }
  signupModal.classList.add("active");
  showAccountInfo();
}

function closeSignupModalFunc() {
  if (!signupModal) {
    return;
  }
  signupModal.classList.remove("active");
}

// Update UI with logged-in user information
function updateUserUI(user) {
  const usernameElement = document.querySelector(".account-info .username");
  if (usernameElement && user.username) {
    usernameElement.textContent = user.username;
  }
  // Show account info, hide auth buttons
  showAccountInfo();
}

// Check if user is logged in on page load
async function checkSession() {
  try {
    // Determine the correct path to check_session.php based on current page location
    const path = getAuthPath("check_session.php");

    const response = await fetch(path);
    const data = await response.json();

    if (data.success && data.loggedIn) {
      updateUserUI(data.user);
    } else {
      // User not logged in, show auth buttons
      const usernameElement = document.querySelector(".account-info .username");
      if (usernameElement) {
        usernameElement.textContent = "Guest";
      }
    }
  } catch (error) {
    console.error("Session check error:", error);
  }
}

// Logout functionality
async function logout() {
  try {
    const path = getAuthPath("logout.php");

    const response = await fetch(path, {
      method: "POST",
    });

    const data = await response.json();

    if (data.success) {
      // Reset UI to guest
      const usernameElement = document.querySelector(".account-info .username");
      if (usernameElement) {
        usernameElement.textContent = "Guest";
      }
      alert("Logged out successfully");
      // Reload the page to reset state
      window.location.reload();
    }
  } catch (error) {
    console.error("Logout error:", error);
    alert("An error occurred during logout.");
  }
}

// Get the correct path to auth PHP files based on current page location
function getAuthPath(filename) {
  const currentPath = window.location.pathname;

  // If we're in the root directory
  if (
    currentPath.includes("/ournimation.github.io/index.html") ||
    currentPath.endsWith("/ournimation.github.io/")
  ) {
    return filename;
  }

  // If we're in a subdirectory (about_folder, contact_folder, etc.)
  return "../" + filename;
}

// Setup all authentication event listeners
function setupAuthListeners() {
  // Login button handler
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      openLoginModal();
    });
  }

  // Sign up button handler
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      openSignupModal();
    });
  }

  // Close modal buttons
  if (closeLoginModal) {
    closeLoginModal.addEventListener("click", closeLoginModalFunc);
  }
  if (closeSignupModal) {
    closeSignupModal.addEventListener("click", closeSignupModalFunc);
  }

  // Switch between login and signup
  if (switchToSignup) {
    switchToSignup.addEventListener("click", () => {
      closeLoginModalFunc();
      openSignupModal();
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener("click", () => {
      closeSignupModalFunc();
      openLoginModal();
    });
  }

  // Close modals when clicking outside
  if (loginModal) {
    loginModal.addEventListener("click", (event) => {
      if (event.target === loginModal) {
        closeLoginModalFunc();
      }
    });
  }

  if (signupModal) {
    signupModal.addEventListener("click", (event) => {
      if (event.target === signupModal) {
        closeSignupModalFunc();
      }
    });
  }

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      const remember = document.getElementById("loginRemember").checked;

      try {
        const path = getAuthPath("login.php");

        const response = await fetch(path, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, remember }),
        });

        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          alert(data.message);
          // Update UI with user info
          updateUserUI(data.user);
          closeLoginModalFunc();
          loginForm.reset();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Login error:", error);
        alert(
          "An error occurred during login. Please try again.\n\nError: " +
            error.message +
            "\n\nMake sure you are accessing through Apache (http://localhost/GreatLearning/ournimation.github.io/) not Live Server (port 5500).",
        );
      }
    });
  }

  // Handle signup form submission
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const remember = document.getElementById("signupRemember").checked;

      try {
        const path = getAuthPath("signup.php");

        const response = await fetch(path, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, remember }),
        });

        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          alert(data.message);
          // Update UI with user info
          updateUserUI(data.user);
          closeSignupModalFunc();
          signupForm.reset();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Signup error:", error);
        alert(
          "An error occurred during signup. Please try again.\n\nError: " +
            error.message +
            "\n\nMake sure you are accessing through Apache (http://localhost/GreatLearning/ournimation.github.io/) not Live Server (port 5500).",
        );
      }
    });
  }

  // Click account-info to show auth buttons or logout
  if (accountInfo && authButtons) {
    accountInfo.addEventListener("click", (event) => {
      event.stopPropagation();

      // Check if user is logged in
      const usernameElement = document.querySelector(".account-info .username");
      const currentUsername = usernameElement
        ? usernameElement.textContent.trim()
        : "Guest";

      if (currentUsername !== "Guest") {
        // User is logged in, show logout confirmation
        const confirmLogout = confirm(
          `Logged in as ${currentUsername}. Do you want to logout?`,
        );
        if (confirmLogout) {
          logout();
        }
      } else {
        // User is not logged in, show auth buttons
        showAuthButtons();
      }
    });

    // Click anywhere else to show account-info again
    document.addEventListener("click", (event) => {
      // If auth buttons are visible and click is outside both elements
      if (
        authButtons.style.display === "flex" &&
        !accountInfo.contains(event.target) &&
        !authButtons.contains(event.target)
      ) {
        showAccountInfo();
      }
    });
  }
}

// Initialize authentication system when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initAuthModals();
  checkSession(); // Check if user is logged in
});
