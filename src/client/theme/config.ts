import inputCardBackground from '../assets/input-card.png'
import sideBarBackground from '../assets/sidebar.jpg'
import middleAreaVideo from '../assets/wallpaper.mp4'
import brandLogo from '../assets/brand-logo.png'
import collapseIcon from '../assets/collapse.png'
import searchIcon from '../assets/search.png'
import newSessionIcon from '../assets/new-session.png'
import addWorkspaceIcon from '../assets/add-workspace.png'
import settingsIcon from '../assets/settings-16@2x.png'
import settingsRailIcon from '../assets/settings-18@2x.png'
import filterIcon from '../assets/filter.png'

export const themeConfig = {
  hero: {
    titleLogo: {
      source: brandLogo,
      width: '303px',
      height: '40px',
    },
  },
  middleArea: {
    background: 'transparent',
    'background-position': 'center',
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    video: {
      source: middleAreaVideo,
      opacity: '1',
      'object-fit': 'cover',
      'object-position': 'center',
    },
  },
  chatArea: {
    background: 'rgba(255, 255, 255, 0.15)',
  },
  inputArea: {
    background: 'transparent',
  },
  inputCard: {
    background: `url("${inputCardBackground}")`,
    'background-position': 'center',
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    opacity: '1',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    blur: '20px',
    hero: {
      background: 'rgba(255, 255, 255, 0.08)',
      opacity: '1',
      blur: '0px',
    },
  },
  sideBar: {
    root: {
      background: `url("${sideBarBackground}")`,
      'background-position': 'center',
      'background-repeat': 'no-repeat',
      'background-size': 'cover',
      '--dsw-specific-sidebar-fill': 'transparent',
    },
    header: {
      background: 'transparent',
    },
    newSession: {
      background: `url("${newSessionIcon}")`,
      'background-position': 'center',
      'background-repeat': 'no-repeat',
      'background-size': '100% 100%',
    },
    workspace: {
      background: 'transparent',
    },
    footer: {
      background: 'transparent',
    },
    icons: {
      brand: {
        source: brandLogo,
        width: '182px',
        height: '24px',
      },
      newSession: {
        source: '',
        width: '0px',
        height: '0px',
      },
      collapse: {
        source: collapseIcon,
        width: '16px',
        height: '16px',
        railWidth: '18px',
        railHeight: '18px',
      },
      search: {
        source: searchIcon,
        width: '14px',
        height: '14px',
        railWidth: '18px',
        railHeight: '18px',
      },
      filter: {
        source: filterIcon,
        width: '16px',
        height: '16px',
        railWidth: '18px',
        railHeight: '18px',
      },
      addWorkspace: {
        source: addWorkspaceIcon,
        width: '16px',
        height: '16px',
        railWidth: '18px',
        railHeight: '18px',
      },
      settings: {
        source: settingsIcon,
        railSource: settingsRailIcon,
        width: '16px',
        height: '16px',
        railWidth: '18px',
        railHeight: '18px',
      },
    },
  },
} as const

