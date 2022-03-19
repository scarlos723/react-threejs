import React from "react"
import './App.css'
import Earth from "./Earth"
import Sphere from "./Sphere"
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
          <Sphere />
        </div>
        
      </div>
    </>
  ) 
}

export default App