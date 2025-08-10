// BLOCKEDLEARNING - Main JavaScript File
// Handles MetaMask authentication and navigation logic

// Global variables to store application state
let currentAccount = null
const web3 = null

// DOM elements - we'll reference these throughout the app
const elements = {
  // Index page elements
  connectBtn: document.getElementById("connect-wallet"),
  userInfo: document.getElementById("user-info"),
  walletAddress: document.getElementById("wallet-address"),
  goToCoursesBtn: document.getElementById("go-to-courses"),
  disconnectBtn: document.getElementById("disconnect-wallet"),
  connectionStatus: document.getElementById("connection-status"),

  // Courses page elements
  currentUser: document.getElementById("current-user"),
  logoutBtn: document.getElementById("logout-btn"),
  uploadBtn: document.getElementById("upload-btn"),
  courseTitleInput: document.getElementById("course-title"),
  courseFileInput: document.getElementById("course-file"),
  uploadStatus: document.getElementById("upload-status"),
  coursesContainer: document.getElementById("courses-container"),
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 BLOCKEDLEARNING initialized")

  // Check if we're on index.html or courses.html and initialize accordingly
  if (window.location.pathname.includes("courses.html") || window.location.pathname === "/courses") {
    initCoursesPage()
  } else {
    initIndexPage()
  }

  // Check if user was previously connected
  checkExistingConnection()
})

// INDEX PAGE FUNCTIONS
// ====================

function initIndexPage() {
  console.log("📄 Initializing index page")

  // Add event listeners for index page buttons
  if (elements.connectBtn) {
    elements.connectBtn.addEventListener("click", connectWallet)
  }

  if (elements.goToCoursesBtn) {
    elements.goToCoursesBtn.addEventListener("click", () => {
      window.location.href = "courses.html"
    })
  }

  if (elements.disconnectBtn) {
    elements.disconnectBtn.addEventListener("click", disconnectWallet)
  }
}

// COURSES PAGE FUNCTIONS
// ======================

function initCoursesPage() {
  console.log("📚 Initializing courses page")

  // Check if user is authenticated, redirect if not
  const savedAccount = localStorage.getItem("connectedAccount")
  if (!savedAccount) {
    alert("Please connect your wallet first!")
    window.location.href = "index.html"
    return
  }

  // Display current user
  if (elements.currentUser) {
    elements.currentUser.textContent = `Connected: ${savedAccount.substring(0, 6)}...${savedAccount.substring(38)}`
  }

  // Add event listeners for courses page
  if (elements.logoutBtn) {
    elements.logoutBtn.addEventListener("click", logout)
  }

  if (elements.uploadBtn) {
    elements.uploadBtn.addEventListener("click", handleCourseUpload)
  }

  // Load and display existing courses
  loadCourses()
}

// METAMASK WALLET FUNCTIONS
// =========================

async function connectWallet() {
  console.log("🦊 Attempting to connect MetaMask wallet...")

  // Check if MetaMask is installed
  if (typeof window.ethereum === "undefined") {
    updateConnectionStatus("MetaMask is not installed! Please install MetaMask extension.", "error")
    return
  }

  try {
    updateConnectionStatus("Connecting to MetaMask...", "loading")

    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })

    if (accounts.length > 0) {
      currentAccount = accounts[0]

      // Save to localStorage for persistence
      localStorage.setItem("connectedAccount", currentAccount)

      console.log("✅ Wallet connected:", currentAccount)
      updateConnectionStatus("Wallet connected successfully!", "connected")
      showUserInfo()
    } else {
      throw new Error("No accounts returned from MetaMask")
    }
  } catch (error) {
    console.error("❌ Error connecting wallet:", error)

    if (error.code === 4001) {
      updateConnectionStatus("Connection rejected by user", "error")
    } else {
      updateConnectionStatus("Failed to connect wallet: " + error.message, "error")
    }
  }
}

async function checkExistingConnection() {
  console.log("🔍 Checking for existing wallet connection...")

  const savedAccount = localStorage.getItem("connectedAccount")

  if (savedAccount && typeof window.ethereum !== "undefined") {
    try {
      // Verify the account is still connected in MetaMask
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      })

      if (accounts.includes(savedAccount)) {
        currentAccount = savedAccount
        console.log("✅ Restored wallet connection:", currentAccount)

        if (elements.connectionStatus) {
          updateConnectionStatus("Wallet already connected!", "connected")
          showUserInfo()
        }
      } else {
        // Account no longer connected, clear localStorage
        localStorage.removeItem("connectedAccount")
      }
    } catch (error) {
      console.error("❌ Error checking existing connection:", error)
      localStorage.removeItem("connectedAccount")
    }
  }
}

function disconnectWallet() {
  console.log("🔌 Disconnecting wallet...")

  // Clear application state
  currentAccount = null
  localStorage.removeItem("connectedAccount")

  // Update UI
  updateConnectionStatus("Wallet disconnected", "error")
  hideUserInfo()

  console.log("✅ Wallet disconnected")
}

function logout() {
  console.log("👋 User logging out...")
  disconnectWallet()
  window.location.href = "index.html"
}

// UI UPDATE FUNCTIONS
// ===================

function updateConnectionStatus(message, type = "default") {
  if (!elements.connectionStatus) return

  elements.connectionStatus.innerHTML = `<p>${message}</p>`

  // Remove existing status classes
  elements.connectionStatus.classList.remove("connected", "error", "loading")

  // Add appropriate class based on type
  if (type !== "default") {
    elements.connectionStatus.classList.add(type)
  }
}

