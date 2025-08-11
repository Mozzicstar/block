// BLOCKEDLEARNING - Lighthouse SDK Integration
// Handles file uploads to IPFS/Filecoin via Lighthouse

// Import Lighthouse SDK
import lighthouse from "@lighthouse-web3/sdk"

import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Get Lighthouse API key from environment
const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY

if (!LIGHTHOUSE_API_KEY) {
  throw new Error("LIGHTHOUSE_API_KEY is required in environment variables")
}


console.log("🏮 Lighthouse SDK integration loaded")

/**
 * Upload a file to Lighthouse/IPFS/Filecoin
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - The IPFS CID of the uploaded file
 */
async function uploadToLighthouse(file) {
  console.log("🚀 Starting Lighthouse upload for file:", file.name)

  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided for upload")
    }

    console.log("📁 File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // Upload file to Lighthouse
    console.log("⏳ Uploading to Lighthouse...")
    const output = await lighthouse.upload([file], LIGHTHOUSE_API_KEY)

    console.log("📤 Lighthouse upload response:", output)

    // Extract CID from response
    if (output && output.data && output.data.Hash) {
      const cid = output.data.Hash
      console.log("✅ File uploaded successfully! CID:", cid)
      console.log("🔗 IPFS URL:", `https://gateway.lighthouse.storage/ipfs/${cid}`)
      return cid
    } else {
      throw new Error("Invalid response from Lighthouse - no CID received")
    }
  } catch (error) {
    console.error("❌ Lighthouse upload failed:", error)

    // Provide more specific error messages
    if (error.message.includes("API key")) {
      throw new Error("Invalid Lighthouse API key. Please check your configuration.")
    } else if (error.message.includes("network")) {
      throw new Error("Network error. Please check your internet connection and try again.")
    } else if (error.message.includes("file size")) {
      throw new Error("File too large for upload. Please try a smaller file.")
    } else {
      throw new Error(`Upload failed: ${error.message}`)
    }
  }
}

/**
 * Get file info from Lighthouse by CID
 * @param {string} cid - The IPFS CID
 * @returns {Promise<Object>} - File information
 */
async function getFileInfo(cid) {
  console.log("📋 Getting file info for CID:", cid)

  try {
    // For this MVP, we'll return basic info
    // In production, you might want to use Lighthouse's file info APIs
    return {
      cid: cid,
      url: `https://gateway.lighthouse.storage/ipfs/${cid}`,
      gateway: "lighthouse",
    }
  } catch (error) {
    console.error("❌ Error getting file info:", error)
    throw new Error(`Failed to get file info: ${error.message}`)
  }
}

/**
 * Check if a file exists on IPFS by CID
 * @param {string} cid - The IPFS CID to check
 * @returns {Promise<boolean>} - Whether the file exists
 */
async function checkFileExists(cid) {
  console.log("🔍 Checking if file exists for CID:", cid)

  try {
    const url = `https://gateway.lighthouse.storage/ipfs/${cid}`
    const response = await fetch(url, { method: "HEAD" })

    const exists = response.ok
    console.log(`${exists ? "✅" : "❌"} File ${exists ? "exists" : "not found"} for CID:`, cid)

    return exists
  } catch (error) {
    console.error("❌ Error checking file existence:", error)
    return false
  }
}

/**
 * Get upload status and statistics
 * @returns {Promise<Object>} - Upload statistics
 */
async function getUploadStats() {
  try {
    // For this MVP, we'll return basic stats from localStorage
    const courses = JSON.parse(localStorage.getItem("courses") || "[]")

    const stats = {
      totalUploads: courses.length,
      totalSize: courses.reduce((sum, course) => sum + (course.fileSize || 0), 0),
      lastUpload: courses.length > 0 ? courses[courses.length - 1].uploadedAt : null,
    }

    console.log("📊 Upload stats:", stats)
    return stats
  } catch (error) {
    console.error("❌ Error getting upload stats:", error)
    return {
      totalUploads: 0,
      totalSize: 0,
      lastUpload: null,
    }
  }
}

// Make functions available globally for use in script.js
window.lighthouseUpload = uploadToLighthouse
window.lighthouseGetFileInfo = getFileInfo
window.lighthouseCheckFileExists = checkFileExists
window.lighthouseGetUploadStats = getUploadStats

console.log("✅ Lighthouse functions exposed globally")

// Export functions for module usage
export { uploadToLighthouse, getFileInfo, checkFileExists, getUploadStats }
