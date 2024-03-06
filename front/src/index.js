import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'typeface-quicksand';

import App from "./App";
import JoinGame from './components/JoinGame';
import CreateGame from './components/CreateGame';
import reportWebVitals from './reportWebVitals';
import { useState, useEffect } from 'react';

import './index.css';

function Menu() {
    const [page, setPage] = useState('menu');
    const [playerId, setPlayerId] = useState(null);
    const [gameId, setGameId] = useState(null);
    const [backendUrl, setBackendUrl] = useState("http://localhost:8080");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // check if cookie called jwt is present
        const jwt = document.cookie.split(';').find(cookie => cookie.trim().startsWith('jwt='));
        if (!jwt) {
            setIsLoggedIn(false);
        }
        else {
            setIsLoggedIn(true);
        }
    }, [page]);


    function returnButtonCallBack() {
        setPage('menu');
    }

    function playerIdCallBack(playerId) {
        setPlayerId(playerId);
        console.log("playerId: " + playerId);
        setPage('game');
    }

    function gameIdCallBack(gameId) {
        console.log("gameId: " + gameId);
        setGameId(gameId);
    }

    function setJWT(jwtToken) {
        document.cookie = `jwt=${jwtToken}; path=/;`;
    }

    function getUserName() {
        const jwt = document.cookie.split(';').find(cookie => cookie.trim().startsWith('jwt='));
        if (!jwt) {
            return null;
        }
        const jwtToken = jwt.split('=')[1];
        const payload = jwtToken.split('.')[1];
        const decodedPayload = atob(payload);
        const username = JSON.parse(decodedPayload).username;
        return username;
    }
    
    function register(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const url = backendUrl + '/register';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => {
                if (response.ok) {
                    return response;
                }
                throw new Error('Network response was not ok.');
            })
            .then(response => response.text())
            .then(data => {
                setJWT(data);
                setIsLoggedIn(true);
                setPage("menu");
            })
            .catch(error => alert(error));
    }

    function auth(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const url = backendUrl + '/login';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => {
                if (response.ok) {
                    return response;
                }
                throw new Error('Network response was not ok.');
            })
            .then(response => response.text())
            .then(data => {
                setJWT(data);
                setIsLoggedIn(true);
                setPage("menu");
            })
            .catch(error => alert(error));
    }

    if (page === 'menu') {
        return (
            <>
                <div className="Title">
                    <h1>DofuZZ</h1>
                </div>
                {isLoggedIn && <h3>Welcome, {getUserName()}</h3>}
                <div className="Buttons">
                    {
                        isLoggedIn ?
                            <>
                                <button className="button" type="button" onClick={() => setPage('join')}>
                                    JOIN GAME
                                </button>
                                <button className="button" type="button" onClick={() => setPage('create')}>
                                    CREATE GAME
                                </button>
                            </>
                            :
                            <>
                                <button className="button" type="button" onClick={() => setPage('login')}>
                                    LOGIN
                                </button>
                                <button className="button" type="button" onClick={() => setPage('register')}>
                                    REGISTER
                                </button>
                            </>
                    }
                </div>
                <div className="backend-url-container">
                    <div className="backend-url">
                        <h2>ENTER BACKEND URL</h2>
                        <input type="text" id="backend-url" name="backend-url" value={backendUrl} onChange={(e) => {
                            console.log(e.target.value);
                            setBackendUrl(e.target.value);
                        }} />
                    </div>
                </div>
            </>);
    } else if (page === 'join') {
        return <JoinGame returnButtonCallBack={returnButtonCallBack} playerIdCallBack={playerIdCallBack} gameIdCallBack={gameIdCallBack} backendUrl={backendUrl} />;
    }
    else if (page === 'create') {
        return <CreateGame returnButtonCallBack={returnButtonCallBack} playerIdCallBack={playerIdCallBack} gameIdCallBack={gameIdCallBack} backendUrl={backendUrl} />;
    }
    else if (page === 'game') {
        return <App playerId={playerId} gameId={gameId} backendUrl={backendUrl} />;
    }
    else if (page === 'login' || page === 'register') {
        return (
            <>
                <div>
                    <button className="button" type="button" onClick={() => setPage("menu")}>
                        BACK
                    </button>
                </div>
                <div>
                    <h3>This website is not secure, don't enter any sensitive info</h3>
                </div>
                <div className="CreateGameForm">
                    <form id='create'>
                        <label>
                            <input type="text" id="username" placeholder='username' />
                        </label>
                        <br/>
                        <label>
                            <input type="text" id="password" placeholder='password' />
                        </label>
                        <br />
                    </form>
                    <br/>

                    <button className="button" type="button" onClick={page === 'login' ? auth : register}>
                        {page === 'login' ? 'LOGIN' : 'REGISTER'}
                    </button>
                </div>
            </>);
    }
}


const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <Menu />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

