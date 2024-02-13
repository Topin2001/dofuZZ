import { Component } from "react";
import * as THREE from "three";
import { TILE_SIZE, BOARD_SIZE } from "./Board";
import { hoverModes, hoverAreas, hoverRotationDirections } from "./Player";

class Ship extends Component {
    constructor(props) {
        super(props);
        this.name = props.name;
        this.isSetup = false;
        this.occupiedTiles = [];
        this.position = { x: 0, y: 0, z: 0 };
        this.dimensions = props.dimensions;
        this.modelSrc = props.modelSrc;
        this.textureSrc = props.textureSrc;
        this.model = null;
        this.rotation = 0;
        this.index = props.index;
    }

    loadModel(loader, modelSettings, hoverRotation, modelsList) {
        loader.load(this.modelSrc, (object) => {
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( this.textureSrc ) } );
                    child.material.transparent = true;
                    child.material.opacity = 0.3;
                }
            });
            object.name = this.name;
            object.scale.set(modelSettings.scale[0], modelSettings.scale[1], modelSettings.scale[2]);
            object.position.set(modelSettings.offset[hoverRotation][0] * TILE_SIZE, modelSettings.offset[hoverRotation][1] * TILE_SIZE, modelSettings.offset[hoverRotation][2] * TILE_SIZE);
            object.rotation.set(modelSettings.rotation[0], modelSettings.rotation[1], modelSettings.rotation[2]);
            modelsList.add(object);
            this.model = object;
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }
        , (error) => {
            console.log('An error happened');
            console.log(error);
        });
    }

    // putOnTile(tileX, tileZ, hoverRotation) {
    //     this.position.x = tileX;
    //     console.log(tileX);
    //     this.position.z = tileZ;
    //     this.rotation = hoverRotation;
    //     this.occupiedTiles = this.getOccupiedTiles();
    //     this.isSetup = true;
    // }

    getOccupiedTiles() {
        let tiles = [];
        let originTile = {x: this.position.x, z: this.position.z};
        let tileX;
        let tileZ;
        for (let i = 0; i < this.dimensions.x; i++) {
            for (let j = 0; j < this.dimensions.y; j++) {
                if (this.rotation % 2 === 0) {
                    tileX = originTile.x + hoverRotationDirections[this.rotation].x * i;
                    tileZ = originTile.z + hoverRotationDirections[this.rotation].y * j;
                } else {
                    tileX = originTile.x + hoverRotationDirections[this.rotation].y * j;
                    tileZ = originTile.z + hoverRotationDirections[this.rotation].x * i;
                }
                if ( tileX >= BOARD_SIZE || tileX < 0 || tileZ < 0 || tileZ >= BOARD_SIZE ) throw new Error("Cannot place ship here");
                tiles.push({x: tileX, z: tileZ});
            }
        }
        return tiles;
    }
}

export default Ship;