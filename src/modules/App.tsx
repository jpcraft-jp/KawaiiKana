import './css/App.css'
import Icons from './helpers/Icons'
import Pages from "./helpers/Pages"
import { useEffect, useRef, useState, type JSX } from 'react'
import Settings from './Settings'





function Test() {
  return <h1>Test</h1>
}

class MenuEventListener {

  private events: Map<number, (() => void)[]> = new Map()

  addEventListener(key: number, callback: () => void) {
    if (!this.events.has(key)) {
      this.events.set(key, [])
    }

    this.events.get(key)!.push(callback)
  }

  emit(key: number) {
    const listeners = this.events.get(key)

    if (!listeners) return

    listeners.forEach(cb => cb())
  }
}



function NotFound(): JSX.Element {
  return <h1>404 - Page not found</h1>
}

interface MenuEntry {
  id: number
  icon?: string
  page?: string
  name?: string
  type: "headline" | "button" | "borderline"
}

function App() {
  const menuListender = useRef(new MenuEventListener()).current
  const [sidebarState, setSidebarState] = useState(false)
  const [pageContent, setPageContent] = useState<string>("main")

  const menuEntries: MenuEntry[] = [
    { id: 1, name: "Navigation", type: "headline" },
    { id: 2, type: "borderline" },
    { id: 3, type: "button", name: "Home", icon: Icons.home, page: "main" },
    { id: 4, type: "button", name: "Test", icon: Icons.labs, page: "test" },
    { id: 5, type: "button", name: "Settings", icon: Icons.settings, page: "settings" }
  ]

  const pages: Record<string, () => JSX.Element> = {
    main: Pages.main,
    test: Test,
    settings: Pages.settings
  }


  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (hash && pages[hash]) {
       
      setPageContent(hash)
    }

  
    const onHashChange = () => {
      const newHash = window.location.hash.replace("#", "")
      if (pages[newHash]) {
        setPageContent(newHash)
      } else {
        setPageContent("404")
      }
    }

    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const CurrentPage = pages[pageContent] || NotFound

  return (
    <>
      <div className="hadder">
        <img
          id='menuButton'
          src={Icons.menu}
          alt="menu"
          onClick={() => setSidebarState(prev => !prev)}
        />
      </div>

      <div
        className={`sidebaroverlay ${sidebarState ? "open" : ""}`}
        onClick={() => setSidebarState(false)}
      />

      <div className={`sidebar ${sidebarState ? "open" : ""}`}>
        <img
          src={Icons.close}
          alt="close"
          id='sidebar-close-button'
          onClick={() => setSidebarState(false)}
        />

        <div className='sidebar-menu-entry-box'>
          {menuEntries.map(entry => (
            <div
              key={entry.id}
              className={`sidebar-menu-entry ${entry.type}`}
              onClick={() => {
                menuListender.emit(entry.id)
                if (entry.page) {
                  window.location.hash = entry.page
                  setSidebarState(false)
                }
              }}
            >
              {entry.icon && <img src={entry.icon} alt={entry.name} />}
              {entry.name}
            </div>
          ))}
        </div>
      </div>

      <div className='contentbody'>
        <CurrentPage />
      </div>
    </>
  )
}

export default App