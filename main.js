import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three';

let mixer;
let actions = {};

const loader = new GLTFLoader();
let lastTime = performance.now();

let avatar;
const scene = new THREE.Scene();

loader.load('./models/Fox.glb', (gltf) => {
  console.log("Model loaded successfully");
  avatar = gltf.scene;
  avatar.scale.set(0.02, 0.02, 0.02);
  avatar.position.set(0,0,0);
  scene.add(avatar);

  //Setup animation system
  mixer = new AnimationMixer(avatar);
  console.log("Animations found:", gltf.animations);
  gltf.animations.forEach((clip) => {
    console.log("Clip:", clip.name);
    actions[clip.name] = mixer.clipAction(clip);
  });
  if (gltf.animations.length > 0) {
    actions[gltf.animations[0].name].play();
  }
  
},
(progress) => {
    console.log("Loading:", progress.loaded);
  },
  (error) => {
    console.error("GLTF Load error:", error);
  }, 
);


const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.lookAt(0,0,0);
//State
let speed = 0.01;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5,);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

//APPLY ACTIONS FROM FASTAPI
function applyActions(actions) {
    actions.forEach(action => {
        switch(action.type) {
            case "facial_expression":
              setExpression(action.value);
              break;

            case "color":
              if(!avatar) return;

              avatar.traverse(child => {
                if (child.isMesh) {
                  child.material.color.setHex(action.value);
                }
              });
              break;

            case "animation":
              playAnimation(action.value);
              break;
            case "speech":
              speak(action.value, action.emotion || "neutral");
              break;

                
        }
    });
}

function animate() {
  requestAnimationFrame(animate);
  if (avatar) {
    avatar.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}

//Facial Control
function setExpression(expression) {
  if (!avatar) return;

  avatar.traverse((child) => {
    if (child.isMesh && child.morphTargetDictionary) {
      const dict = child.morphTargetDictionary;
      const influences = child.morphTargetInfluences;

      //Reset all expressions
      for (let i = 0; i<influences.length; i++) {
        influences[i] = 0;
      }
      // Map expressions
      if (expression == "angry " && dict["Angry"]) {
        influences[dict["Angry"]] = 1;
      }
      if (expression=="surprised" && dict["surprised"]) {
        influences[dict["Surprised"]] = 1;
      }
    }

  })
}

function playAnimation(name) {
  if (!actions[name]) {
    console.warn("Animation not found:", name);
    return;
  }

  //Stop all animations
  Object.values(actions).forEach(action => action.stop());
  //Play all selected animation
  actions[name].reset().play();
}


//Emotion-aware Voice Output
function speak(text, emotion="neutral") {
  const utterance = new SpeechSynthesisUtterance(text);

  //Emotion -> voice mapping
  switch(emotion) {
    case "excited":
      utterance.rate = 1.2;
      utterance.pitch = 1.5;
      break;
    case "happy":
      utterance.rate = 1.0;
      utterance.pitch = 1.2;
      break;
    case "sad":
      utterance.rate = 0.8;
      utterance.pitch = 0.7;
  }
  speechSynthesis.speak(utterance);
} 

animate();
const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition);
recognition.continuous = true;
recognition.lang = "en-US";

recognition.onresult = async (Event) => {
  const text = Event.results[0][0].transcript;
  const res = await fetch("http://localhost:8000/emotion", {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({input: text})
  });
  const data = await res.json();
  applyActions(data.actions);

};
recognition.start();

