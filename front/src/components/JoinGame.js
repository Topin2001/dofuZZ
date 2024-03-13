import './JoinGame.css';
import React from 'react';

import Container from '../Container';

import ReturnButton from './ReturnButton';
import { useState, useEffect } from 'react';


function JoinGame(props) {
    const [gameid, setGameId] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);

    function handleGameIDChange(event) {
        setGameId(event.target.value);
    }

    function joinGame(event) {
        event.preventDefault();
        console.log("Joining game");

        const url = props.backendUrl + '/games/join?code=' + gameid + '&playerId=' + props.playerId;
        console.log(url)
        fetch(url, {
            method: 'POST', 
        })
            .then(async response => {
                if (response.ok) {
                    const data = await response.json();
                    props.gameIdCallBack(data.gameId);
                    // set data.playerJwt as jwt cookie
                    document.cookie = 'jwt=' + data.playerJwt;
                }
                else {
                    const message = await response.text();
                    throw new Error(message);
                }
            })
            .catch(error => {
                alert(error);
            });  
    }

    return (
        <React.StrictMode>
            <div>
                <button className="button" type="button" onClick={props.returnButtonCallBack}>
                    BACK
                </button>
            </div>
            <div className="Title">
                <h1>DofuZZ</h1>
            </div>
            <div className="JoinGameForm">
                <form /*onSubmit={this.handleSubmit}*/>
                    <label>
                        <h3>
                            Select Class:
                        </h3>
                        <select id="classSelector">
                            <option value="class1">Class 1</option>
                            <option value="class2">Class 2</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        <input type="text"
                            placeholder='code'
                            value={gameid}
                            onChange={handleGameIDChange} />
                    </label>
                    <br/>
                    <input className="button" type="submit" value="Join" onClick={joinGame} />
                </form>
            </div>
        </React.StrictMode>
    );
}



// class JoinGame extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {username: '',
//                   gameid: '',
//                     isGameStarted: false};

//     this.handleChange = this.handleChange.bind(this);
//     this.joinGame = this.joinGame.bind(this);
//   }

//   handleChange(event) {

//     this.setState({username: event.target.form[0].value,
//                     gameid: event.target.form[1].value});
//   }



//   joinGame(event) {
//     this.setState({isGameStarted: true});
//     console.log("Joining game");

//     const url = 'https://localhost:7080/api/game/' + this.state.gameid + '/' + this.state.username;
//     console.log(url)
//     fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//     })
//     .then(response =>
//               response.json())
//     .catch(error => console.error('Error:', error))

//   }

//   //'https://localhost:7080/api/game/'+ this.state.username, pour créer une game

//   render() {
//     if (this.state.isGameStarted) {
//       return (
//         <Container />
//       );
//     }
//     return (
//       <React.StrictMode>
//       <div>
//         <button className="button" type="button" onClick={ReturnButton}>
//           BACK
//         </button>
//       </div>
//       <div className = "Title">
//         <h1>SPATIAL WAR</h1>
//       </div>
//       <div className = "JoinGameForm">
//         <form /*onSubmit={this.handleSubmit}*/>
//           <label>
//             <input type="text" 
//                     placeholder='Username' 
//                     value={this.state.username} 
//                     onChange={this.handleChange} />
//           </label>
//           <br/>
//           <label>
//             <input type="text"
//                    placeholder='GameId'
//                    value={this.state.gameid}
//                    onChange={this.handleChange} />
//           </label>
//           <br/>
//         </form>
//         <button className="button" type="button" onClick={ this.joinGame }>

//           JOIN
//         </button>
//       </div>
//       </React.StrictMode>
//     );
//   }
// }



export default JoinGame;