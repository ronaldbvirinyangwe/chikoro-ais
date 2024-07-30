import React, { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

const Main = () => {

  const {onSent,recentPrompt,showResult,loading,resultData,setInput,input} = useContext(Context)

  const cardMessages = [
    "Ndibatsire kuita homework",
    "Ndibatsirewo nekuverenga",
    "Brainstorm team bonding activities for our work retreat",
    "Improve the readability of the following code",
  ];

  const handleCardClick = (message) => {
    setInput(message);
    onSent();
  };

  return (
    <div className='main'>
      <div className="nav">
        <p>Chikoro AI</p>
        <img src="src/assets/profile.png" alt="" />
      </div>
      <div className="main-container">

        {!showResult
        ?<>
         <div className="greet">
            <p><span>Mhoro, </span></p>
            <p>Ndokubatsira nei nhasi?</p>
        </div>
        <div className="cards">
              {cardMessages.map((message, index) => (
                <div key={index} className="card" onClick={() => handleCardClick(message)}>
                  <p>{message}</p>
                  <img src={assets[`${index === 0 ? 'compass_icon' : index === 1 ? 'bulb_icon' : index === 2 ? 'message_icon' : 'code_icon'}`]} alt="" />
                </div>
              ))}
            </div>
        </>
        :<div className='result'>
          <div className="result-title">
            <img src="src/assets/profile.png" alt="" />
            <p>{recentPrompt}</p>
          </div>
          <div className="result-data">
            <img src="Scales Technologies Abstract Logo.png" alt="" />
            {loading
            ?<div className='loader'>
              <hr />
              <hr />
              <hr />
            </div>
            :<p dangerouslySetInnerHTML={{__html:resultData}}></p>
            }
          </div>
        </div>
        }

       
        <div className="main-bottom">
            <div className="search-box">
                <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Nyora muvhunzo wako pano'/>
                <div>
                    <img src={assets.gallery_icon} alt="" />
                    <img src={assets.mic_icon} alt="" />
                    {input?<img onClick={()=>onSent()} src={assets.send_icon} alt="" />:null}
                </div>
            </div>
            <p className="bottom-info">Chikoro AI may display inaccurate info, including about people, so double-check its responses</p>
        </div>
      </div>
    </div>
  )
}

export default Main
