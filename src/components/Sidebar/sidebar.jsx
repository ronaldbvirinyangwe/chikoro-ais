import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Add dark mode state
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
    <div className={`Sidebar ${darkMode ? "dark-mode" : ""}`}>
      <div className="top">
        <img onClick={() => setExtended((prev) => !prev)} className="menu" src={assets.menu_icon} alt="" />
        <div onClick={() => newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts.map((item, index) => {
              return (
                <div onClick={() => loadPrompt(item)} className="recent-entry">
                  <img src={assets.message_icon} alt="" />
                  <p>{item.slice(0, 18)} ...</p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" onClick={() => setShowHelp((prev) => !prev)} />
          {extended ? <p>Help</p> : null}
          {showHelp ? (
            <ul>
              <li>
                <a href="https://x.com/ronnyb_scales" target="_blank" rel="noopener noreferrer">
                  <img src={assets.twitter} alt="" />
                </a>
              </li>
              <li>
                <a href="https://discord.gg/8kf87QZK" target="_blank" rel="noopener noreferrer">
                  <img src={assets.discord} alt="" />
                </a>
              </li>
              <li>
                <a href = "https://www.facebook.com/groups/846356727459402" target="_blank" rel="noopener noreferrer">
                  <img src={assets.facebook} alt="" />
                </a>
              </li>
            </ul>
          ) : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" onClick={() => setShowSettings((prev) => !prev)} />
          {extended ? <p>Settings</p> : null}
          {showSettings ? (
            <label>
              <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
              Dark Mode coming soon
            </label>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
