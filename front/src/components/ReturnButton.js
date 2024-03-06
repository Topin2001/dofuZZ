import React from 'react';
import ReactDOM from 'react-dom/client';


import JoinGame from './JoinGame';
import CreateGame from './CreateGame';



function JoinGameMenu(){

    root.render(
      <React.StrictMode>
        <JoinGame />
      </React.StrictMode>
      );
  }
  
  function CreateGameMenu(){
  
    root.render(
      <React.StrictMode>
        <CreateGame />
      </React.StrictMode>
      );
  }


const root = ReactDOM.createRoot(document.getElementById('root'));

  function ReturnButton () {
        root.render(
            <React.StrictMode>
                <div className = "Title">
                    <h1>SPATIAL WAR</h1>
                </div>
                <div className = "Buttons">
                    <button className="button" type="button" onClick={JoinGameMenu}>
                        JOIN GAME
                    </button>
                    <button className="button" type="button" onClick={CreateGameMenu}>
                        CREATE GAME
                    </button>
                </div>
            </React.StrictMode>
        )
  }




export default ReturnButton;