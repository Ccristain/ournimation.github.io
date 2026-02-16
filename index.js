// Post Management: load persisted posts (if any)
let posts = JSON.parse(localStorage.getItem("animationPosts")) || [];

// DOM references: modal, buttons, and form
const modal = document.getElementById("createPostModal");
const createPostBtn = document.getElementById("createPostBtn");
const clearPostsBtn = document.getElementById("clearPostsBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const postForm = document.getElementById("postForm");

// Auth UI references
const accountInfo = document.getElementById("accountInfo");
const authButtons = document.getElementById("authButtons");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

// Modal helpers: open/close dialog
function openModal() {
  if (!modal) {
    return;
  }
  modal.style.display = "block";
}

function closeModal() {
  if (!modal) {
    return;
  }
  modal.style.display = "none";
  if (postForm) {
    postForm.reset();
  }
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

// Auth Modal Management
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");
const closeLoginModal = document.getElementById("closeLoginModal");
const closeSignupModal = document.getElementById("closeSignupModal");
const switchToSignup = document.getElementById("switchToSignup");
const switchToLogin = document.getElementById("switchToLogin");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

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
      const response = await fetch("login.php", {
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
      const response = await fetch("signup.php", {
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

// Header actions: open/close modal, clear posts
if (createPostBtn) {
  createPostBtn.addEventListener("click", openModal);
}
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModal);
}
if (cancelBtn) {
  cancelBtn.addEventListener("click", closeModal);
}

if (clearPostsBtn) {
  clearPostsBtn.addEventListener("click", () => {
    const confirmed = window.confirm("Clear all posts? This cannot be undone.");
    if (!confirmed) {
      return;
    }
    posts = [];
    localStorage.removeItem("animationPosts");
    renderPosts();
  });
}

// Close modal when clicking outside the dialog
window.addEventListener("click", (event) => {
  if (modal && event.target === modal) {
    closeModal();
  }
});

// Handle form submission: create a new post
if (postForm) {
  postForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("postTitle").value;
    const description = document.getElementById("postDescription").value;
    const mediaInput = document.getElementById("postMedia");

    // Create new post object (media added below if provided)
    const newPost = {
      id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
      creator: "You",
      creatorName: getCurrentUsername(),
      time: "just now",
      creatorAvatar: getCurrentAvatarSrc(),
      title: title,
      description: description,
      media: null,
      mediaType: null,
      likes: 0,
      liked: false,
      comments: [],
      timestamp: Date.now(),
    };

    // Handle optional media upload
    if (mediaInput.files && mediaInput.files[0]) {
      const file = mediaInput.files[0];

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Maximum file size is 5MB.");
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          newPost.media = e.target.result;
          newPost.mediaType = file.type.startsWith("video") ? "video" : "image";

          // Add post to array
          posts.unshift(newPost);
          savePosts();
          renderPosts();
          closeModal();
        } catch (error) {
          console.error("Error processing post:", error);
          alert("Error creating post. File might be too large.");
        }
      };

      reader.onerror = () => {
        console.error("Error reading file");
        alert("Error reading file. Please try again.");
      };

      reader.readAsDataURL(file);
    } else {
      // Add post without media
      posts.unshift(newPost);
      savePosts();
      renderPosts();
      closeModal();
    }
  });
}

// Persist posts to localStorage
function savePosts() {
  try {
    localStorage.setItem("animationPosts", JSON.stringify(posts));
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      alert(
        "Storage quota exceeded. Please delete some posts or clear old media.",
      );
      console.error("localStorage quota exceeded", error);
    } else {
      console.error("Error saving posts:", error);
    }
  }
}

// Get current user avatar from the header (fallback to placeholder)
function getCurrentAvatarSrc() {
  const avatar = document.querySelector(".account-info .avatar");
  return avatar ? avatar.getAttribute("src") : "placeholder-avatar.png";
}

// Get current user name from the header (fallback to Guest)
function getCurrentUsername() {
  const name = document.querySelector(".account-info .username");
  return name ? name.textContent.trim() : "Guest";
}

