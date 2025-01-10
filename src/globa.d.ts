declare global {
  interface Window {
    Telegram: {
      WebApp: {
        viewportHeight: number
        expand: () => void
        ready: () => void
      }
    }
  }
}

export {}
