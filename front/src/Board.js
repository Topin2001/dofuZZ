import { Component } from 'react';
import * as THREE from 'three';

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
                tile.position.y = 0.1;
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


    hoverTiles(camera, character, actionType, hoverMode) {
        switch (actionType) {
            case 1:
                this.hoverTilesMove(camera, character);
                break;
            case 0:
                this.hoverTilesAttack(camera, character, 1 + hoverMode);
                break;
            default:
                break;
        }
    }

    hoverTilesAttack(camera, character, range) {
        // show 3x3 range
        this.tiles.children.forEach(tile => {
            tile.material.color.set(0x00ff00);
        });
        const charIndexes = { x: character.x, z: character.z };
        if (charIndexes.x !== -1 && charIndexes.z !== -1) {
            const x = charIndexes.x;
            const z = charIndexes.z;

            // color all tiles where abs(x - charIndexes.x) + abs(z - charIndexes.z) <= range
            for (let i = -range; i <= range; i++) {
                for (let j = -range; j <= range; j++) {
                    if (Math.abs(i) + Math.abs(j) <= range) {
                        const tile = this.tiles.children.find(tile => tile.index.x === x + i && tile.index.z === z + j);
                        if (tile) {
                            // tile.material.color.set(0xff0000);
                            // blue
                            tile.material.color.set(0x0000ff);
                        }
                    }
                }
            }
        }
        const camIndexes = this.getPointedTile(camera);
        if (camIndexes.x !== -1 && camIndexes.z !== -1) {
            const dx = Math.abs(camIndexes.x - charIndexes.x);
            const dz = Math.abs(camIndexes.z - charIndexes.z);
            if (dx <= 1 && dz <= 1) {
                const tile = this.tiles.children.find(tile => tile.index.x === camIndexes.x && tile.index.z === camIndexes.z);
                if (tile) {
                    tile.material.color.set(0xff0000);
                }
            }
        }
    }


    hoverTilesMove(camera, character, actionType) {
        if (!character) return { x: -1, z: -1 };
        this.tiles.children.forEach(tile => {
            tile.material.color.set(0x00ff00);
        });
        this.hoveredTiles.forEach(tileCoords => {
            const tile = this.tiles.children.find(tile => tile.index.x === tileCoords.x && tile.index.z === tileCoords.z);
            tile && tile.material.color.set(0x00ff00);
        });
        this.hoveredTiles = [];
    
        const charIndexes = { x: character.x, z: character.z };
        const camIndexes = this.getPointedTile(camera);
        if (camIndexes.x !== -1 && camIndexes.z !== -1) {
        try {
            const dx = Math.abs(camIndexes.x - charIndexes.x);
            const dz = Math.abs(camIndexes.z - charIndexes.z);
            const sx = charIndexes.x < camIndexes.x ? 1 : -1;
            const sz = charIndexes.z < camIndexes.z ? 1 : -1;
            let x = charIndexes.x;
            let z = charIndexes.z;

            if (dx > dz) {
                let err = dx / 2;
                while (x !== camIndexes.x) {
                    this.hoveredTiles.push({ x, z });
                    err -= dz;
                    if (err < 0) {
                        z += sz;
                        err += dx;
                    }
                    x += sx;
                }
            } else {
                let err = dz / 2;
                while (z !== camIndexes.z) {
                    this.hoveredTiles.push({ x, z });
                    err -= dx;
                    if (err < 0) {
                        x += sx;
                        err += dz;
                    }
                    z += sz;
                }
            }

            this.hoveredTiles.push(camIndexes);

            this.hoveredTiles.forEach(tileCoords => {
                const tile = this.tiles.children.find(tile => tile.index.x === tileCoords.x && tile.index.z === tileCoords.z);
                tile.material.color.set(0xff0000);
            });

            return camIndexes;
        } catch (error) {
            return { x: -1, z: -1 };
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