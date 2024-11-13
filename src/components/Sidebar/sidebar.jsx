import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Sidebar = () => {
  const [extended, setExtended] = useState(false); // Track if sidebar is extended
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={`Sidebar ${extended ? "extended" : ""} ${darkMode ? "dark-mode" : ""}`}>
      {/* Menu Icon (Always visible, positioned fixed) */}
      <img
        onClick={() => setExtended((prev) => !prev)} // Toggles the extended state
        className="menu"
        src={assets.menu_icon}
        alt="menu"
      />

      {/* Sidebar content */}
      {extended && (
        <>
          <div className="top">
            {/* New Chat Button */}
            <div onClick={() => newChat()} className="new-chat">
              <img src={assets.plus_icon} alt="plus" />
              <p>New Chat</p>
            </div>

            {/* Recent Prompts (Only visible when extended) */}
            <div className="recent">
              <p className="recent-title">Recent</p>
              {prevPrompts.map((item, index) => (
                <div key={index} onClick={() => loadPrompt(item)} className="recent-entry">
                  <img src={assets.message_icon} alt="message" />
                  <p>{item.slice(0, 18)} ...</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bottom">
            {/* Help Section */}
            <div className="bottom-item recent-entry">
              <img
                src={assets.question_icon}
                alt="question"
                onClick={() => setShowHelp((prev) => !prev)}
              />
              <p>Help</p>
              {showHelp && (
                <ul>
                  <li>
                    <a href="https://x.com/chikoro_ai" target="_blank" rel="noopener noreferrer">
                      <img src={assets.twitter} alt="twitter" />
                    </a>
                  </li>
                  <li>
                    <a href="https://discord.gg/8kf87QZK" target="_blank" rel="noopener noreferrer">
                      <img src={assets.discord} alt="discord" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/groups/846356727459402" target="_blank" rel="noopener noreferrer">
                      <img src={assets.facebook} alt="facebook" />
                    </a>
                  </li>
                </ul>
              )}
            </div>

            {/* Activity Section */}
            <div className="bottom-item recent-entry">
              <img src={assets.history_icon} alt="history" />
              <p>Activity</p>
            </div>

            {/* Settings Section */}
            <div className="bottom-item recent-entry">
              <img
                src={assets.setting_icon}
                alt="settings"
                onClick={() => setShowSettings((prev) => !prev)}
              />
              <p>Settings</p>
              {showSettings && (
                <label>
                  <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
                  Dark Mode coming soon
                </label>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;

