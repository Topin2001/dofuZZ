import { Component } from 'react';
import * as THREE from 'three';

class Camera extends Component {
    constructor(props) {
        super(props);
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.rotation.order = 'YXZ';
        this.camera.position.z = 500;
        this.raycaster = new THREE.Raycaster();
    }

    render() {
        return null;
    }
}

export default Camera;