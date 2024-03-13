import { Component } from 'react';
import * as THREE from 'three';


const modes = {
    ATTACK: 0,
    MOVE: 1
}




class Player extends Component {
    constructor(props) {
        super(props);
        this.position = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.mode = modes.MOVE;
        this.actionType = 1;
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

    render() {
        return null;
    }
}

export default Player;