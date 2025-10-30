# 🎥 Multi-Stream Viewer

A modern web application that allows you to view multiple live streaming screens simultaneously in a single webpage. Built with Node.js, Express, and vanilla JavaScript.

![Multi-Stream Viewer](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)

## ✨ Features

- 📺 **Multiple Stream Display**: View up to 9 streams simultaneously
- 🎛️ **Flexible Grid Layouts**: 2x2, 2x3, 3x3, 1x6, and 6x1 configurations
- ➕ **Dynamic Stream Management**: Add/remove streams on the fly
- 🔄 **Auto-Refresh**: Keep your streams up to date
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- ⌨️ **Keyboard Shortcuts**: Quick actions with A (Add), R (Refresh), Esc (Close)
- 🎯 **Smart URL Processing**: Automatic YouTube/Twitch URL conversion
- 🌐 **Cross-Browser Compatible**: Works on Chrome, Firefox, Safari, and Edge

## 🚀 Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Open your browser and go to `http://localhost:3000`

## Development

For development with auto-restart:

```bash
npm run dev
```

## API Endpoints

- `GET /api/streams` - Get all streaming links
- `POST /api/streams` - Add a new stream
- `DELETE /api/streams/:id` - Remove a stream

### Add Stream Example

```javascript
POST /api/streams
{
  "title": "My Stream",
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "type": "youtube"
}
```

## Supported Streaming Platforms

- **YouTube**: Automatically converts watch URLs to embed format
- **Twitch**: Converts channel URLs to player embed format
- **Custom**: Any iframe-compatible streaming URL

## Layout Options

- 2x2 Grid (4 streams)
- 2x3 Grid (6 streams) - Default
- 3x3 Grid (9 streams)
- 1x6 Row (6 streams in a row)
- 6x1 Column (6 streams in a column)

## Customization

You can modify the `streamingLinks` array in `server.js` to set your default streams. The application also supports adding streams dynamically through the web interface.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: CSS Grid, Flexbox, Gradients
- **Features**: Responsive design, Modal dialogs, RESTful API

## 📱 Screenshots

### Desktop View
![Desktop Layout](https://via.placeholder.com/800x600/1e3c72/ffffff?text=Multi-Stream+Viewer+Desktop)

### Mobile View
![Mobile Layout](https://via.placeholder.com/400x600/2a5298/ffffff?text=Multi-Stream+Viewer+Mobile)

## 🌐 Browser Compatibility

✅ **Fully Supported:**
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons and emojis used in the interface
- YouTube and Twitch for their embed APIs
- The open-source community for inspiration

## 📧 Contact

If you have any questions or suggestions, feel free to reach out!

---

⭐ **Star this repository if you found it helpful!**

## Contributing

Feel free to submit issues and enhancement requests!
