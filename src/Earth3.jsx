import { Component } from 'react';
import * as THREE from 'three';
import { AlwaysDepth, MeshBasicMaterial } from 'three';
//import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import mapTexture from './images/world_topo_nasa.jpg'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import logoFC from './images/FCTextLogo.png'
import OrbitLetters from './images/OrbitLetters.png'
import { sRGBEncoding } from 'three';
//import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
//import {FlakesTexture} from 'three/examples/jsm/textures/FlakesTexture.js'
let scene,camera,renderer,sphere, flow //, controls
const curveHandles = [];
const greenColor = 0x004d23

class Earth3 extends Component{
  constructor(props){
    super(props);
    this.animate = this.animate.bind(this)
  }
calcPoints(){
    const amplitude =0.9
    const part =(2*Math.PI)/8
    const points =[]
    for ( let i= 0 ; i<8; i++){
      let x =  amplitude*Math.cos(i*part)
      let z = amplitude*Math.sin(i*part)
      points.push({x:x,y:0,z:z})
    }
    return points
  }
init(){
  const containerRender = document.getElementById('render')
  const fov=60
  const aspect = containerRender.clientWidth/containerRender.clientHeight //window.innerWidth/window.innerHeight
  const near = 0.1
  const far =1000
  
  //creating scene
  scene = new THREE.Scene();
  //scene.background = new THREE.Color(0x0000000);
  //renderer
  renderer = new THREE.WebGLRenderer({
    alpha:true,
    antialias:true
  })
  renderer.setSize(containerRender.clientWidth, containerRender.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio) 
  renderer.outputEncoding = THREE.sRGBEncoding

  //texture
  

  //add geometry
  var geometry = new THREE.SphereGeometry(0.6, 32, 32 );
  var material = new THREE.MeshPhongMaterial({ 
    specular:0x3d3d3d,
    roughness:0.5,
    metalness:0.5,
    map: new THREE.TextureLoader().load(mapTexture)
  });
  sphere = new THREE.Mesh(geometry, material);

  scene.add(sphere);

  //Ambient light
  const ambientLight =  new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(5, 3, 1) //x,y,z
  scene.add(pointLight)

  // add ribbon
  const ribbonCurve = {
      geometry: new THREE.SphereBufferGeometry(0.9, 32, 32),
      material: new THREE.MeshPhongMaterial({
        roughness: 1,
        metalness: 0,
        transparent: 1,
        map: THREE.ImageUtils.loadTexture(OrbitLetters),

        side: THREE.DoubleSide,
      
        depthTest: false
      })
  }
   // add mesh
  const mesh = new THREE.Mesh(ribbonCurve.geometry, ribbonCurve.material)
  mesh.position.set(0, 0, 0)
  scene.add(mesh)

  //Camera
  camera =  new THREE.PerspectiveCamera (fov, aspect, near ,far)
  camera.position.set(1.5,0.5,2)
  camera.lookAt( scene.position );
  scene.add(camera)

  //Controls
  // controls = new OrbitControls(camera, renderer.domElement)
  // controls.autoRotate=true
  // controls.autoRoteteSpeed=0.7
  // controls.enableDamping = true

  return renderer.domElement

}
// animation
animate(){
  requestAnimationFrame(this.animate);
  sphere.rotation.y -= 0.0035;
  renderer.render(scene, camera);
  
  if ( flow ) {
    flow.moveAlongCurve( 0.001 );
  }
}

componentDidMount(){
  document.getElementById("render").appendChild(this.init())
  this.animate()
}


render(){
  
  return (
    <div  id='render'>
    </div>
  );
}
}

export default Earth3;
