import { Component } from 'react';
import * as THREE from 'three';

const hoverModes = {
    NONE: 0,
    MicroRecon: 1,
    Warship: 2,
    GalactixRacer: 3,
    RedFighter: 4
}

const hoverAreas = [
    { x: 0, y: 0 },
    { x: 2, y: 1 },
    { x: 3, y: 2 },
    { x: 3, y: 1 },
    { x: 4, y: 2 }
];

const hoverRotationDirections = [
    { x: 1, y: 1 },
    { x: 1, y: 1 },
    // { x: -1, y: 1 },
    // { x: -1, y: -1 }
];

const modes = {
    ATTACK: 0,
    SETUP: 1
}




class Player extends Component {
    constructor(props) {
        super(props);
        this.position = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.hoverMode = hoverModes.MicroRecon;
        this.hoverRotation = 0;
        this.mode = modes.SETUP;
        this.ships = [];
    }

    update( deltaTime ) {
        let damping = Math.exp( - 4 * deltaTime ) - 1;

        this.velocity.addScaledVector( this.velocity, damping );

        const deltaPosition = this.velocity.clone().multiplyScalar( deltaTime * 10 );
        this.position = this.position.add( deltaPosition );

        this.props.camera.position.copy( this.position );

    }

    getForwardVector() {
        this.props.camera.getWorldDirection( this.direction );
        this.direction.y = 0;
        this.direction.normalize();

        return this.direction;
    }

    getSideVector() {
        this.props.camera.getWorldDirection( this.direction );
        this.direction.y = 0;
        this.direction.normalize();
        this.direction.cross( this.props.camera.up );

        return this.direction;

    }

    tpUnsetShips(noMoveShipIndex) {
        this.ships.forEach( (ship) => {
            if ( !ship.isSetup && ship.index !== noMoveShipIndex ) {
                console.log(ship.index);
                ship.model.position.set( -1000, 0, -1000 );
                ship.position.x = -1000;
                ship.position.z = -1000;
            }
        } );
    }

    render() {
        return null;
    }
}

export default Player;
export { hoverModes, hoverAreas, hoverRotationDirections };