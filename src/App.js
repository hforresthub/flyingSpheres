import './App.css';
import Box from './Box'
import Sphere from './Sphere'
import Camera from './Camera'
import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react';
import realtime from './firebase'
import { ref, onValue, update } from 'firebase/database'

function App() {

	const [currentUserName, setCurrentUserName] = useState('')
	const [colorChoice, setColorChoice] = useState('#000')
	const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 20 })
	const [cameraRotation, setCameraRotation] = useState({ x: 0, y: 0, z: 0 })
	const [touched, setTouched] = useState(0)

	const [boxArray, setBoxArray] = useState([])
	const [sphereArray, setSphereArray] = useState([])

	const handleSubmit = (event) => {
		event.preventDefault()
		// add user if they dont exist in firebase yet
		const checkForName = sphereArray.filter((element) => {
			return (element.userName === currentUserName)
		})
		if (currentUserName && currentUserName !== null && checkForName.length === 0) {
			const databaseRef = ref(realtime, `/users/${currentUserName}`)
			update(databaseRef, { x: 0, y: 0, z: -1, color: colorChoice })
		} else if (currentUserName && currentUserName !== null && checkForName.length !== 0) {
			const databaseRef = ref(realtime, `/users/${currentUserName}`)
			update(databaseRef, { x: checkForName[0].x, y: checkForName[0].y, z: checkForName[0].z, color: colorChoice })
		}
	}

	useEffect(() => {
		const tempArrayB = []
		const boxCount = 200
		const startSpreadModifier = 100

		for (let i = 0; i < boxCount; i++) {
			tempArrayB.push({ x: (Math.random() - 0.5) * startSpreadModifier, y: (Math.random() - 0.5) * startSpreadModifier * 0.5, z: (Math.random() - 2) * startSpreadModifier * 0.5, color: 'red' })
		}
		setBoxArray(tempArrayB)

		const databaseRef = ref(realtime, '/users')
		onValue(databaseRef, (snapshot) => {
			const myData = snapshot.val()
			let tempArray = []
			for (let propertyName in myData) {
				// console.log(myData);
				// console.log(propertyName);
				// console.log(myData[propertyName]);
				const IndexedUser = {
					userName: propertyName,
					x: myData[propertyName].x,
					y: myData[propertyName].y,
					z: myData[propertyName].z,
					color: myData[propertyName].color,
					curPosForce: myData[propertyName].curPosForce
				}
				tempArray.push(IndexedUser)
			}
			// console.log("huh ", tempArray);
			setSphereArray(tempArray)
			// console.log("huh ", tempArray);
		})


		// }, [])

		// useEffect(() => {

		// use firebase to initialize saved players
		// tempArray2.push({ x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, z: (Math.random() - 1) * 100, userName: 'Hal' })
		// setSphereArray(tempArray2)
	}, [])

	// useEffect(() => {
	// 	// for reformatting database, commented out when theres no changes
	// 	// for each sphere, update with new data
	// 	sphereArray.forEach((element) => {
	// 		const databaseRef = ref(realtime, `/users/${element.userName}`)
	// 		update(databaseRef, { curPosForce: {x: 0, y: 0, z: 0} })
	// 	})

	// }, [sphereArray])

	const handleUserNameChange = (event) => {
		setCurrentUserName(event.target.value)
	}

	const handleColorChange = (event) => {
		setColorChoice(event.target.value)
	}

	useEffect(() => {
		let iX = null
		let iY = null

		const startTouch = (e) => {
			iX = e.touches[0].clientX
			iY = e.touches[0].clientY
		}

		const moveTouch = (e) => {
			e.preventDefault()

			if (iX === null) {
				return
			}
			if (iY === null) {
				return
			}

			let currentX = e.touches[0].clientX
			let currentY = e.touches[0].clientY

			let diffX = iX - currentX
			let diffY = iY - currentY

			let size = 1
			if (Math.abs(diffX) > Math.abs(diffY)) {
				if (diffX > size) {
					console.log("swlf");
					setTouched(1)
				} else if (diffX < -1 * size) {
					console.log("swrt");
					setTouched(2)
				}
			} else {
				if (diffY > size) {
					console.log("swup");
					setTouched(3)
				} else if (diffY < -1 * size) {
					console.log("swdn");
					setTouched(4)
				}
			}

			iX = null
			iY = null

		}
		const screen = document.querySelector('.App')
		screen.addEventListener('touchstart', startTouch, { passive: false })
		screen.addEventListener('touchmove', moveTouch, { passive: false })
	}, [])

	return (
		<div className="App">
			<div className="wrapper">
				<h1>Flying Stuff</h1>
				<p>Enter your name and hit enter to add a sphere of the chosen color, wasd keys to move, space and c to rise or fall</p>
				<form onSubmit={handleSubmit}>
					<label htmlFor="userName">User: </label>
					<input type="text" name="userName" id="userName" value={currentUserName} onChange={handleUserNameChange} />
					<label htmlFor="color">Color: </label>
					<input type="color" name="color" id="color" value={colorChoice} onChange={handleColorChange} />
					<button type="button" onClick={handleSubmit}>Create Sphere</button>
				</form>
				<div className="info">
					<p>Camera location:</p>
					<p>x: {cameraPosition.x} y: {cameraPosition.y} z: {cameraPosition.z}</p>
					<p>rotation: {cameraRotation.y}</p>
				</div>
			</div>
			<div className="canvasWrapper">
				<Canvas >
					<Camera
						position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
						rotation={[cameraRotation.x, cameraRotation.y, cameraRotation.z]}
						fov={90}
					// setViewOffset={( 0, 0, 20, 20, 0, 0 )}
					// filmOffSet={100}
					// zoom={100}
					/>
					<ambientLight />
					<pointLight position={[10, 10, 10]} />
					{
						boxArray.map((element, index) => {
							// console.log(element);
							return (
								<Box key={index} position={[element.x, element.y, element.z]} />
							)
						})
					}
					{
						sphereArray.length > 0 ?
							sphereArray.map((element, index) => {
								// console.log(element);
								return (
									// <>
									// </>
									<Sphere
										key={index}
										position={[element.x, element.y, element.z]}
										color={element.color}
										name={element.userName}
										currentUser={currentUserName}
										currentUserTrue={element.userName === currentUserName}
										cameraPos={setCameraPosition}
										cameraRot={setCameraRotation}
										setUser={setCurrentUserName}
										setColor={setColorChoice}
										touched={touched}
										setTouched={setTouched}
										curPosForce={element.curPosForce}
									/>
								)
								// })
							}) : null
					}
				</Canvas>
			</div>
		</div>
	);
}

export default App;

// Things to add maybe
// - subtle sounds based on motion
// - collision detection
// - camera following sphere
// - setting a motion for a sphere, perhaps a lockstate via click
// 	- lower poly with spin
// - shaders/post processing