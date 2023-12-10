const stats = document.querySelector('.stats');
const clear = document.querySelector('.clear');
const video = document.querySelector('video');  

const WindowDetails = {
  screenX: 0,
  screenY: 0,
  screenWidth: 0,
  screenHeight: 0,
  width: 0,
  height: 0,
  updated: 0,
};

function getScreens() {
  return Object.entries(window.localStorage)
    .filter(([key]) => key.startsWith('screen-'))
    .map(([key, value]) => [key, JSON.parse(value)]);  
}

function getScreenId() {
  const existingScreens = Object.keys(window.localStorage)
    .filter(key => key.startsWith('screen-'))
    .map(key => parseInt(key.replace('screen-', '')))
    .sort((a, b) => {a - b});
  
  return existingScreens.at(-1) + 1 || 1;
}

const screenId = `screen-${getScreenId()}`;

function setScreenDetails() {
  const WindowDetails = {
    screenX: window.screenX,
    screenY: window.screenY,
    screenWidth: window.screen.availWidth,
    screenHeight:window.screen.availHeight,
    width: window.outerWidth,
    height: window.outerHeight,
    updated: Date.now(),
  }
  window.localStorage.setItem(screenId, JSON.stringify(WindowDetails));
}

function displayStats() {
  if(!stats) return;
  const existingScreens = Object.fromEntries(getScreens());
  stats.innterHTML = JSON.stringify(existingScreens, null, ' ');
} 

function restart() {
  timers.forEach((timer) => window.clearInterval(timer));
  window.localStorage.clear();
  setTimeout(() => window.location.reload(), Math.random() * 1000);
}

function removeScreen() {
  console.log(`removing screen ${screenId}`);
  localStorage.removeItem(screenId);
}

function removeOld() {
  const screens = getScreens();

  for (const [key, screen] of screens) {
    if (Date.now() - screen.updated > 1000) {
      localStorage.removeItem(key);
    }
  }
}
  
function makeSVG() {
    video.setAttribute('style', `transform: translate(-${window.screenX}px, -${window.screenY}px)`);
}

const timers = [];

function go() {
  timers.push(setInterval(setScreenDetails, 10));
  timers.push(setInterval(displayStats, 10));
  timers.push(setInterval(removeOld, 100));
  timers.push(setInterval(makeSVG, 10));
}

clear.addEventListener('click', restart);

window.addEventListener('beforeunload', removeScreen);

function populateWebcam() {
  navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    if (!video) return;

    video.width = window.screen.availWidth;
    video.height = window.screen.availHeight;
    video.srcObject = stream;

    video.play();
  });
}

go();
populateWebcam();