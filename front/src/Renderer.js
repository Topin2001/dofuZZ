import * as THREE from 'three';

function Renderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    console.log(renderer);
    document.body.appendChild(renderer.domElement);
    return renderer;
}

export default Renderer;