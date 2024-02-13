import './CreateGame.css';
import React from 'react';

function CreateGame(props) {

    function handleCreateGame(event) {
        event.preventDefault();
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value;
        const url = props.backendUrl + '/api/game/';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
            .then(response => {
                if (response.ok) {
                    return response;
                }
                throw new Error('Network response was not ok.');
            })
            .then(response => response.text())
            .then(data => {
                props.gameIdCallBack(data);
                fetch(url + data + '?playerId=1', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                })
                    .then(response => {
                        if (response.ok) {
                            return response;
                        }
                        throw new Error(response.text());
                    })
                    .catch(error => {
                        alert(error);
                        return Promise.reject(error);})
                    .then(response => response.text())
                    .then(data => {
                        props.playerIdCallBack(1);
                    })
                    .catch(error => alert(error));
            })
            .catch(error => alert(error));
    }

    return (
        <>
            <div>
                <button className="button" type="button" onClick={props.returnButtonCallBack}>
                    BACK
                </button>
            </div>
            <div className="Title">
                <h1>SPATIAL WAR</h1>
            </div>
            <div className="CreateGameForm">
                <form id='create'>
                    <label>
                        <input type="text" id="username" placeholder='username' />
                    </label>
                    <label>
                        <input type="text" id="code" placeholder='code' />
                    </label>
                    <label>
                        Select Class:
                        <select id="classSelector">
                            <option value="class1">Class 1</option>
                            <option value="class2">Class 2</option>
                        </select>
                    </label>
                    <br />
                </form>
                <button className="button" type="button" onClick={handleCreateGame}>
                    CREATE
                </button>
            </div>
        </>
    );
}


export default CreateGame;