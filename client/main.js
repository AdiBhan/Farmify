const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const chokidar = require('chokidar');

const env = process.env.NODE_ENV || 'development';



// Watch only the 'src/dist' folder for changes
const watcher = chokidar.watch(path.resolve(__dirname, 'src/'), {
  persistent: true
});

watcher.on('ready', () => console.log('Chokidar is watching src/dist/index.js for file changes...'))
       .on('change', (filePath) => {
           console.log(`File changed: ${filePath}`);
           console.log('Running yarn build...');

           // Execute yarn build if needed
           exec('yarn build', (err, stdout, stderr) => {
             if (err) {
               console.error(`Error during build: ${stderr}`);
               return;
             }
             console.log('Build complete!');
             console.log(stdout);
           });
       });


// Electron reload only in development
if (env === 'development') {
  try {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: true,
      forceHardReset: true, // Ensures a full reload when changes are detected
      ignore: ['dist/**/*.js.map'], // Ignore sourcemap files if generated
    });
  } catch (err) {
    console.log('Error setting up electron-reloader:', err);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  win.loadFile('dist/index.html'); // Load bundled React app
}

app.whenReady().then(createWindow);
