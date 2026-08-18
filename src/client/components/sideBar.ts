import {
  applyInlineStyles,
  type Dispose,
  replaceSvgWithImage,
  waitForElement,
} from '../dom'
import { themeConfig } from '../theme/config'

type IconConfig = Readonly<{ source: string; width: string; height: string }>
type ResponsiveIconConfig = IconConfig & Readonly<{
  railSource?: string
  railWidth: string
  railHeight: string
}>

const PANEL_ICON_PATH = 'M9.67272 0.522841'
const SEARCH_ICON_PATH = 'M11.894845 6.647401'
const FILTER_ICON_PATH = 'M10.3232 9.18164'
const ADD_WORKSPACE_ICON_PATH = 'M3.55246 0L3.55246 2.44252'
const SETTINGS_ICON_PATH_16 = 'M14.0861 5.51366'
const SETTINGS_ICON_PATH_14 = 'M12.1192 4.91016'

function findBrandButton(header: HTMLElement, newSession: HTMLElement | null): HTMLElement | null {
  const label = newSession?.getAttribute('aria-label')
  if (label === null || label === undefined) return null

  return Array.from(header.querySelectorAll<HTMLElement>(':scope > button'))
    .find(button => button.getAttribute('aria-label') === label) ?? null
}

function applyIcon(
  container: HTMLElement | null,
  config: IconConfig,
  role: string,
  cleanups: Dispose[],
): void {
  if (container === null || config.source === '') return
  if (container.querySelector(`:scope > img[data-luvian-icon="${role}"]`) !== null) return

  const svg = container.querySelector<SVGElement>(':scope > svg')
  if (svg === null) return
  cleanups.push(replaceSvgWithImage(svg, config.source, config, role))
}

function findButtonByIconPath(root: HTMLElement, pathStart: string): HTMLElement | null {
  const path = Array.from(root.querySelectorAll<SVGPathElement>('svg path[d]'))
    .find(candidate => candidate.getAttribute('d')?.startsWith(pathStart) === true)
  return path?.closest<HTMLElement>('button') ?? null
}

function applyResponsiveButtonIcon(
  button: HTMLElement | null,
  config: ResponsiveIconConfig,
  role: string,
  cleanups: Dispose[],
  isRail: (button: HTMLElement) => boolean = candidate => candidate.getBoundingClientRect().width >= 34,
): void {
  if (button === null || config.source === '') return
  if (button.querySelector(`:scope > img[data-luvian-icon="${role}"]`) !== null) return

  const previousDisplays = new Map<SVGElement, string>()
  const image = document.createElement('img')
  image.src = config.source
  image.alt = ''
  image.draggable = false
  image.dataset.luvianIcon = role
  image.setAttribute('aria-hidden', 'true')
  image.style.objectFit = 'contain'
  image.style.flex = 'none'

  const syncOriginals = (): void => {
    for (const svg of button.querySelectorAll<SVGElement>(':scope > svg')) {
      if (!previousDisplays.has(svg)) previousDisplays.set(svg, svg.style.display)
      svg.style.display = 'none'
    }
  }
  const syncSize = (): void => {
    const rail = isRail(button)
    image.src = rail && config.railSource !== undefined ? config.railSource : config.source
    image.style.width = rail ? config.railWidth : config.width
    image.style.height = rail ? config.railHeight : config.height
  }

  syncOriginals()
  const insertionPoint = Array.from(button.children)
    .find(child => child.tagName.toLowerCase() !== 'svg')
  button.insertBefore(image, insertionPoint ?? null)
  syncSize()

  const mutationObserver = new MutationObserver(() => {
    syncOriginals()
    syncSize()
  })
  mutationObserver.observe(button, { childList: true })
  const resizeObserver = new ResizeObserver(syncSize)
  resizeObserver.observe(button)

  cleanups.push(() => {
    mutationObserver.disconnect()
    resizeObserver.disconnect()
    image.remove()
    for (const [svg, display] of previousDisplays) svg.style.display = display
  })
}

