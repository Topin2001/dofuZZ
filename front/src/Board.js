import { Component } from 'react';
import * as THREE from 'three';

import { hoverModes , hoverAreas , hoverRotationDirections } from './Player.js';

const TILE_SIZE = 15;
const BOARD_SIZE = 10;

class Board extends Component {
    constructor(props) {
        super(props);
        this.tiles = new THREE.Group();
        this.objects = [];
        this.hoveredTiles = [];
        this.occupiedTiles = [];
        this.z0 = 0;
        this.isHit = false;
    }

    createBoard(z0) {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const tileGeometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
                const tileMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true });
                const tile = new THREE.Mesh(tileGeometry, tileMaterial);
                tile.rotation.x = Math.PI / 2;
                tile.position.y = - TILE_SIZE;
                tile.position.x = z0 + i * TILE_SIZE;
                tile.position.z =  j * TILE_SIZE;
                tile.isTaken = false;
                tile.index = { x: i, z: j };
                this.tiles.add(tile);
                tile.isOccupiedBy = -1;
                tile.wasShot = false;
            }
        }
        this.z0 = z0;
    }

    getShipTiles(rootTile, dimensions, rotation) {
        const placeTiles = [];
        let tileX;
        let tileZ;
        for (let i = 0; i < dimensions.x; i++) {
            for (let j = 0; j < dimensions.y; j++) {
                if (rotation % 2 === 0) {
                    tileX = rootTile.x + hoverRotationDirections[rotation].x * i;
                    tileZ = rootTile.z + hoverRotationDirections[rotation].y * j;
                } else {
                    tileX = rootTile.x + hoverRotationDirections[rotation].y * j;
                    tileZ = rootTile.z + hoverRotationDirections[rotation].x * i;
                }
                const tile = this.tiles.children[tileX * BOARD_SIZE + tileZ];
                if (!tile || tileX >= BOARD_SIZE || tileX < 0 || tileZ < 0 || tileZ >= BOARD_SIZE ) throw new Error("Cannot place ship here");
                placeTiles.push(tile.index);
            }
        }
        // console.log(placeTiles);
        return placeTiles;
    }


    hoverTiles(camera, hoverMode, hoverRotation) {
        this.tiles.children.forEach(tile => {
            if (tile.isTaken) tile.material.color.set(0x0000ff);
            if (tile.wasShot) tile.material.color.set(0x000000);
            if (tile.isHit) tile.material.color.set(0xff0000);
        });
        this.hoveredTiles.forEach(tileCoords => {
            const tile = this.tiles.children.find(tile => tile.index.x === tileCoords.x && tile.index.z === tileCoords.z);
            if (!tile.isTaken) tile.material.color.set(0x00ff00);
        });
        this.hoveredTiles = [];

        if (hoverMode !== hoverModes.NONE) {    
            const indexes = this.getPointedTile(camera);
            if (indexes.x !== -1 && indexes.z !== -1) {
                const hoverArea = hoverAreas[hoverMode];
                try {
                    const newPlaceTiles = this.getShipTiles(indexes, hoverArea, hoverRotation);
                    if (newPlaceTiles.length === hoverArea.x * hoverArea.y) {
                        newPlaceTiles.forEach(tileCoords => {
                            this.hoveredTiles.push(tileCoords);
                        });
                        this.hoveredTiles.forEach(tileCoords => {
                            const tile = this.tiles.children.find(tile => tile.index.x === tileCoords.x && tile.index.z === tileCoords.z);
                            tile.material.color.set(0xff0000);
                        });
                        return indexes;
                    }
                } catch (error) {
                    return { x: -1, z: -1 };
                }
            }
        }
        return { x: -1, z: -1 };
    }

    getPointedTile(camera) {
        const lookAt = new THREE.Vector3();
        camera.camera.getWorldDirection(lookAt);
        camera.raycaster.set(camera.camera.position, lookAt);
        const intersects = camera.raycaster.intersectObjects(this.tiles.children);
        if (intersects.length > 0) {
            const tile = intersects[0].object;
            return tile.index;
        }
        return { x: -1, z: -1 };
    }

    getTileByIndex(indexes) {
        return this.tiles.children[indexes.x * BOARD_SIZE + indexes.z];
    }

    getTileIndex(tile) {
        return tile.index;
    }


    getTilesOccupiedByShip(index){
        return this.occupiedTiles.filter(tile => 
            {
                if (tile.occupiedBy === index) return tile
            });
    }

    updateBoard(data) {
        console.log(data);
        const shotList = data.shots;
        console.log(shotList);
        shotList.forEach(shot => {
            console.log(shot);
            const tile = this.tiles.children.find(tile => tile.index.x === shot.x && tile.index.z === shot.y);
            console.log(tile);
            tile.isHit = shot.wasHit;
            tile.wasShot = true;
            if (tile.wasShot) tile.material.color.set(0xff0000);
        });
    }


    render() {
        return null;
    }
}

export default Board;
export { TILE_SIZE };
export { BOARD_SIZE };