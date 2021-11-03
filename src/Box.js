import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

function Box(props) {
	// This reference gives us direct access to the THREE.Mesh object
	const ref = useRef()
	// Hold state for hovered and clicked events
	const [hovered, hover] = useState(false)
	const [clicked, click] = useState((Math.random() > 0.5))
	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => {
		ref.current.rotation.x += 0.01
		ref.current.rotation.y += 0.001
		if (clicked) {
			ref.current.position.z += 0.1
		} else {
			ref.current.position.z -= 0.1
		}
		if (ref.current.position.z > 0) {
			ref.current.position.z = -100
		}
		if (ref.current.position.z < -100) {
			ref.current.position.z = 0
		}
	})
	// Return the view, these are regular Threejs elements expressed in JSX
	return (
		<mesh
			{...props}
			ref={ref}
			scale={clicked ? 0.5 : 1}
			onClick={(event) => click(!clicked)}
			onPointerOver={(event) => hover(true)}
			onPointerOut={(event) => hover(false)}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered || clicked ? 'green' : 'grey'} />
		</mesh>
	)
}

export default Box