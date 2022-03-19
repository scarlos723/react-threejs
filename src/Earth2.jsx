import React, { Suspense, useRef } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"

//images
import imgTexture from './images/2k_earth_nightmap.jpeg'
import orbitLetters from './images/OrbitLetters.png'


function Earth2(){

  const Scene = () =>{
    const containerRender = document.getElementById('render')
    const fov=60
    const aspect = containerRender.clientWidth/containerRender.clientHeight //window.innerWidth/window.innerHeight
    const near = 0.1
    const far =1000
    const colorMap = useLoader(TextureLoader,imgTexture)
    const colorMap2 = useLoader(TextureLoader, orbitLetters)
    const ref = useRef()
    const ref2 = useRef()
    useFrame(()=>{
      ref.current.rotation.y -=0.002
      ref2.current.rotation.y -=0.002
    })
    return(
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 1]} intensity={1}/>
      <PerspectiveCamera manual args={[fov, aspect, near ,far]} >
        <mesh ref={ref} >
          <sphereBufferGeometry args={[3,32,32]} />
          <meshPhongMaterial 
              roughness={1}
              metalness={0}
              transparent={1}
              map={colorMap}
          />
          
          
        </mesh>
        <mesh ref={ref2}>
        <sphereBufferGeometry args={[3.5,32,32]} />
          <meshPhongMaterial 
              roughness={1}
              metalness={0}
              transparent={1}
              map={colorMap2}
          />
        </mesh>
        
      </PerspectiveCamera>
    </>)
  }
  return(
    <div id="render"> 
      <Canvas camera={{position:[5, 3, 1]}}>
        
        <Suspense fallback='null'> 
          <Scene/>
        </Suspense>
        
      </Canvas>
    </div>
  )
}

export default Earth2