import React, { useState } from 'react';
import './App.css'
import DraggbleBlock from './Components/DraggbleBlock';



export interface Block {
  w: number;
  h: number;
  x: number;
  y: number;
  id: number;
}

function App() {
  const [current, setCurrent] = useState<Block | null>(null)
  const [blocks, setBlocks] = useState([
    { x: 0, y: 0, w: 200, h: 200, id: 1 },
    { x: 210, y: 0, w: 200, h: 100, id: 2 },
    { x: 630, y: 0, w: 200, h: 100, id: 3 },
  ])

  return (
    <div className="wrapper"    >
      {blocks.map(({ x, y, w, h, id }: Block) => {
        return <DraggbleBlock key={id} {...{ id, x, y, w, h, blocks, setBlocks, current, setCurrent }} />
      })}
    </div >
  );
}

export default App;