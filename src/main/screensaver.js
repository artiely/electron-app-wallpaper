import createWindow from './createWindow'
import { screen, globalShortcut } from 'electron'
export default () => {
  // const { width: w, height: h } = screen.getPrimaryDisplay().workAreaSize
  // console.log(screen.getAllDisplays())
  // const { width: w, height: h } = screen.getPrimaryDisplay().bounds
  // let win2
  let windowsDesktop = []
  let windowsScreensaver = []
  const createDesktop = (display) => {
    let win = createWindow({
      type: 'desktop',
      title: 'ola-screensaver',
      autoHideMenuBar: true,
      frame: false,
      show: false,
      alwaysOnTop: false,
      window: true,
      hash: 'screensaver',
      x: display.bounds.x,
      y: display.bounds.y,
      width: display.bounds.width,
      height: display.bounds.height + 100,
      transparent: true,
      hideNav: true,
      thickFrame: false,
      titleBarStyle: 'hidden',
      hasShadow: false,
      backgroundColor: '#000000',
      enableLargerThanScreen: true,
      simpleFullscreen: true,
      fullscreen: true
      // roundedCorners: false
    })
    windowsDesktop.push(win)
  }
  const createScreensaver = (display) => {
    let win2 = createWindow({
      type: 'panel',
      alwaysOnTop: 'screen-saver',
      title: 'ola-screensaver',
      autoHideMenuBar: true,
      frame: false,
      show: false,
      window: true,
      hash: 'screensaver',
      x: display.bounds.x,
      y: display.bounds.y,
      width: display.bounds.width,
      height: display.bounds.height + 100,
      transparent: true,
      hideNav: true,
      thickFrame: false,
      titleBarStyle: 'hidden',
      hasShadow: false,
      backgroundColor: '#000000',
      enableLargerThanScreen: true,
      simpleFullscreen: true,
      fullscreen: true
    })
    windowsScreensaver.push(win2)
  }
  globalShortcut.register('ctrl+l', handle)
  handle(true)
  function handle(flag) {
    let displays = screen.getAllDisplays()
    if (windowsDesktop.length == 0) {
      for (let display of displays) {
        createDesktop(display)
      }
    }
    if (!flag) {
      if (windowsScreensaver.length == 0) {
        for (let display of displays) {
          createScreensaver(display)
        }
      } else {
        for (let win of windowsScreensaver) {
          if (win.isVisible()) {
            win.hide()
          } else {
            win.show()
          }
        }
      }
    }

    globalShortcut.register('esc', () => {
      for (let win of windowsScreensaver) {
        if (win.isVisible()) {
          win.hide()
        } else {
          win.show()
        }
      }
    })
  }
}

setInterval(() => {
  let point = screen.getCursorScreenPoint()
}, 1000)
