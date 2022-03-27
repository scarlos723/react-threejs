import { Component } from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import  imgTierra from './images/world_topo_nasa.jpg'
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import OrbitLetters from './images/OrbitLetters.png'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

let scene,camera,renderer, controls, sphere, ribbon
const curveHandles = [];

class SphereHdr extends Component{

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
    
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    //camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,1000);
    camera =  new THREE.PerspectiveCamera (fov, aspect, near ,far)
    //camera.position.set(0,0,500);
    camera.position.set(5,0.5,4)
    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate=true
    controls.autoRotateSpeed=3
    controls.enableDamping=false
    controls.enableZoom=false
    controls.enableRotate=false
    
    const ambientLight =  new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    let pointlight = new THREE.PointLight(0xffffff, 1);
    pointlight.position.set(200, 200, 200);
    scene.add(pointlight);

    let envmaploader = new THREE.PMREMGenerator(renderer)

    let reflection = new RGBELoader().setPath('images/').load('imgHDR2.hdr', function(hdrmap){
      let envmap = envmaploader.fromCubemap(hdrmap)
      let texture = new THREE.CanvasTexture(new FlakesTexture());
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      //repeat the wrapping 10 (x) and 6 (y) times
      texture.repeat.x = 10;
      texture.repeat.y = 10;
  
      const ballMaterial = {
        clearcoat: 0.2,
        cleacoatRoughness:0.01,
        metalness: 1,
        roughness:0.12,
        color: 0xffffff,
        map: new THREE.TextureLoader().load(imgTierra),
        //normalMap: texture,
        normalScale: new THREE.Vector2(0.15,0.15),
        envMap:envmap.texture,
      
      };
      console.log(envmap)
      //let ballGeo = new THREE.SphereGeometry(100,64,64);
      let ballGeo = new THREE.SphereGeometry(1.2, 64,64 );
      let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);
      sphere = new THREE.Mesh(ballGeo,ballMat);
      scene.position.set(0, 0, 0)
      scene.add(sphere);
      

      const ribbonCurve = {
        geometry: new THREE.SphereBufferGeometry(1.5, 32, 32),
        material: new THREE.MeshPhongMaterial({
          roughness: 1,
          metalness: 1,
          transparent: 1,
          map: new THREE.TextureLoader().load(OrbitLetters),
  
          //side: THREE.DoubleSide,
        
          depthTest: false
        })
        }
        // add mesh
        ribbon = new THREE.Mesh(ribbonCurve.geometry, ribbonCurve.material)
        ribbon.position.set(0, 0, 0)
        scene.add(ribbon)

      
    })
  
    

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

export default SphereHdr;
