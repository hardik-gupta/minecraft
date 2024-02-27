import './App.css';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stats, StatsGl } from '@react-three/drei';
import {Perf} from 'r3f-perf';
import World from './components/World';
import { Leva } from 'leva';

function App() {
  // const {gl} = useThree();
  // gl.sortObjects = false
  return (
    <>
      <Leva/>
      <Canvas camera={{fov: 75, position:[-32, 16, 32]}} onCreated={state => state.gl.setClearColor("#80a0e0")}>
        <ambientLight intensity={0.1}/>
        <directionalLight position={[1,1,1]}/>
        <directionalLight position={[-1, 1, 0.5]}/>
        <OrbitControls/>
        <Perf position='top-left'/>
        <World/>
        {/* <Boxes/> */}

        
      </Canvas>
    </>
  )
}

export default App
