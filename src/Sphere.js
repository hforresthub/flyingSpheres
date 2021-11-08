import React, { useRef, useState } from 'react'
import useKeypress from 'react-use-keypress'
import { useFrame } from '@react-three/fiber'
import realtime from './firebase'
import { ref, set } from 'firebase/database'

function Sphere(props) {
	// This reference gives us direct access to the THREE.Mesh object
	const currentSphere = useRef()
	// Hold state for hovered and clicked events
	const [hover, setHover] = useState(false)
	const [click, setClick] = useState(Math.floor(Math.random() * 5))
	// const [destination, setDestination] = useState({x: props.x, y: props.y, z: props.z})
	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => {
		// instead of setting location from key presses or props, gotten from firebase, use those as goal location, with state for location, and useFrames to move towards that location

	})
	useKeypress(['w', 'a', 's','d', ' ', 'c'], (event) => {
		// event.preventDefault()
		const speed = 0.1
		if (props.currentUserTrue) {
			if (event.key === 'a') {
				currentSphere.current.rotation.y += 1 * speed
			} else if (event.key === 'd') {
				currentSphere.current.rotation.y -= 1 * speed
			}
			if (event.key === 'w') {
				currentSphere.current.position.z -= 1 * speed * Math.cos(currentSphere.current.rotation.y)
				currentSphere.current.position.x -= 1 * speed * Math.sin(currentSphere.current.rotation.y)
			} else if (event.key === 's') {
				currentSphere.current.position.z += 1 * speed * Math.cos(currentSphere.current.rotation.y)
				currentSphere.current.position.x += 1 * speed * Math.sin(currentSphere.current.rotation.y)
			}
			if (event.key === ' ') {
				currentSphere.current.position.y += 1 * speed
			} else if (event.key === 'c') {
				currentSphere.current.position.y -= 1 * speed
			}
		}

		// bounding
		const boundSize = 13
		if (currentSphere.current.position.x > boundSize) {
			currentSphere.current.position.x = -1 * boundSize
		}
		if (currentSphere.current.position.x < -1 * boundSize) {
			currentSphere.current.position.x = boundSize
		}
		if (currentSphere.current.position.y > boundSize * 0.25) {
			currentSphere.current.position.y = -0.25 * boundSize
		}
		if (currentSphere.current.position.y < -0.25 * boundSize) {
			currentSphere.current.position.y = boundSize * 0.25
		}
		if (currentSphere.current.position.z > boundSize) {
			currentSphere.current.position.z = -boundSize
		}
		if (currentSphere.current.position.z < -1 * boundSize) {
			currentSphere.current.position.z = boundSize
		}

		//update player location to database
		if (props.currentUserTrue) {
			const databaseRef = ref(realtime, `/users/${props.currentUser}`)
			set(databaseRef, { x: currentSphere.current.position.x, y: currentSphere.current.position.y, z: currentSphere.current.position.z, color: currentSphere.current.color })
		}

		//update camera location to players
		if (props.currentUserTrue) {
			// props.cameraPos({x: currentSphere.current.position.x, y: currentSphere.current.position.y, z: currentSphere.current.position.z})
			props.cameraPos({x: currentSphere.current.position.x + 1 * Math.sin(currentSphere.current.rotation.y), 
				y: currentSphere.current.position.y + 0.05, 
				z: currentSphere.current.position.z + 1 * Math.cos(currentSphere.current.rotation.y)})
			props.cameraRot({x: currentSphere.current.rotation.x, y: currentSphere.current.rotation.y, z: currentSphere.current.rotation.z})
			
		}

	})
	// Return the view, these are regular Threejs elements expressed in JSX
	return (
		<mesh
			{...props}
			ref={currentSphere}
			scale={click ? 0.1 : 0.1}
			onClick={(event) => {
				// set this one to current
				props.setColor(props.color)
				props.setUser(props.name)
				setClick(1)
			}}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}>
			<sphereGeometry args={[1, 5, 5]} />
			<meshStandardMaterial color={hover ? 'blue' : props.color} />
		</mesh>
	)
}

export default Sphere