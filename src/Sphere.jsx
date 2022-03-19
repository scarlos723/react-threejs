import { Component } from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import  imgTierra from './images/world_topo_nasa.jpg'
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

let scene,camera,renderer, controls

class Sphere extends Component{

  constructor(props){
    super(props);
    this.animate = this.animate.bind(this)
  }
  
  init() {
    const containerRender = document.getElementById('appSphere')
    const fov=60
    const aspect = containerRender.clientWidth/containerRender.clientHeight //window.innerWidth/window.innerHeight
    const near = 0.1
    const far =1000
    
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
    
    //renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setSize(containerRender.clientWidth, containerRender.clientHeight)
    //document.body.appendChild(renderer.domElement);
    renderer.outputEncoding = THREE.sRGBEncoding
    // renderer.toneMapping = THREE.ACESFilmicToneMapping
    //camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,1000);
    camera =  new THREE.PerspectiveCamera (fov, aspect, near ,far)
    //camera.position.set(0,0,500);
    camera.position.set(1.5,0.5,2)
    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate=true
    controls.autoRotateSpeed=3
    controls.enableDamping=true

    const ambientLight =  new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    let pointlight = new THREE.PointLight(0xffffff,1);
    //pointlight.position.set(200,200,200);
    pointlight.position.set(5, 3, 1)
    scene.add(pointlight);

    // let envmaploader = new THREE.PMREMGenerator(renderer)
    // new RGBELoader().setPath('images/').load('file.hdr', function(hdrmap){
    //   let envmap = envmaploader.fromCubemap(hdrmap)
      let texture = new THREE.CanvasTexture(new FlakesTexture());
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      //repeat the wrapping 10 (x) and 6 (y) times
      texture.repeat.x = 10;
      texture.repeat.y = 10;
  
      const ballMaterial = {
        // clearcoat: 1.0,
        // cleacoatRoughness:0.1,
        // metalness: 0.9,
        // roughness:0.7,
        // color: 0xffffff,
        // normalMap: texture,
        // normalScale: new THREE.Vector2(0.15,0.15),
        //map:  new THREE.TextureLoader().load(imgTierra),
        vertexShader,
        fragmentShader
      };
      console.log(vertexShader)
      //let ballGeo = new THREE.SphereGeometry(100,64,64);
      let ballGeo = new THREE.SphereGeometry(0.5, 64,64 );
      let ballMat = new THREE.ShaderMaterial(ballMaterial);
      let ballMesh = new THREE.Mesh(ballGeo,ballMat);
      scene.add(ballMesh);

    // })
   

    return renderer.domElement
  }

  // animation
  animate(){
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(this.animate);
  }

  componentDidMount(){
    document.getElementById("appSphere").appendChild(this.init())
    this.animate()
  }
  


  render(){
    return (
      <div  id='appSphere'>

      </div>
    );
  }
}

export default Sphere;