function hideButtonSvgs(
  button: HTMLElement | null,
  role: string,
  cleanups: Dispose[],
): void {
  if (button === null || button.dataset.luvianHiddenIcon === role) return

  button.dataset.luvianHiddenIcon = role
  const previousDisplays = new Map<SVGElement, string>()
  const sync = (): void => {
    for (const svg of button.querySelectorAll<SVGElement>(':scope > svg')) {
      if (!previousDisplays.has(svg)) previousDisplays.set(svg, svg.style.display)
      svg.style.display = 'none'
    }
  }

  sync()
  const observer = new MutationObserver(sync)
  observer.observe(button, { childList: true })
  cleanups.push(() => {
    observer.disconnect()
    delete button.dataset.luvianHiddenIcon
    for (const [svg, display] of previousDisplays) svg.style.display = display
  })
}

/** Applies one sidebar background and optional custom button icons. */
export function applySideBar(): Dispose {
  return waitForElement<HTMLElement>('[data-slot="sidebar"]', (sidebarSlot) => {
    const root = sidebarSlot.firstElementChild as HTMLElement | null
    if (root === null) return

    const header = root.firstElementChild as HTMLElement | null
    const newSession = root.querySelector<HTMLElement>(':scope > button')
    const workspaceSlot = root.querySelector<HTMLElement>('[data-slot="sidebar.workspaces"]')
    const workspace = workspaceSlot?.parentElement ?? null
    const footer = root.lastElementChild as HTMLElement | null

    const cleanups: Dispose[] = []
    cleanups.push(applyInlineStyles(root, themeConfig.sideBar.root))
    if (header !== null) cleanups.push(applyInlineStyles(header, themeConfig.sideBar.header))
    if (newSession !== null) cleanups.push(applyInlineStyles(newSession, themeConfig.sideBar.newSession))
    if (workspace !== null) cleanups.push(applyInlineStyles(workspace, themeConfig.sideBar.workspace))
    if (footer !== null) cleanups.push(applyInlineStyles(footer, themeConfig.sideBar.footer))

    const iconCleanups: Dispose[] = []
    const syncIcons = (): void => {
      const liveNewSession = root.querySelector<HTMLElement>(':scope > button')
      const liveHeader = root.firstElementChild as HTMLElement | null
      const brand = liveHeader === null ? null : findBrandButton(liveHeader, liveNewSession)
      applyIcon(brand, themeConfig.sideBar.icons.brand, 'brand', iconCleanups)
      hideButtonSvgs(liveNewSession, 'new-session', iconCleanups)
      applyResponsiveButtonIcon(
        findButtonByIconPath(root, PANEL_ICON_PATH),
        themeConfig.sideBar.icons.collapse,
        'collapse',
        iconCleanups,
      )
      applyResponsiveButtonIcon(
        findButtonByIconPath(root, SEARCH_ICON_PATH),
        themeConfig.sideBar.icons.search,
        'search',
        iconCleanups,
      )
      applyResponsiveButtonIcon(
        findButtonByIconPath(root, FILTER_ICON_PATH),
        themeConfig.sideBar.icons.filter,
        'filter',
        iconCleanups,
      )
      applyResponsiveButtonIcon(
        findButtonByIconPath(root, ADD_WORKSPACE_ICON_PATH),
        themeConfig.sideBar.icons.addWorkspace,
        'add-workspace',
        iconCleanups,
      )
      applyResponsiveButtonIcon(
        findButtonByIconPath(root, SETTINGS_ICON_PATH_16)
          ?? findButtonByIconPath(root, SETTINGS_ICON_PATH_14),
        themeConfig.sideBar.icons.settings,
        'settings',
        iconCleanups,
        button => button.querySelector(':scope > span') === null,
      )
    }

    syncIcons()
    const iconObserver = new MutationObserver(syncIcons)
    iconObserver.observe(root, { childList: true, subtree: true })

    console.log('🔥 sidebar root theme found', { root, header, newSession, workspace, footer })

    return () => {
      iconObserver.disconnect()
      for (const cleanup of iconCleanups.reverse()) cleanup()
      for (const cleanup of cleanups.reverse()) cleanup()
    }
  })
}

