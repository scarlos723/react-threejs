import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// import OrbitLetters from '../images/OrbitLetters.png'
import imgTierra from '../images/world_topo_nasa.jpg'

// const curveHandles = []

const NewEarth = () => {
  const refCanvas = useRef(null)

  useEffect(() => {
    const width = refCanvas.current.clientWidth
    const height = refCanvas.current.clientHeight
    const fov = 60
    const aspect = width / height // window.innerWidth/window.innerHeight
    const near = 0.1
    const far = 1000

    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    // renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setSize(width, height)
    // document.body.appendChild(renderer.domElement);

    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    refCanvas.current.appendChild(renderer.domElement)
    
    // camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,1000);
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    // camera.position.set(0,0,500);
    camera.position.set(5, 0.5, 4)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true
    controls.autoRotateSpeed = 3
    controls.enableDamping = false
    controls.enableZoom = false
    controls.enableRotate = false

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointlight = new THREE.PointLight(0xffffff, 1)
    pointlight.position.set(200, 200, 200)
    scene.add(pointlight)

    const envmaploader = new THREE.PMREMGenerator(renderer)

    new RGBELoader().setPath('images/').load('imgHDR2.hdr', function (hdrmap) {
      const envmap = envmaploader.fromCubemap(hdrmap)
      const texture = new THREE.CanvasTexture(new FlakesTexture())
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      // repeat the wrapping 10 (x) and 6 (y) times
      texture.repeat.x = 10
      texture.repeat.y = 10

      const ballMaterial = {
        clearcoat: 0.2,
        // cleacoatRoughness: 0.01,
        metalness: 1,
        roughness: 0.12,
        color: 0xffffff,
        map: new THREE.TextureLoader().load(imgTierra),
        // normalMap: texture,
        normalScale: new THREE.Vector2(0.15, 0.15),
        envMap: envmap.texture

      }
      console.log(envmap)
      // let ballGeo = new THREE.SphereGeometry(100,64,64);
      const ballGeo = new THREE.SphereGeometry(1.2, 64, 64)
      const ballMat = new THREE.MeshPhysicalMaterial(ballMaterial)
      const sphere = new THREE.Mesh(ballGeo, ballMat)
      scene.position.set(0, 0, 0)
      scene.add(sphere)
    })

    // animation
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()
  }, [])

  return (
    <div ref={refCanvas} style={{ width: 700, height: 700 }}/>
  )
}

export default NewEarth
