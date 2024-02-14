import './CreateGame.css';
import React from 'react';

function CreateGame(props) {

    function handleCreateGame(event) {
        event.preventDefault();
        const code = document.getElementById('code').value;
        const url = props.backendUrl + '/api/game/';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        })
            .then(response => {
                if (response.ok) {
                    return response;
                }
                throw new Error('Network response was not ok.');
            })
            .then(response => response.text())
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
                <h1>DofuZZ</h1>
            </div>
            <div className="CreateGameForm">
                <form id='create'>
                    <label>
                        <input type="text" id="code" placeholder='code' />
                    </label>
                    <br />
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