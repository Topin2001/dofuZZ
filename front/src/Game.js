import Player from './Player.js';
import Renderer from './Renderer.js';
import Board, { BOARD_SIZE } from './Board.js';
import Camera from './Camera.js';
import HUD from './HUD.js';
import Character from './Character.js';

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


import { Component, useEffect } from 'react';


const style = {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'
};

const STEPS_PER_FRAME = 5;


class Game extends Component {
    state = {
        hoverMode: 0,
        playerId: this.props.playerId,
        gameId: this.props.gameId,
        errorMessage: 'No error',
        gameState: 'Waiting for players',
        turn: 'Players take turns once all ships are placed',
        endGame: false,
        API_URL: this.props.backendUrl + "/api/game/",
        winner: null
    };

    componentDidMount() {
        this.sceneSetup();
        this.addLights();
        this.loadModels();
        this.startAnimationLoop();
        this.gameStateUpdate();
        window.addEventListener('resize', this.handleWindowResize);
        window.addEventListener('keydown', this.keyDownListener);
        window.addEventListener('keyup', this.keyUpListener);
        window.addEventListener('mousemove', this.mouseMoveListener);
        window.addEventListener('mousedown', this.clickDownListener);
        window.addEventListener('mouseup', this.clickUpListener.bind(this));
        console.log(this.state.playerId);
        console.log(this.state.gameId);
        console.log(this.state.API_URL);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
        window.cancelAnimationFrame(this.requestID);
    }

    sceneSetup = () => {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.camera = new Camera();
        this.camera.camera.rotation.order = 'YXZ';
        this.player = new Player({ camera: this.camera.camera });
        this.setState({ errorMessage: "No error"});
        console.log(this.state.errorMessage);
        this.setState({ hoverMode: this.player.hoverMode });
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.renderer = new Renderer();
        this.renderer.setSize(width, height);
        this.camera.camera.position.z = 500;
        this.board = new Board();
        this.board.createBoard(0);
        this.scene.add(this.board.tiles);

        this.mount.appendChild(this.renderer.domElement);
        this.models = new THREE.Group();
        this.keyStates = {};
    };

    loadModels = () => {
        this.scene.background = new THREE.CubeTextureLoader().load([
            "test_right.png", "test_left.png",
            "test_top.png", "test_bottom.png",
            "test_front.png", "test_back.png"
        ]);

        
        const loader = new OBJLoader();
        const gltfLoader = new GLTFLoader();

        gltfLoader.load("devweb.glb", (gltf) => {
            gltf.scene.scale.set(5, 5, 5);
            gltf.scene.position.set(130, -1, 130);
            this.scene.add(gltf.scene);
            this.gltf = gltf.scene;
        });


        this.playerCharacter = new Character({ scene: this.scene, position: new THREE.Vector3(0,0,0) ,modelPath: "Knight.glb" });
        // this.ennemyCharacter = new Character({ scene: this.scene, position: new THREE.Vector3(0,0,0) ,modelPath: "Rogue_Hooded.glb" });
    };


    // adding some lights to the scene
    addLights = () => {
        const lights = [];

        // set color and intensity of lights
        lights[0] = new THREE.PointLight(0xffffff, 1, 0);
        lights[1] = new THREE.PointLight(0xffffff, 1, 0);
        lights[2] = new THREE.PointLight(0xffffff, 1, 0);

        // place some lights around the scene for best looks and feel
        lights[0].position.set(0, 2000, 0);
        lights[1].position.set(1000, 2000, 1000);
        lights[2].position.set(- 1000, - 2000, - 1000);

        this.scene.add(lights[0]);
        this.scene.add(lights[1]);
        this.scene.add(lights[2]);
    };

