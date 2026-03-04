import './App.css'
import Icons from './Icons'
import { useEffect, useState, type JSX } from 'react'


function Main(): JSX.Element {
  return <h1>Main Content Box</h1>
}

function Test() {
  return <h1>Test</h1>
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
  const [sidebarState, setSidebarState] = useState(false)
  const [pageContent, setPageContent] = useState<string>("main")

  const menuEntries: MenuEntry[] = [
    { id: 1, name: "Navigation", type: "headline" },
    { id: 2, type: "borderline" },
    { id: 3, type: "button", name: "Home", icon: Icons.home, page: "main" },
    { id: 4, type: "button", name: "Test", icon: Icons.labs, page: "test" }
  ]

  const Pages: Record<string, () => JSX.Element> = {
    main: Main,
    test: Test
  }

  // 🔥 Hash beim Laden lesen
  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (hash && Pages[hash]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPageContent(hash)
    }

    // 🔥 reagieren wenn Hash sich ändert
    const onHashChange = () => {
      const newHash = window.location.hash.replace("#", "")
      if (Pages[newHash]) {
        setPageContent(newHash)
      } else {
        setPageContent("404")
      }
    }

    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const CurrentPage = Pages[pageContent] || NotFound

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