import React, { useEffect, useState } from "react";
import { Block } from "../App";
import { aroundToFive } from "../helpers";

interface Props extends Block {
    blocks: Block[]
    setBlocks(arg: Block[]): void
    current: Block | null
    setCurrent(arg: Block | null): void
}

function findProectionBlock(id: number, y: number, x: number, w: number, h: number, blocks: Block[]) {
    const intersections: Block[] = []
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        if (block.id !== id) {
            const termXStart = block.x
            const termXEnd = block.x + block.w
            const termYEnd = block.y + block.h
            const curXEnd = x + w
            const curXStart = x
            const termYStart = block.y

            const intersectionX =
                (curXStart > termXStart && curXStart < termXEnd) ||
                (curXEnd > termXStart && curXEnd < termXEnd) ||
                (curXStart - termXStart <= 0 && curXEnd - termXEnd >= 0)


            if (intersectionX && termYEnd > y && termYStart - h - 5 > 0) {
                intersections.push({ ...block, y: termYStart - h - 5 })
            } else { intersections.push({ ...block }) }
        } else { intersections.push({ ...block }) }
    }


    return intersections
}
function blockShift(current: number, y: number, x: number, w: number, h: number, blocks: Block[], hC: number) {
    const intersections: Block[] = []

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        if (block.id !== current) {
            const termXStart = block.x
            const termXEnd = block.x + block.w
            const termYEnd = block.y + block.h
            const curXEnd = x + w
            const curXStart = x
            const termYStart = block.y

            const intersectionX =
                (curXStart > termXStart && curXStart < termXEnd) ||
                (curXEnd > termXStart && curXEnd < termXEnd) ||
                (curXStart - termXStart <= 0 && curXEnd - termXEnd >= 0)


            if (intersectionX && termYEnd >= y) {
                intersections.push({ ...block, y: termYStart + hC + 5 })
            } else { intersections.push({ ...block }) }
        } else {
            intersections.push({ ...block })
        }
    }


    return intersections
}

function findFreeY(id: number, y: number, x: number, w: number, h: number, blocks: Block[]) {
    let minY = 0
    let maxY = y + h
    let topBlock = 0

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        if (block.id !== id) {
            const termYStart = block.y
            const termXStart = block.x
            const termXEnd = block.x + block.w
            const termYEnd = block.y + block.h
            const curXEnd = x + w
            const curXStart = x

            const intersectionX =
                (curXStart > termXStart && curXStart < termXEnd) ||
                (curXEnd > termXStart && curXEnd < termXEnd) ||
                (curXStart - termXStart <= 0 && curXEnd - termXEnd >= 0)

            if (intersectionX && minY <= termYEnd && maxY > termYStart) {
                minY = termYEnd + 5
            }
        }
    }
    return minY
}

// function findFreeX(id: number, y: number, x: number, w: number, h: number, blocks: Block[]) {
//     let minX = 0
//     let topBlock = 0

//     for (let i = 0; i < blocks.length; i++) {
//         const block = blocks[i]

//         if (block.id !== id) {
//             const termXEnd = block.x + block.w
//             const termYStart = block.y
//             const termYEnd = block.y + block.h
//             const curYEnd = y + h
//             const curYStart = y


//             const intersectionX =
//                 curYStart > termYStart && curYStart < termYEnd ||
//                 curYEnd > termYStart && curYEnd < termYEnd ||
//                 curYStart - termYStart <= 0 && curYEnd - termYEnd >= 0


//             if (intersectionX) {
//                 if (minX < termXEnd) {
//                     minX = termXEnd + 5
//                 }
//             }
//         }
//     }
//     if (blocks[topBlock].id === id) {

//     }
//     return minX
// }

function DraggbleBlock({ w, h, x, y, blocks, setBlocks, id, current, setCurrent }: Props) {
    const [axisX, setAxisX] = useState(x)
    const [axisY, setAxisY] = useState(y)
    const [correctX, setCorrectX] = useState(x)
    const [correctY, setCorrectY] = useState(y)
    const [isDrag, setIsDrag] = useState(false)
    const [width, setWidth] = useState(w)
    const [height, setHeight] = useState(h)
    const [isDrod, setIsDrod] = useState(false)

    useEffect(() => {

        findY()
        save()

    }, [axisY])


    const onDragEnd = (event: React.DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
        const xC = event.clientX - correctX
        const yC = event.clientY - correctY
        setAxisY(yC)
        setAxisX(xC)
        setIsDrag(false)
        setIsDrod(false)


    }
    const onDragOver = (event: React.DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
        if (isDrod) {
            setCurrent({ x: axisX, y, w: width, h: height, id })

        }
        if (!isDrod) {
            console.log('x');

            const blo = blockShift(current!.id, axisY, axisX, width, height, blocks, current!.h)
            setBlocks(blo)
        }



    }

    const onDrag = (event: React.DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDrag(true)

    }

    const onDragStart = (event: React.DragEvent) => {
        event.stopPropagation()
        setCorrectX(event.clientX - axisX)
        setCorrectY(event.clientY - axisY)
        setIsDrod(true)
        let newBlocks = (findProectionBlock(id, axisY, axisX, width, height, blocks));
        setBlocks(newBlocks)


    }

    const onClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()

        setWidth(aroundToFive(event.currentTarget.offsetWidth))
        setHeight(aroundToFive(event.currentTarget.offsetHeight))
    }


    const findY = () => {
        const nY = axisY
        const nX = axisX

        const minY = findFreeY(id, nY, nX, width, height, blocks)
        setAxisY(minY)

    }

    const save = () => {
        const newBlocks = blocks.filter((block) => block.id !== id)
        newBlocks.push({ x: axisX, y: axisY, id, h: height, w: width })

        setBlocks(newBlocks)
    }


    return (<div
        draggable={true}
        onDrag={onDrag}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={onClickHandler}
        onDragEnter={onDragOver}
        data-id={id}
        style={{
            zIndex: isDrod ? 1000 : 'unset',
            transform: `translate(${axisX}px, ${y}px)`,
            display: isDrag ? 'none' : 'block',
            width, height
        }} className='draggble'>
        <div className="container">
            <p style={{ color: 'white' }}>{id}</p>
        </div>
    </div>);
}

export default DraggbleBlock;