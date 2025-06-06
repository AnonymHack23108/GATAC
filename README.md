# GATAC Streaming

This repository contains a simple web application that streams video files stored on your NAS or local directory. The server is built with Node.js and exposes an interface with profile selection, search, and in-browser playback.

## Setup

1. Install Node.js dependencies (internet access is required for the first install):

   ```bash
   npm install
   ```

2. Place your media files under the `media` directory, or define the `MEDIA_DIR` environment variable to point to another location (such as your NAS mount point).

3. Start the server:

   ```bash
   npm start
   ```

4. Open `http://<machine-ip>:3000` from any device on your local network to access the streaming interface. You will be prompted to choose a profile before browsing your media library. Use the search bar to quickly find movies or series and click a title to play it directly in the browser.
