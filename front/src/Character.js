import { Component } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class Character extends Component {

    constructor(props) {
        super(props);
        this.hitBox = new THREE.Mesh(new THREE.BoxGeometry(5, 10, 5), new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }));
        const loader = new GLTFLoader();

        this.x = this.props.position.x;
        this.z = this.props.position.z;

        this.runAction = null;
        this.idleAction = null;
        this.attackAction = null;

        loader.load(
            props.modelPath,
            (gltf) => {
                gltf.scene.scale.set(5, 5, 5);
                gltf.scene.position.set(0, 0, 0);
                this.props.scene.add(gltf.scene);
                this.gltf = gltf.scene;
                this.mixer = new THREE.AnimationMixer(this.gltf);

                if (props.modelPath === "Knight.glb" || props.modelPath === "Rogue_Hooded.glb") {
                    this.runAction = this.mixer.clipAction(gltf.animations[48]);
                    this.idleAction = this.mixer.clipAction(gltf.animations[36]);
                    console.log(this.idleAction);
                    this.idleAction.loop = THREE.LoopRepeat;
                    this.idleAction.timeScale = 3;
                    this.idleAction.play();
                    switch (props.modelPath) {
                        case "Knight.glb":
                            this.attackAction = this.mixer.clipAction(gltf.animations[0]);
                            this.attackAction.loop = THREE.LoopOnce;
                            this.attackAction.timeScale = 3;
                            break;
                        case "Rogue_Hooded.glb":
                            this.attackAction = this.mixer.clipAction(gltf.animations[17]);
                            this.attackAction.loop = THREE.LoopOnce;
                            this.attackAction.timeScale = 10;
                            break;
                    }

                    // hp bar
                    // const geometry = new THREE.PlaneGeometry(1, 0.1); needs to be proportional to the hp
                    const geometry = new THREE.PlaneGeometry(1 * this.hp / 100, 0.1);
                    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
                    const plane = new THREE.Mesh(geometry, material);
                    plane.position.set(0, 3, 0);
                    plane.name = "hpBar";
                }
                else {
                    // scale x2
                    gltf.scene.scale.set(2, 2, 2);

                    this.idleAction = this.mixer.clipAction(gltf.animations[36]);
                    this.idleAction.timeScale = 3;
                    this.idleAction.play();

                    this.runAction = this.mixer.clipAction(gltf.animations[48]);
                    this.attackAction.push(this.mixer.clipAction(gltf.animations[0]));

                    // hp bar
                    // const geometry = new THREE.PlaneGeometry(1, 0.1); needs to be proportional to the hp
                    const geometry = new THREE.PlaneGeometry(1 * this.hp / 100, 0.1);
                    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                    const plane = new THREE.Mesh(geometry, material);
                    plane.position.set(0, 3, 0);
                    plane.name = "hpBar";

                    // gltf.scene.add( this.hitBox );
                    this.hitBox.name = "hitBox";
                    this.props.scene.add( this.hitBox );

                    this.runAction.clampWhenFinished = true;
                    this.runAction.loop = THREE.LoopRepeat;
                    this.runAction.setDuration(0.1);
                    this.runAction.play();
                    gltf.scene.add(plane);
                }
            }
        );
    }

    moveToTile(x, z) {
        const targetX = x * 15; // Assuming 15 units per tile
        const targetZ = z * 15;
        const distance = Math.sqrt(Math.pow(targetX - this.gltf.position.x, 2) + Math.pow(targetZ - this.gltf.position.z, 2));
        const moveSpeed = 1; // Adjust as needed
    
        // Calculate the total number of steps to move
        const numSteps = Math.ceil(distance / moveSpeed);
        const stepX = (targetX - this.gltf.position.x) / numSteps;
        const stepZ = (targetZ - this.gltf.position.z) / numSteps;
    
        // Start moving in steps
        let stepCount = 0;
        const moveInterval = setInterval(() => {
            // Incrementally move towards the target
            this.gltf.position.x += stepX;
            this.gltf.position.z += stepZ;
            this.hitBox.position.copy(this.gltf.position); // Update hitbox position
    
            
            stepCount++;
            
            // Check if reached the target or exceeded the number of steps
            if (stepCount >= numSteps) {
                clearInterval(moveInterval); // Stop moving
                this.gltf.position.x = targetX; // Ensure the final position is exactly the target
                this.gltf.position.z = targetZ;
                this.hitBox.position.copy(this.gltf.position); // Update hitbox position
                this.idleAction?.play(); // Play idle animation
            }
        }, 16);
        
        this.x = x;
        this.z = z;
    }
    
    attackTile(targetedTile, attackType) {
        // Play attack animation
        console.log(this.attackAction);
        this.attackAction.reset();
        this.attackAction.play();
    
        // rotate towards the targeted tile
        const targetX = targetedTile.x * 15;
        const targetZ = targetedTile.z * 15;
        this.gltf.lookAt(targetX, this.gltf.position.y, targetZ);
    }


    // set z axis angle
    setYAxisAngle(yAxisAngle) {
        // this.gltf ? this.gltf.rotation.y = yAxisAngle : null;
        if (this.gltf) {
            this.gltf.rotation.y = yAxisAngle;
        }
    }
    
    setXAxisAngle(xAxisAngle) {
    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.props.scene.remove(this.gltf??null);
            // remove hitbox
            this.props.scene.remove(this.hitBox);
        }
        else {
            const hpBar = this.gltf?.getObjectByName("hpBar");
            hpBar.geometry = new THREE.PlaneGeometry(1 * this.hp / 100, 0.1);
        }
    }

    playAttackAnimation() {
        const randomAttack = Math.floor(Math.random() * this.attackAction.length);
        this.attackAction[randomAttack].reset();
        this.attackAction[randomAttack].play();
    }

    playRunAnimation() {
        // if animation is already playing, don't play it again
        if (this.runAction?.isRunning()) {
            return;
        }
        this.idleAction?.stop();
        this.runAction?.reset();
        this.runAction?.play();
    }
    
    stopRunAnimation() {
        this.runAction?.stop();
        // this.idleAction?.reset();
        this.idleAction?.play();
    }


    render() {
        return null;
    }
}