// Render all posts to the newsfeed container
function renderPosts() {
  const postsContainer = document.getElementById("postsContainer");
  if (!postsContainer) {
    return;
  }
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    ensurePostDefaults(post);
    const postCard = createPostCard(post);
    postsContainer.appendChild(postCard);
  });
}

// Ensure older posts have required fields
function ensurePostDefaults(post) {
  if (!Array.isArray(post.comments)) {
    post.comments = [];
  }
  if (typeof post.liked !== "boolean") {
    post.liked = false;
  }
  if (typeof post.likes !== "number") {
    post.likes = 0;
  }
  if (!post.creatorAvatar) {
    post.creatorAvatar = "placeholder-avatar.png";
  }
  if (!post.creatorName) {
    post.creatorName = "Guest";
  }
}

// Create a post card element from a post object
function createPostCard(post) {
  const postCard = document.createElement("div");
  postCard.className = "post-card";
  postCard.setAttribute("data-post-id", post.id);

  const currentAvatarSrc = getCurrentAvatarSrc();

  const mediaHTML = post.media
    ? post.mediaType === "video"
      ? `<video src="${post.media}" controls style="width: 100%; border-radius: 8px; margin-bottom: 1rem;" preload="metadata"></video>`
      : `<img src="${post.media}" alt="Post media" loading="lazy" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;" />`
    : "";

  const commentsHTML = post.comments.length
    ? `<div class="comments-list">
        ${post.comments
          .map(
            (comment) =>
              `<div class="comment-item">
                <img
                  src="${comment.avatar || "placeholder-avatar.png"}"
                  alt="Commenter"
                  class="comment-avatar"
                  loading="lazy"
                />
                <div class="comment-body">
                  <span class="comment-username">${comment.username || "Guest"}</span>
                  <span class="comment-text">${comment.text}</span>
                  <span class="comment-time">${comment.time}</span>
                </div>
              </div>`,
          )
          .join("")}
      </div>`
    : "";

  postCard.innerHTML = `
    <div class="post-header">
      <img src="${post.creatorAvatar || "placeholder-avatar.png"}" alt="Creator" class="post-avatar" loading="lazy" />
      <div class="post-info">
        <h3 class="post-creator">${post.creatorName || post.creator}</h3>
        <span class="post-time">${post.time}</span>
      </div>
    </div>
    <div class="post-content">
      <h4>${post.title}</h4>
      <p>${post.description}</p>
      ${post.media ? `<div class="post-animation">${mediaHTML}</div>` : ""}
    </div>
    <div class="post-footer">
      <button class="btn-like${post.liked ? " liked" : ""}" data-post-id="${post.id}" title="Like">
        <i class="fas fa-heart"></i>
      </button>
      <button class="btn-comment"><i class="fas fa-comment"></i> Comment</button>
      <button class="btn-share" title="Share">
        <i class="fas fa-share-alt"></i>
      </button>
    </div>
    <div class="comments-section">
      <form class="comment-form" data-post-id="${post.id}">
        <input
          type="text"
          class="comment-input"
          placeholder="Write a comment..."
          required
        />
        <button type="submit" class="btn-comment-submit" aria-label="Send">
          <i class="fas fa-paper-plane"></i>
        </button>
      </form>
      ${commentsHTML}
    </div>
  `;

  // Add like functionality
  const likeBtn = postCard.querySelector(".btn-like");
  likeBtn.addEventListener("click", () => likePost(post.id, likeBtn));

  // Toggle comment section
  const commentBtn = postCard.querySelector(".btn-comment");
  commentBtn.addEventListener("click", () => {
    const isOpen = postCard.classList.toggle("comments-open");
    commentBtn.classList.toggle("active", isOpen);

    // Scroll to comment section when opened
    if (isOpen) {
      setTimeout(() => {
        const commentsSection = postCard.querySelector(".comments-section");
        commentsSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  });

  // Handle new comment submission
  const commentForm = postCard.querySelector(".comment-form");
  commentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = commentForm.querySelector(".comment-input");
    const text = input.value.trim();
    if (!text) {
      return;
    }

    const targetPost = posts.find((p) => p.id === post.id);
    if (!targetPost) {
      return;
    }

    ensurePostDefaults(targetPost);
    const avatarSrc = getCurrentAvatarSrc();
    const username = getCurrentUsername();
    targetPost.comments.unshift({
      username,
      avatar: avatarSrc,
      text,
      time: "just now",
    });

    savePosts();

    const commentsSection = postCard.querySelector(".comments-section");
    let commentsList = commentsSection.querySelector(".comments-list");

    if (!commentsList) {
      commentsList = document.createElement("div");
      commentsList.className = "comments-list";
      commentsSection.appendChild(commentsList);
    }

    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";
    commentItem.innerHTML = `
      <img
        src="${avatarSrc}"
        alt="Commenter"
        class="comment-avatar"
        loading="lazy"
      />
      <div class="comment-body">
        <span class="comment-username">${username}</span>
        <span class="comment-text">${text}</span>
        <span class="comment-time">just now</span>
      </div>
    `;
    commentsList.prepend(commentItem);
    if (commentsList.children.length >= 3) {
      commentsList.classList.add("comments-scroll");
    }

    input.value = "";
    postCard.classList.add("comments-open");
  });

  if (post.comments.length >= 3) {
    const list = postCard.querySelector(".comments-list");
    if (list) {
      list.classList.add("comments-scroll");
    }
  }

  return postCard;
}

// Like functionality: update count and persist
function likePost(postId, button) {
  const post = posts.find((p) => p.id === postId);
  if (post) {
    ensurePostDefaults(post);
    if (post.liked) {
      post.likes = Math.max(0, post.likes - 1);
      post.liked = false;
    } else {
      post.likes += 1;
      post.liked = true;
    }
    savePosts();
    button.classList.toggle("liked", post.liked);
    button.innerHTML = '<i class="fas fa-heart"></i>';
    button.classList.remove("like-animate");
    void button.offsetWidth;
    button.classList.add("like-animate");
  }
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
    const response = await fetch("check_session.php");
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
    const response = await fetch("logout.php", {
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
      // Optionally reload the page
      // window.location.reload();
    }
  } catch (error) {
    console.error("Logout error:", error);
    alert("An error occurred during logout.");
  }
}

// Initial render + UI enhancements (auto-grow textarea, file label)
document.addEventListener("DOMContentLoaded", () => {
  renderPosts();
  checkSession(); // Check if user is logged in

  // Mobile hamburger menu toggle
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
      hamburgerBtn.classList.toggle("active");
    });
  }

  const navLinks = document.querySelectorAll(".nav-link");
  if (navLinks.length) {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        if (hamburgerBtn) {
          hamburgerBtn.classList.remove("active");
        }
      });
    });
  }

  const sidebar = document.querySelector(".sidebar");
  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("nav-open")) {
      return;
    }

    const target = event.target;
    const clickedHamburger = hamburgerBtn && hamburgerBtn.contains(target);
    const clickedSidebar = sidebar && sidebar.contains(target);

    if (!clickedHamburger && !clickedSidebar) {
      document.body.classList.remove("nav-open");
      if (hamburgerBtn) {
        hamburgerBtn.classList.remove("active");
      }
    }
  });

  // Auto-expanding textarea
  const textarea = document.getElementById("postDescription");
  if (textarea) {
    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = Math.max(40, textarea.scrollHeight) + "px";
    });
  }

  // File input display name
  const fileInput = document.getElementById("postMedia");
  if (fileInput) {
    fileInput.addEventListener("change", (event) => {
      if (event.target.files && event.target.files[0]) {
        const fileName = event.target.files[0].name;
        const label = document.querySelector(".file-input-label");
        if (label) {
          label.innerHTML = `<i class="fas fa-check-circle"></i> ${fileName}`;
          label.style.color = "var(--accent)";
          label.style.borderColor = "var(--accent)";
        }
      }
    });
  }
});
