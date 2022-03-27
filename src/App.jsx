import React from "react"
import './App.css'
import Earth from "./components/Earth"
import Earth3 from "./components/Earth3"
import Sphere from "./components/Sphere"
import SphereHdr from "./components/SphereHdr"
const App = ()=>{
  
  return(
    <>
      <div className="grid">
        <div>
          <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique quidem non error dignissimos velit veritatis perferendis neque quae facere aspernatur modi labore adipisci facilis quo totam, aliquid, fugit quibusdam qui?
          </p>
        </div>
        <div> 
          <SphereHdr/>
        </div>
        
      </div>
    </>
  ) 
}

export default App