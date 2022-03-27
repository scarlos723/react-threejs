import { Component } from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import  imgTierra from './images/world_topo_nasa.jpg'
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

let scene,camera,renderer, controls
const curveHandles = [];

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
    camera.position.set(1.5,0.5,4)
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
        clearcoat: 1.0,
        cleacoatRoughness:0.1,
        metalness: 0.9,
        roughness:0.9,
        color: 0xffffff,
        normalMap: texture,
        normalScale: new THREE.Vector2(0.15,0.15),
        map:  new THREE.TextureLoader().load(imgTierra),
      
      };
      console.log(vertexShader)
      //let ballGeo = new THREE.SphereGeometry(100,64,64);
      let ballGeo = new THREE.SphereGeometry(1.2, 64,64 );
      let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);
      let ballMesh = new THREE.Mesh(ballGeo,ballMat);
      scene.add(ballMesh);

    // })
    //Add point

    let mesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.1,20,20),
      new THREE.MeshBasicMaterial({color:0x51d6a6})
    )
    let mesh2 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.1,20,20),
      new THREE.MeshBasicMaterial({color:0x51d6a6})
    )

    function convertToCartesian(p){
      let lat = (90 - p.lat) * (Math.PI/180)
      let lng = (180+ p.lgn)* (Math.PI/180)
      
      let x = 2 *  Math.cos(lng)*Math.cos(lat) 
      let y = 2 *  Math.sin(lng)*Math.cos(lat)
      let z = 2 *  Math.sin(lat)
      return{x,y,z}
    }
  
    let point ={
      lat:4.5708,
      lgn:-74.2973 
    }
    let point2 ={
      lat:19.432608,
      lgn:-99.133209 
    }
    let point3={
      lat:-22.908333,
      lgn:-43.196388
    }
    let pos1 = convertToCartesian(point2)
    let pos2 = convertToCartesian(point3)

    

    // function createCurvePath (start, end) {
    //   let start3 = new THREE.Vector3(start.x, start.y, start.z)
    //   let end3 = new THREE.Vector3(end.x, end.y, end.z)
    //   let pointsMiddle3 =[]
    //   for (let i = 0 ; i <0 ; i++){
    //     let p = new THREE.Vector3().lerpVectors(start3, end3, i/20)
    //     //p.normalize()
    //     pointsMiddle3.push(p)
    //     //console.log(p)
    //   }
    //   let path = new THREE.CatmullRomCurve3(pointsMiddle3)

    //   const geometry = new THREE.TubeGeometry(path, 0.01, 8 , false)
    //   const material = new THREE.MeshBasicMaterial({color:0x0000ff})
    //   const mesh = new THREE.Mesh(geometry, material)
    //   scene.add(mesh)
    // }

    // createCurvePath(pos1, pos2)
    //   var curveQuad = new THREE.QuadraticBezierCurve3(start3, pointsMiddle3, end3);
    //   //   var curveCubic = new THREE.CubicBezierCurve3(start3, start3_control, end3_control, end3);
  
    //   var cp = new THREE.CurvePath();
    //   cp.add(curveQuad);
    //   //cp.add(curveCubic);
    //   return cp;
    // }

    // var cp = createCurvePath(pos1, pos2);
    // var curvedLineMaterial =  new THREE.LineBasicMaterial({color: 0xFFFFAA, linewidth: 3});
    // var curvedLine = new THREE.Line(cp.createPointsGeometry(2), curvedLineMaterial);
    // scene.add(curvedLine);

   //let initialPoints = [pos1, pos2]


    // mesh.position.set(pos.x,pos.y,pos.z)
    // mesh2.position.set(pos2.x,pos2.y,pos2.z)
    // scene.add(mesh)
    // scene.add(mesh2)

    // function getCurve(p1,p2){
    //   let v1 = new THREE.Vector3(p1.x, p1.y, p1.z)
    //   let v2 = new THREE.Vector3(p2.x, p2.y, p2.z)
    //   let points =[]
    //   for (let i = 0 ; i <20 ; i++){
    //     let p = new THREE.Vector3().lerpVectors(v1,v2,i/20)
    //     p.normalize()
    //     points.push(p)
    //     //console.log(p)
    //   }
    // return points
    // }

  


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
