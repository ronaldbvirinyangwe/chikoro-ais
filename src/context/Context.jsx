import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData(prev => prev + nextWord)
    }, 75 * index)
  }

  const newChat = () => {
    setLoading(false)
    setShowResult(false)
  }
  
  const scrollToBottom = () => {
    const textAreas = document.querySelectorAll("textarea");
    textAreas.forEach(textarea => {
      textarea.scrollTop = textarea.scrollHeight;
    });
  }

  const onSent = async (prompt) => {

    setResultData("")
    setLoading(true)
    setShowResult(true)
    let response;
    if (prompt !== undefined) {
      response = await runChat(prompt);
      setRecentPrompt(prompt)
    } else {
      setPrevPrompts(prev => [...prev, input])
      setRecentPrompt(input)
      response = await runChat(input)
    }

    // Handle bold text
    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }

    // Handle code blocks
    let newResponse2 = newResponse.split("`");
    let finalResponse = "";
    for (let i = 0; i < newResponse2.length; i++) {
      if (i % 2 === 0) {
        finalResponse += newResponse2[i];
      } else {
        finalResponse += `
          <code 
            style="
              width: 100%; 
              min-height: 400px; 
              font-family: 'Outfit', monospace; 
              background-color: #f0f4f9; 
              border-radius: 8px; 
              border: 1px solid #ccc; 
              padding: 10px; 
              overflow-y: auto; 
              resize: auto;
              scrollbar-width: thin;
              scrollbar-color: #888 #f0f4f9;">
            ${newResponse2[i]}
          </code>`;
      }
    }


    // Handle line breaks
    finalResponse = finalResponse.split("*").join("</br>")
    
    let newResponseArray = finalResponse.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i]
      delayPara(i, nextWord + " ")
    }

    setLoading(false)
    setInput("")
  }

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  }

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  )

}

export default ContextProvider;
