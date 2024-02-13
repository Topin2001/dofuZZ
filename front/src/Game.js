import Player from './Player.js';
import Ship from './Ship.js';
import Renderer from './Renderer.js';
import Board, { BOARD_SIZE } from './Board.js';
import Camera from './Camera.js';
import HUD from './HUD.js';

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import { Component, useEffect } from 'react';

import { hoverModes } from './Player.js';
import { hoverAreas } from './Player.js';
import { TILE_SIZE } from './Board.js';
import { modelsSettings } from './constants.js';

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
        this.scene.background = new THREE.CubeTextureLoader().setPath("https://api.belkhiri.dev/models/").load([
            "right.png", "left.png",
            "top.png", "bottom.png",
            "front.png", "back.png"
        ]);

        const loader = new OBJLoader();
        Object.keys(hoverModes).forEach((mode, index) => {
            if (index > 0) {
                const ship = new Ship({
                    name: mode,
                    dimensions: hoverAreas[index],
                    modelSrc: 'https://api.belkhiri.dev/models/' + mode + '.obj',
                    textureSrc: 'https://api.belkhiri.dev/models/' + mode + '.png',
                    board: this.board,
                    index: index
                });
                ship.loadModel(loader, modelsSettings[mode], this.player.hoverRotation, this.models);
                this.player.ships.push(ship);
            }
        });

        loader.load(
            'https://api.belkhiri.dev/models/station06_ring.obj',
            (object) => {
                object.name = "station1";
                object.scale.set(10, 10, 10);
                object.position.set(70, -30, 70);
                this.models.add(object);
                this.scene.add(this.models);
                // change material of object
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('https://api.belkhiri.dev/models/station06_ring_specular.png') });
                    }
                });

                // clone object
                const object2 = object.clone();
                object2.name = "station2";
                object2.position.set(270, -30, 70);
                this.models.add(object2);
                this.scene.add(this.models);
            }
        )

        loader.load(
            'https://api.belkhiri.dev/models/station01.obj',
            (object) => {
                object.name = "station3";
                object.scale.set(10, 10, 10);
                object.position.set(-100, 0, 270);
                object.rotation.set(1.5, 0.3, 0.5);
                this.models.add(object);
                this.scene.add(this.models);
                // change material of object
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('https://api.belkhiri.dev/models/station01_specular.png') });
                    }
                });
            }
        )
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
        }

        this.renderer.render(this.scene, this.camera.camera);

        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    gameStateUpdate = () => {
        // setInterval(() => {
        //     console.log(this.state.API_URL + this.props.gameId);
        //     fetch(this.state.API_URL + this.props.gameId, {
        //         method: 'GET'
        //     })
        //         .then(async (response) => {
        //             if (response.ok){
        //                 const data = await response.json();
        //                 if (data.winner != 0){
        //                     this.setState({winner: data.winner});
        //                     console.log(data.winner);
        //                     if (data.winner == this.state.playerId){
        //                         console.log("You Win");
        //                         this.setState({turn: "You Win"});
        //                     }
        //                     else{
        //                         this.setState({turn: "You Lose"});
        //                     }
        //                     this.setState({gameState: "Game Over"});
        //                     console.log("Game Over");
        //                 }

        //                 if (data.isBuildPhase){
        //                     if (data.player1Id != 0 && data.player2Id != 0){
        //                         this.setState({gameState: "Building Phase"});
        //                     }
        //                 }

        //                 if (!data.isBuildPhase){
        //                     this.setState({gameState: "Attacking Phase"});
        //                     this.player.mode = 0;
        //                     if (data.isPlayer1Turn){
        //                         if (this.state.playerId == 1){
        //                             this.setState({turn: "Your Turn"});

        //                         }
        //                         else{
        //                             this.setState({turn: "Opponent Turn"});
        //                         }
        //                     }
        //                     else {
        //                         if (this.state.playerId == 2){
        //                             this.setState({turn: "Your Turn"});
        //                         }
        //                         else{
        //                             this.setState({turn: "Opponent Turn"});
        //                         }
        //                     }
        //                 }                    
        //             }
        //             else{
        //                 throw new Error("Error while fetching game state");
        //             }
        //         })
        //         .catch((error) => {
        //             this.setState({error: error.message});
        //         });

        //     fetch(this.state.API_URL + this.props.gameId + "/board?playerId=" + this.state.playerId, {
        //         method: 'GET'
        //     })
        //         .then(async (response) => {
        //             if (response.ok){
        //                 const data = await response.json();
        //                 console.log(data);
        //                 this.board.updateBoard(data);
        //             }
        //             else{
        //                 throw new Error("Error while fetching board state");
        //             }
        //         })
        //         .catch((error) => {
        //             this.setState({error: error.message});
        //         });
        //     }, 5000);
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
        let shipSelection = -1;
        if (event.code == 'KeyE') {
            shipSelection = 0;
        }
        if (event.code == 'Digit1') {
            if (!this.player.ships[0].isSetup) {
                this.player.tpUnsetShips(0);
                shipSelection = 1;
            }
        }
        if (event.code == 'Digit2') {
            if (!this.player.ships[1].isSetup) {
                this.player.tpUnsetShips(1);
                shipSelection = 2;
            }
        }
        if (event.code == 'Digit3') {
            if (!this.player.ships[2].isSetup) {
                this.player.tpUnsetShips(2);
                shipSelection = 3;
            }
        }
        if (event.code == 'Digit4') {
            if (!this.player.ships[3].isSetup) {
                this.player.tpUnsetShips(3);
                shipSelection = 4;
            }
        }
        if (event.code == 'KeyR') {
            this.player.hoverRotation += 1;
            if (this.player.hoverRotation > 1) this.player.hoverRotation = 0;
        }
        if (event.code == 'KeyF') {
            this.player.mode = 1 - this.player.mode;
        }
        if (shipSelection != -1) {
            const ship = this.player.ships.filter(ship => ship.index == shipSelection)[0];
            if (ship.isSetup) {
                ship.isSetup = false;
                ship.model.position.x = -1000;
                ship.model.position.z = -1000;
                const tiles = this.board.getTilesOccupiedByShip(ship.index);
                tiles.forEach((tile) => {
                    tile.material.color.set(0x00ff00);
                });
            }
            this.player.hoverMode = shipSelection;
        }
        this.setState({ hoverMode: this.player.hoverMode });
    };

    clickDownListener = () => {
        document.body.requestPointerLock();
    };

    clickUpListener() {
        if (document.pointerLockElement !== null) {
            if (this.player.mode == 1) {
                const ship = this.player.ships[this.player.hoverMode - 1];
                console.log(ship);
                let shipOriginIndexs = this.board.getPointedTile(this.camera);
                if (shipOriginIndexs.x != -1 && shipOriginIndexs.z != -1) {
                    // lock ship to grid
                    ship.position.x = shipOriginIndexs.x;
                    ship.position.z = shipOriginIndexs.z;
                    ship.rotation = this.player.hoverRotation;
                    ship.isSetup = true;
                    const x = shipOriginIndexs.x;
                    const y = shipOriginIndexs.z;
                    const horizontalOrientation = this.player.hoverRotation ? "false" : "true";
                    const shipType = ship.index - 1;
                    // send request to server
                    fetch(this.state.API_URL + this.props.gameId + '/ship/' + this.props.playerId + '?x=' + x + '&y=' + y + '&horizontalOrientation=' + horizontalOrientation + '&shipType=' + shipType, {
                        method: 'POST'
                    })
                    .then(async response => {
                        if (response.ok){
                            const occupiedTiles = this.board.getShipTiles(shipOriginIndexs, ship.dimensions, this.player.hoverRotation);
                            occupiedTiles.forEach((tileCoord) => {
                                    const tile = this.board.getTileByIndex(tileCoord);
                                    this.board.occupiedTiles.push(tile);
                                    tile.isTaken = true;
                                    tile.occupiedBy = ship.index;
                                    this.player.hoverMode = 0;
                                    ship.model.children[0].material.opacity = 1;
                                });
                                ship.isSetup = true;
                                this.setState({ errorMessage: "No error" });
                        }
                        else {
                            const message = await response.text();
                            ship.isSetup = false;
                            throw new Error(message);
                        }
                    })
                        .catch((error) => {
                            // set error
                            this.setState({ errorMessage: error.message });
                            console.error('Error:', this.state.errorMessage);
                        });
                        
                }

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