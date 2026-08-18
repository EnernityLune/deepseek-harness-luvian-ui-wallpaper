import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { applyChatArea } from './components/chatArea'
import { applyHeroTitle } from './components/heroTitle'
import { applyInputArea } from './components/inputArea'
import { applyInputCard } from './components/inputCard'
import { applyMessage } from './components/message'
import { applyMiddleArea } from './components/middleArea'
import { applySideBar } from './components/sideBar'
import type { Dispose } from './dom'

export const inject = ['theme']

/** Registers every wallpaper surface for the client plugin lifetime. */
export function apply(ctx: ClientContext): void {
  console.log('🔥 Luvian wallpaper theme loaded')

  ctx.effect(() => {
    const disposers: Dispose[] = [
      applyChatArea(),
      applyHeroTitle(),
      applyMiddleArea(),
      applyInputArea(),
      applyInputCard(),
      applySideBar(),
      applyMessage(),
    ]

    return () => {
      for (const dispose of disposers.reverse()) dispose()
    }
  }, 'ui-wallpaper: visual surfaces')
}

