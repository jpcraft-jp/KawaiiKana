import "./css/Settings.css"
import "./helpers/Icons"
import { useState, useEffect } from "react"

interface SettingsEntry {
    id: number
    name?: string
    type: "button" | "borderline" | "headline" | "switch"
    icon?: string
    onClick?: () => void
    callback?: () => void
}


interface ToggleSwitchProps {
  state: boolean;
  callback: (state: boolean) => void;
}

function ToggleSwitch({ callback, state }: ToggleSwitchProps) {
  const [blopState, setBlopState] = useState<boolean>(state);

  // Sync, falls der externe state sich ändert
  useEffect(() => {
    setBlopState(state);
  }, [state]);

  const handleClick = () => {
    const newState = !blopState;
    setBlopState(newState);
    callback(newState);
  };

  return (
    <div className="toggle-switch-box" onClick={handleClick}>
      <div className="toggle-switch-body">
        <div className={`toggle-switch-blop ${blopState ? "on" : ""}`}></div>
      </div>
    </div>
  );
}



function Settings() {
    const SettingsEntrys: SettingsEntry[] = [
        { id: 0, name: "Settings", type: "headline" },
        { id: 1, type: "borderline" },
        { id: 3, name: "test", type: "switch" }
    ]

    return (
        <>
            <div className="SettingsBody">
                {SettingsEntrys.map((entry) => (
                    <div
                        key={entry.id}
                        className={`SettingsEntry ${entry.type}`}
                        onClick={entry.onClick} // nur wenn definiert
                    >
                        {entry.type === "button" && entry.name && <span>{entry.name}</span>}
                        {entry.type === "headline" && entry.name && <h3>{entry.name}</h3>}
                        {entry.type === "borderline" && null} {/* nur Linie */}
                        {entry.type === "switch" && (
                            <>
                                <ToggleSwitch state={true} callback={(state) => {console.log("toggle_switch_state " + state)}} />
                                <span className="text">{entry.name}</span>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}

export default Settings