function showUserInfo() {
  if (!elements.userInfo || !elements.walletAddress) return

  // Display shortened wallet address
  const shortAddress = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`
  elements.walletAddress.textContent = shortAddress

  // Show user info section, hide connect button
  elements.userInfo.style.display = "block"
  if (elements.connectBtn) {
    elements.connectBtn.style.display = "none"
  }
}

function hideUserInfo() {
  if (!elements.userInfo) return

  // Hide user info section, show connect button
  elements.userInfo.style.display = "none"
  if (elements.connectBtn) {
    elements.connectBtn.style.display = "inline-block"
  }
}

// COURSE MANAGEMENT FUNCTIONS
// ===========================

async function handleCourseUpload() {
  console.log("📤 Starting course upload process...")

  // Get form values
  const title = elements.courseTitleInput?.value.trim()
  const fileInput = elements.courseFileInput
  const file = fileInput?.files[0]

  // Validate inputs
  if (!title) {
    showUploadStatus("Please enter a course title", "error")
    return
  }

  if (!file) {
    showUploadStatus("Please select a file to upload", "error")
    return
  }

  // Check file size (limit to 100MB for demo)
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    showUploadStatus("File too large. Maximum size is 100MB", "error")
    return
  }

  try {
    // Disable upload button during upload
    elements.uploadBtn.disabled = true
    elements.uploadBtn.textContent = "⏳ Uploading..."

    showUploadStatus("Uploading to Lighthouse/IPFS...", "loading")

    // Upload file using Lighthouse SDK (imported from lighthouse.js)
    const cid = await window.lighthouseUpload(file)

    if (!cid) {
      throw new Error("Failed to get CID from Lighthouse")
    }

    // Create course object
    const course = {
      id: Date.now().toString(), // Simple ID generation
      title: title,
      cid: cid,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentAccount,
    }

    // Save course to localStorage
    saveCourse(course)

    console.log("✅ Course uploaded successfully:", course)
    showUploadStatus(`Course uploaded successfully! CID: ${cid}`, "success")

    // Clear form
    elements.courseTitleInput.value = ""
    elements.courseFileInput.value = ""

    // Reload courses list
    loadCourses()
  } catch (error) {
    console.error("❌ Error uploading course:", error)
    showUploadStatus("Upload failed: " + error.message, "error")
  } finally {
    // Re-enable upload button
    elements.uploadBtn.disabled = false
    elements.uploadBtn.textContent = "🚀 Upload to Blockchain"
  }
}

function saveCourse(course) {
  console.log("💾 Saving course to localStorage:", course)

  // Get existing courses from localStorage
  const existingCourses = JSON.parse(localStorage.getItem("courses") || "[]")

  // Add new course
  existingCourses.push(course)

  // Save back to localStorage
  localStorage.setItem("courses", JSON.stringify(existingCourses))
}

function loadCourses() {
  console.log("📚 Loading courses from localStorage...")

  if (!elements.coursesContainer) return

  // Get courses from localStorage
  const courses = JSON.parse(localStorage.getItem("courses") || "[]")

  if (courses.length === 0) {
    elements.coursesContainer.innerHTML = `
            <div class="no-courses-message">
                <p>No courses uploaded yet. Upload your first course above! 🎓</p>
            </div>
        `
    return
  }

  // Generate HTML for each course
  const coursesHTML = courses
    .map(
      (course) => `
        <div class="course-card">
            <h3>${escapeHtml(course.title)}</h3>
            <p><strong>File:</strong> ${escapeHtml(course.fileName)}</p>
            <p><strong>Size:</strong> ${formatFileSize(course.fileSize)}</p>
            <p><strong>Uploaded:</strong> ${formatDate(course.uploadedAt)}</p>
            <div class="cid">
                <strong>CID:</strong> ${course.cid}
            </div>
            <a href="https://gateway.lighthouse.storage/ipfs/${course.cid}" 
               target="_blank" 
               class="primary-btn">
                🔗 View Course
            </a>
        </div>
    `,
    )
    .join("")

  elements.coursesContainer.innerHTML = coursesHTML
  console.log(`✅ Loaded ${courses.length} courses`)
}

function showUploadStatus(message, type = "default") {
  if (!elements.uploadStatus) return

  elements.uploadStatus.textContent = message

  // Remove existing status classes
  elements.uploadStatus.classList.remove("success", "error", "loading")

  // Add appropriate class
  if (type !== "default") {
    elements.uploadStatus.classList.add(type)
  }

  // Auto-hide success messages after 5 seconds
  if (type === "success") {
    setTimeout(() => {
      elements.uploadStatus.textContent = ""
      elements.uploadStatus.classList.remove("success")
    }, 5000)
  }
}

// UTILITY FUNCTIONS
// =================

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString() + " " + date.toLocaleTimeString()
}

// METAMASK EVENT LISTENERS
// ========================

// Listen for account changes
if (typeof window.ethereum !== "undefined") {
  window.ethereum.on("accountsChanged", (accounts) => {
    console.log("🔄 MetaMask accounts changed:", accounts)

    if (accounts.length === 0) {
      // User disconnected all accounts
      disconnectWallet()
    } else if (accounts[0] !== currentAccount) {
      // User switched accounts
      currentAccount = accounts[0]
      localStorage.setItem("connectedAccount", currentAccount)

      // Update UI if on courses page
      if (elements.currentUser) {
        elements.currentUser.textContent = `Connected: ${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`
      }

      // Update wallet address display if on index page
      if (elements.walletAddress) {
        const shortAddress = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`
        elements.walletAddress.textContent = shortAddress
      }
    }
  })

  // Listen for chain changes
  window.ethereum.on("chainChanged", (chainId) => {
    console.log("🔗 MetaMask chain changed:", chainId)
    // For this MVP, we don't need to handle chain changes specifically
    // but in production you might want to ensure users are on the right network
  })
}

console.log("✅ BLOCKEDLEARNING script loaded successfully")