    startAnimationLoop = () => {
        const deltaTime = Math.min(0.05, this.clock.getDelta()) / STEPS_PER_FRAME;

        for (let i = 0; i < STEPS_PER_FRAME; i++) {
            this.controls(deltaTime);
            this.player.update(deltaTime);
            this.playerCharacter.update(deltaTime);
            this.board.hoverTiles(this.camera, this.playerCharacter, this.player.actionType);
        }

        this.renderer.render(this.scene, this.camera.camera);

        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    gameStateUpdate = () => {
        setInterval(() => {
            console.log(this.state.API_URL + this.props.gameId);
            fetch("http://localhost:8080/games/" + this.props.gameId + "/state?gameId=" + this.props.gameId, {
                method: 'GET'
            })
                .then(async (response) => {
                    if (response.ok){
                        const data = await response.json();
                        // if (data.winner != -1){
                        //     this.setState({winner: data.winner});
                        //     console.log(data.winner);
                        //     if (data.winner == this.state.playerId){
                        //         console.log("You Win");
                        //         this.setState({turn: "You Win"});
                        //     }
                        //     else{
                        //         this.setState({turn: "You Lose"});
                        //     }
                        //     this.setState({gameState: "Game Over"});
                        //     console.log("Game Over");
                        // }

                        // else {
                            // if (data.player1_id or data.player2_id null then this.setState({gameState: "Waiting for players"}))
                            if (data.player2_id == null){
                                this.setState({gameState: "Waiting for players"});
                            }
                            else if (data.player1_id == null){
                                this.setState({gameState: "Something went wrong, please start a new game"});
                            }
                            else {
                                this.setState({gameState: "Game in progress"});
                            }


                            // turn is nb_turns % 2, if 0 then player1, if 1 then player2
                            const turn = data.nb_turns % 2 == 0 ? `Player ${data.player1_id} turn` : `Player ${data.player2_id} turn`;
                            this.setState({turn: this.state.gameState == "Waiting for players" ? "Waiting for players" : turn});
                        // }                    
                    }
                    else{
                        throw new Error("Error while fetching game state");
                    }
                })
                .catch((error) => {
                    this.setState({error: error.message});
                });
        }
        , 1000);
    };

    handleWindowResize = () => {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.renderer.setSize(width, height);
        this.camera.camera.aspect = width / height;

        this.camera.camera.updateProjectionMatrix();
    };

    controls = (deltaTime) => {
        const speedDelta = deltaTime * 30;
        if (this.keyStates['KeyW']) {
            this.player.velocity.add(this.player.getForwardVector().multiplyScalar(speedDelta));
        }
        if (this.keyStates['KeyS']) {
            this.player.velocity.add(this.player.getForwardVector().multiplyScalar(- speedDelta));
        }
        if (this.keyStates['KeyA']) {
            this.player.velocity.add(this.player.getSideVector().multiplyScalar(- speedDelta));
        }
        if (this.keyStates['KeyD']) {
            this.player.velocity.add(this.player.getSideVector().multiplyScalar(speedDelta));
        }
        if (this.keyStates['Space']) {
            this.player.velocity.y = 4;
        }
        if (this.keyStates['ShiftLeft']) {
            this.player.velocity.y = - 4;
        }
    }

    keyDownListener = (event) => {
        this.keyStates[event.code] = true;
    };

    keyUpListener = (event) => {
        this.keyStates[event.code] = false;
        // if (event.code == 'KeyE') {
        //     shipSelection = 0;
        // }
        this.setState({ hoverMode: this.player.hoverMode });
    };

    clickDownListener = () => {
        document.body.requestPointerLock();
    };

    clickUpListener() {
        if (document.pointerLockElement !== null) {
            if (this.player.actionType == 1) {
                this.playerCharacter.moveToTile(this.board.getPointedTile(this.camera).x, this.board.getPointedTile(this.camera).z);
            }
            else if (this.player.actionType == 0) {
                const targetedTile = this.board.getPointedTile(this.camera);
                // request to check if the tile is in range etc...
                this.playerCharacter.attackTile(targetedTile, 0);
            }
        };
    };

    mouseMoveListener = (event) => {
        if (document.pointerLockElement === document.body) {
            if (this.camera.camera) {
                this.camera.camera.rotation.y -= event.movementX / 500;
                this.camera.camera.rotation.x -= event.movementY / 500;
            }
        }
    };

    render() {
        if (this.player) {
            if (this.state.winner) {
                return (
                    <>
                        <h1 style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }}>Game Over</h1>
                        <h2 style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)' }}>{(this.state.winner === this.props.playerId) ? "You won!" : "You lost!"}</h2>
                        <h2 style={{ position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)' }}>Reload the page to play again</h2>

                    </>
                );
            }
            return (
                <>
                    <HUD hoverMode={this.player.hoverMode} ships={this.player.ships} playerId={this.props.playerId} gameId={this.props.gameId} errorMessage={this.state.errorMessage} gameState={this.state.gameState} turn={this.state.turn} />
                    <div style={style} ref={ref => (this.mount = ref)} />
                </>
            );
        }
        else {
            return (
                <>
                    <HUD hoverMode={0} ships={[]} playerId={this.props.playerId} gameId={this.props.gameId} />
                    {/* <Dashboard playerId={this.props.playerId} gameId={this.props.gameId} /> */}

                    <div style={style} ref={ref => (this.mount = ref)} />
                </>
            );
        }
    }
}

export default Game;