# 🎓 BLOCKEDLEARNING

A minimal but fully functional blockchain learning platform built with vanilla JavaScript, MetaMask authentication, and Lighthouse SDK for decentralized file storage on IPFS/Filecoin.

## 🚀 Features

- **MetaMask Authentication**: Secure wallet-based login
- **Decentralized Storage**: Files stored permanently on Filecoin via Lighthouse SDK
- **Course Management**: Upload and view courses with IPFS links
- **Responsive Design**: Works on desktop and mobile devices
- **No Backend Required**: Fully client-side application

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: MetaMask (Ethereum wallet)
- **Storage**: Lighthouse SDK → IPFS → Filecoin
- **Deployment**: Vercel (static hosting)

## 📁 Project Structure

\`\`\`
blockedlearning-mvp/
├── index.html          # Landing page with MetaMask login
├── courses.html        # Course upload and listing page
├── style.css          # Responsive styling for all pages
├── script.js          # MetaMask auth and navigation logic
├── lighthouse.js      # Lighthouse SDK integration
├── package.json       # Dependencies (Lighthouse SDK)
├── vercel.json        # Vercel deployment configuration
└── README.md          # This file
\`\`\`

## 🚀 Quick Start

### Prerequisites

- Node.js (for npm install)
- MetaMask browser extension
- Modern web browser

### Installation

1. **Clone or download** this project
2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
3. **Run locally**:
   \`\`\`bash
   npm run dev
   \`\`\`
4. **Open** http://localhost:3000 in your browser

### Deployment to Vercel

1. **Push to GitHub** (or use Vercel CLI)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy automatically
3. **No additional configuration needed** - the \`vercel.json\` handles everything!

## 📖 How to Use

### 1. Connect Your Wallet
- Visit the landing page
- Click "Connect MetaMask Wallet"
- Approve the connection in MetaMask
- You'll see your wallet address displayed

### 2. Upload a Course
- Click "Access Courses" to go to the courses page
- Enter a course title
- Select a file (PDF, MP4, ZIP, TXT, DOCX supported)
- Click "Upload to Blockchain"
- Wait for the upload to complete

### 3. View Courses
- All uploaded courses appear below the upload form
- Click "View Course" to access files via IPFS
- Files are permanently stored and accessible worldwide

## 🔧 Configuration

### Lighthouse API Key
The app uses the provided API key: \`0bf84ba6.33150e5a967542729efc654c351493f5\`

To use your own API key:
1. Get an API key from [Lighthouse](https://lighthouse.storage)
2. Replace the key in \`lighthouse.js\`:
   \`\`\`javascript
   const LIGHTHOUSE_API_KEY = 'your-api-key-here';
   \`\`\`

### Supported File Types
- **Documents**: PDF, TXT, DOCX
- **Videos**: MP4
- **Archives**: ZIP
- **Maximum size**: 100MB per file

## 🏗️ Architecture

### Client-Side Only
- No backend server required
- All data stored in browser localStorage
- Files stored on decentralized IPFS/Filecoin network

### MetaMask Integration
- Wallet connection for authentication
- Account switching detection
- Connection persistence across sessions

### Lighthouse SDK
- Direct uploads to IPFS
- Automatic Filecoin storage
- Global IPFS gateway access

## 🔒 Security Notes

- **Private Keys**: Never stored or transmitted
- **File Privacy**: All uploads are public on IPFS
- **Authentication**: Wallet-based, no passwords
- **Data Persistence**: localStorage for course metadata

## 🐛 Troubleshooting

### MetaMask Issues
- **Not Detected**: Install MetaMask browser extension
- **Connection Failed**: Refresh page and try again
- **Wrong Network**: Any Ethereum network works for authentication

### Upload Issues
- **File Too Large**: Maximum 100MB per file
- **Upload Failed**: Check internet connection
- **Invalid API Key**: Verify Lighthouse API key

### Deployment Issues
- **Build Errors**: Run \`npm install\` first
- **404 Errors**: Check \`vercel.json\` configuration
- **Module Errors**: Ensure all files are included

## 🚀 Future Enhancements

- **Payment Integration**: Paid courses with crypto payments
- **Course Categories**: Organize courses by topic
- **User Profiles**: Enhanced user management
- **Course Reviews**: Rating and review system
- **Video Streaming**: Direct video playback
- **Mobile App**: React Native version

## 📄 License

MIT License - feel free to use this code for your own projects!

## 🤝 Contributing

This is a hackathon MVP, but contributions are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or questions:
- Check the browser console for error messages
- Ensure MetaMask is installed and connected
- Verify internet connection for IPFS uploads

---

**Built with ❤️ for the blockchain learning community**
