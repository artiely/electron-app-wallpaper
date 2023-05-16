import { BrowserWindow, Menu, screen, globalShortcut } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const preloadJs = join(__dirname, '../preload/index.js')
console.log({ preloadJs, icon })
export default function (options) {
  Menu.setApplicationMenu(null)
  let width = options.width || 600
  let height = options.height || 800
  let type = options.type || 'normal'

  const _finalOptions = {
    type: type,
    title: options.title || 'ola-小助手',
    autoHideMenuBar: true,
    frame: options.frame || true,
    show: options.show || false,
    ...(process.platform === 'linux' ? { icon } : { icon }),
    alwaysOnTop: options.alwaysOnTop || false,
    webPreferences: {
      preload: preloadJs,
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      devTools: true,
      webSecurity: false,
      ...options.webPreferences
    },
    ...options,
    width: width,
    height: height
  }
  console.log('createWindow', options.x)
  console.log('createWindow', options, _finalOptions)
  // 打开一个新的浏览器窗口
  const win = new BrowserWindow(_finalOptions)
  // 判断是否是开发环境
  if (is.dev) {
    // win.webContents.openDevTools()
  }
  // 添加右键菜单
  win.webContents.on('context-menu', (_e, params) => {
    const { x, y } = params
    const rightMenu = [
      {
        label: '刷新',
        click: () => {
          win.webContents.reload()
        }
      },
      // 关闭当前窗口
      {
        label: '关闭',
        click: () => {
          // 告诉所有窗口当前窗口已经关闭
          console.log('close', options.hash)
          BrowserWindow.getAllWindows().forEach((w) => {
            console.log('close', w.webContents.id, options.hash)
            w.webContents.send('window-close', options.hash)
          })
          win.close()
        }
      },

      {
        label: '调试',
        click: () => {
          win.webContents.inspectElement(x, y)
        }
      }
    ]
    if (options.hash && options.hash.startsWith('iframe')) {
      rightMenu.push({
        label: '刷新子页面',
        click: () => {
          win.webContents.send('refresh-iframe')
        }
      })
      rightMenu.push({
        label: '置顶',
        click: () => {
          win.setAlwaysOnTop(!win.isAlwaysOnTop())
        }
      })
      rightMenu.push({
        label: '开关静音',
        click: () => {
          // 检查窗口是否被静音
          const isMuted = win.webContents.isAudioMuted()
          console.log('isMuted', isMuted)
          if (isMuted) {
            // 取消静音
            win.webContents.setAudioMuted(false)
          } else {
            win.webContents.setAudioMuted(true)
          }
        }
      })
    }

    Menu.buildFromTemplate(rightMenu).popup({ window: win })
  })

  win.on('ready-to-show', () => {
    win.show()
  })
  const html = options.html || 'index.html'
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'] + `/${html}#${options.hash}`)
  } else {
    win.loadFile(join(__dirname, `../renderer/${html}`), options)
  }

  win.on('resize', () => {
    if (options.aspectRatio) {
      let [width, height] = win.getSize()
      console.log('resize', width, height, options.width / options.height)
      let ar = options.aspectRatio === true ? width / height : options.aspectRatio
      win.setAspectRatio(ar)
    }
  })

  return win
}
