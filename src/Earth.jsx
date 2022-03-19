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

class Earth extends Component{
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
  renderer.setPixelRatio(window.devicePixelRatio) // show texture better
  //renderer.setSize(window.innerWidth, window.innerHeight)
  //document.body.appendChild(renderer.domElement)
  renderer.outputEncoding = THREE.sRGBEncoding
  //texture



  let texture = new THREE.CanvasTexture(new FlakesTexture())
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT =THREE.RepeatWrapping
  texture.repeat.x =10
  texture.repeat.y=6


  //add geometry
  var geometry = new THREE.SphereGeometry(0.6, 32, 32 );

  //Add materia
  // var material = new THREE.MeshPhysicalMaterial(
  //   {
  //     clearcoat:1.0,
  //     color:0x24DB88,
  //     roughness:0.1,
  //     metalness:0.9,
  //     normalMap: texture,
  //     normalScale: new THREE.Vector2(0.15,0.15),
  //     map: THREE.TextureLoader.load(mapTexture)
  //   }
  // )
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

  const pointLight = new THREE.PointLight(0xffffff, 4)
  pointLight.position.set(5, 3, 1) //x,y,z
  scene.add(pointLight)


  //Camera
  camera =  new THREE.PerspectiveCamera (fov, aspect, near ,far)
  camera.position.set(1.5,0.5,2)

  camera.lookAt( scene.position );



  // Add points
  // const initialPoints = [
  //   { x: 1, y: 0, z: - 1 },
  //   { x: 1, y: 0, z: 1 },
  //   { x: - 1, y: 0, z: 1 },
  //   { x: - 1, y: 0, z: - 1 },
  // ];

  const initialPoints = this.calcPoints()

  const boxGeometry = new THREE.BoxGeometry( 0, 0, 0 );
  const boxMaterial = new THREE.MeshBasicMaterial();

  for ( const handlePos of initialPoints ) {

    const handle = new THREE.Mesh( boxGeometry, boxMaterial );
    handle.position.copy( handlePos );
    curveHandles.push( handle );
    scene.add( handle );

  }
  const curve = new THREE.CatmullRomCurve3(
    curveHandles.map( ( handle ) => handle.position )
  );
  curve.curveType = 'centripetal';
  curve.closed = true;

  const points = curve.getPoints( 50 );
  const line = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints( points ),
      new THREE.LineBasicMaterial( { transparent: true,
        opacity: 0 } )
  );

  scene.add( line );


  //load image
  
  

  //
  // const light = new THREE.DirectionalLight( greenColor );
  // light.position.set( - 10, 10, 10 );
  // light.intensity = 1.0;
  // scene.add( light );

  // const light2 = new THREE.AmbientLight( 0x003973 );
  // light2.intensity = 1.0;
  // scene.add( light2 );

  //

  const loader = new FontLoader();

  const text = 'Puto el que lo lea XD'
  loader.load( './fonts/helvetiker_regular.typeface.json', function (font) {

    const geometry = new TextGeometry( text, {
      font: font,
      size: 0.13,
      height: 0.01,
      curveSegments: 16,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.008,
      bevelOffset: 0,
      bevelSegments: 5,
    } );

    geometry.rotateX( Math.PI );
    geometry.rotateY( Math.PI );

    const material = new THREE.MeshStandardMaterial( {
      color: 0xDB8824, 
      roughness:0,
      fog:true,
      envMap:'bricks'
    } );

    const objectToCurve = new THREE.Mesh( geometry, material );

    flow = new Flow( objectToCurve );
    flow.updateCurve( 0, curve );
    scene.add( flow.object3D );

  } );

  //
  
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

export default Earth;
