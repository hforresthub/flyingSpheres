import React, { useRef, useState } from 'react'
import useKeypress from 'react-use-keypress'
import { useFrame } from '@react-three/fiber'
import realtime from './firebase'
import { ref, update } from 'firebase/database'
// import { useEffect } from 'react'

function Sphere(props) {
	// This reference gives us direct access to the THREE.Mesh object
	const currentSphere = useRef()
	// Hold state for hovered and clicked events
	const [hover, setHover] = useState(false)
	const [click, setClick] = useState(Math.floor(Math.random() * 5))
	// impulse forces
	const [rotForce, setRotForce] = useState({ x: 0, y: 0, z: 0 })
	const [posForce, setPosForce] = useState({ x: 0, y: 0, z: 0 })
	const [lastUpdateLocation, setLastUpdateLocation] = useState([0, 0, 0])
	// Subscribe this component to the render-loop, rotate the mesh every frame

	// apply any forces acquired from the database
	useFrame((state, delta) => {
		if (!(props.currentUserTrue)) {

		}
	})
	useFrame((state, delta) => {
		if (props.currentUserTrue) {
			// console.log(props);
			if (props.touched === 1) {
				setRotForce({ x: 0, y: rotForce.y + 1.2, z: 0 })
			} else if (props.touched === 2) {
				setRotForce({ x: 0, y: rotForce.y - 1.2, z: 0 })
			}
			if (props.touched === 3) {
				setPosForce({ x: posForce.x - Math.sin(currentSphere.current.rotation.y) * 5, y: posForce.y, z: posForce.z - Math.cos(currentSphere.current.rotation.y) * 5 })
				// console.log("testing yo", posForce.x - Math.sin(currentSphere.current.rotation.y) * 50);
				// currentSphere.current.position.z -= 1 * speed * Math.cos(currentSphere.current.rotation.y)
				// currentSphere.current.position.x -= 1 * speed * Math.sin(currentSphere.current.rotation.y)
			} else if (props.touched === 4) {
				setPosForce({ x: posForce.x + Math.sin(currentSphere.current.rotation.y), y: posForce.y, z: posForce.z + Math.cos(currentSphere.current.rotation.y) })
				// currentSphere.current.position.z += 1 * speed * Math.cos(currentSphere.current.rotation.y)
				// currentSphere.current.position.x += 1 * speed * Math.sin(currentSphere.current.rotation.y)
			}
			props.setTouched(0)
		}
	})
	useFrame((state, delta) => {
		// bounding
		// const boundSize = 13
		// if (currentSphere.current.position.x > boundSize) {
		// 	currentSphere.current.position.x = -1 * boundSize
		// }
		// if (currentSphere.current.position.x < -1 * boundSize) {
		// 	currentSphere.current.position.x = boundSize
		// }
		// if (currentSphere.current.position.y > boundSize * 0.25) {
		// 	currentSphere.current.position.y = -0.25 * boundSize
		// }
		// if (currentSphere.current.position.y < -0.25 * boundSize) {
		// 	currentSphere.current.position.y = boundSize * 0.25
		// }
		// if (currentSphere.current.position.z > boundSize) {
		// 	currentSphere.current.position.z = -boundSize
		// }
		// if (currentSphere.current.position.z < -1 * boundSize) {
		// 	currentSphere.current.position.z = boundSize
		// }
		// instead of setting location from key presses or props, gotten from firebase, use those as goal location, with state for location, and useFrames to move towards that location
		// if (currentSphere.current.rotation.y < fixation.y - rotSpeed * 10) {
		// 	currentSphere.current.rotation.y += 1 * rotSpeed * 2
		// 	// setFixation({ x: fixation.x, y: fixation.y - rotSpeed * 10, z: fixation.z })
		// } else if (currentSphere.current.rotation.y > fixation.y + rotSpeed * 10) {
		// 	currentSphere.current.rotation.y -= 1 * rotSpeed * 2
		// 	// setFixation({ x: fixation.x, y: fixation.y + rotSpeed * 10, z: fixation.z })
		// } else if (currentSphere.current.rotation.y < fixation.y - rotSpeed) {
		// 	currentSphere.current.rotation.y += 1 * rotSpeed
		// } else if (currentSphere.current.rotation.y > fixation.y + rotSpeed) {
		// 	currentSphere.current.rotation.y -= 1 * rotSpeed
		// } else {
		// 	currentSphere.current.rotation.y = currentSphere.current.rotation.y % (2 * Math.PI)
		// 	setFixation({ x: fixation.x, y: fixation.y % (2 * Math.PI), z: fixation.z })
		// }
		// console.log(rotForce);
		// const initialLocation = {x: currentSphere.current.position.x, y: currentSphere.current.position.y , z: currentSphere.current.position.z}

		const rotSpeed = 0.01
		if (rotForce.y > 1) {
			setRotForce({ x: 0, y: 1, z: 0 })
		} else if (rotForce.y < -1) {
			setRotForce({ x: 0, y: -1, z: 0 })
		}
		if (rotForce.y !== 0) {
			currentSphere.current.rotation.y += rotForce.y * rotSpeed
			currentSphere.current.rotation.y = currentSphere.current.rotation.y % (2 * Math.PI)
			setRotForce({ x: 0, y: ((rotForce.y > 0.1 || rotForce.y < -0.1) ? (rotForce.y * 0.9) : 0), z: 0 })
		}

		const posSpeed = 0.01
		// restrain if too fast
		setPosForce({ x: (posForce.x > 1 ? 1 : posForce.x), y: (posForce.y > 1 ? 1 : posForce.y), z: (posForce.z > 1 ? 1 : posForce.z) })
		// if (posForce.x !== 0) {
		currentSphere.current.position.x += posForce.x * posSpeed
		currentSphere.current.position.y += posForce.y * posSpeed
		currentSphere.current.position.z += posForce.z * posSpeed
		setPosForce({
			x: ((posForce.x > 0.1 || posForce.x < -0.1) ? (posForce.x * 0.9) : 0),
			y: ((posForce.y > 0.1 || posForce.y < -0.1) ? (posForce.y * 0.9) : 0),
			z: ((posForce.z > 0.1 || posForce.z < -0.1) ? (posForce.z * 0.9) : 0)
		})
		// }


		//update camera location to players
		if (props.currentUserTrue) {
			// props.cameraPos({x: currentSphere.current.position.x, y: currentSphere.current.position.y, z: currentSphere.current.position.z})
			props.cameraPos({
				x: currentSphere.current.position.x + 1 * Math.sin(currentSphere.current.rotation.y),
				y: currentSphere.current.position.y + 0.05,
				z: currentSphere.current.position.z + 1 * Math.cos(currentSphere.current.rotation.y)
			})
			props.cameraRot({ x: currentSphere.current.rotation.x, y: currentSphere.current.rotation.y, z: currentSphere.current.rotation.z })

		}

		// console.log(initialLocation, currentSphere.current.position)
		const changedLocation = (x1, y1, z1, x2, y2, z2) => {
			const distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2))
			return distance > 0.25
		}

		//update player location to database
		if (props.currentUserTrue && changedLocation(...lastUpdateLocation, currentSphere.current.position.x, currentSphere.current.position.y, currentSphere.current.position.z)) {
			setLastUpdateLocation([currentSphere.current.position.x, currentSphere.current.position.y, currentSphere.current.position.z])
			const databaseRef = ref(realtime, `/users/${props.currentUser}`)
			update(databaseRef, { x: currentSphere.current.position.x, y: currentSphere.current.position.y, z: currentSphere.current.position.z, color: currentSphere.current.color, curPosForce: posForce })
			// console.log("updated firebase");
		}
	})
	useKeypress(['w', 'a', 's', 'd', ' ', 'c'], (event) => {
		// event.preventDefault()
		// const speed = 0.05
		if (props.currentUserTrue) {
			// console.log(props);
			if (event.key === 'a') {
				setRotForce({ x: 0, y: rotForce.y + 0.2, z: 0 })
			} else if (event.key === 'd') {
				setRotForce({ x: 0, y: rotForce.y - 0.2, z: 0 })
			}
			if (event.key === 'w') {
				setPosForce({ x: posForce.x - Math.sin(currentSphere.current.rotation.y), y: posForce.y, z: posForce.z - Math.cos(currentSphere.current.rotation.y) })
				// currentSphere.current.position.z -= 1 * speed * Math.cos(currentSphere.current.rotation.y)
				// currentSphere.current.position.x -= 1 * speed * Math.sin(currentSphere.current.rotation.y)
			} else if (event.key === 's') {
				setPosForce({ x: posForce.x + Math.sin(currentSphere.current.rotation.y), y: posForce.y, z: posForce.z + Math.cos(currentSphere.current.rotation.y) })
				// currentSphere.current.position.z += 1 * speed * Math.cos(currentSphere.current.rotation.y)
				// currentSphere.current.position.x += 1 * speed * Math.sin(currentSphere.current.rotation.y)
			}
			if (event.key === ' ') {
				setPosForce({ x: posForce.x, y: posForce.y + 1, z: posForce.z })
				// currentSphere.current.position.y += 1 * speed
			} else if (event.key === 'c') {
				setPosForce({ x: posForce.x, y: posForce.y - 1, z: posForce.z })
				// currentSphere.current.position.y -= 1 * speed
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

		// //update player location to database
		// if (props.currentUserTrue) {
		// 	const databaseRef = ref(realtime, `/users/${props.currentUser}`)
		// 	set(databaseRef, { x: currentSphere.current.position.x, y: currentSphere.current.position.y, z: currentSphere.current.position.z, color: currentSphere.current.color })
		// }

		// //update camera location to players
		// if (props.currentUserTrue) {
		// 	// props.cameraPos({x: currentSphere.current.position.x, y: currentSphere.current.position.y, z: currentSphere.current.position.z})
		// 	props.cameraPos({x: currentSphere.current.position.x + 1 * Math.sin(currentSphere.current.rotation.y), 
		// 		y: currentSphere.current.position.y + 0.05, 
		// 		z: currentSphere.current.position.z + 1 * Math.cos(currentSphere.current.rotation.y)})
		// 	props.cameraRot({x: currentSphere.current.rotation.x, y: currentSphere.current.rotation.y, z: currentSphere.current.rotation.z})

		// }

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
				setPosForce({ x: posForce.x, y: posForce.y + 1, z: posForce.z })
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

			}}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}>
			<sphereGeometry args={[1, 5, 5]} />
			<meshStandardMaterial color={hover ? 'blue' : props.color} />
		</mesh>
	)
}

export default Sphere