const c = document.getElementById("c")
const ctx = c.getContext("2d")

let _W, _H
let cols, rows

const T = {}

const cameraOffset = {x:0, y:0}
const cellSize = 20


noise.seed(Math.random())

function mod(n, m) {
  return ((n % m) + m) % m;
}

const strcoords = (x, y)=>{
	return `${x}:${y}`
}

const resize = ()=>{
	_W = window.innerWidth
	_H = window.innerHeight
	c.width = _W
	c.height = _H

	cols = _W/cellSize
	rows = _H/cellSize
}

const generateCell = (x, y)=>{
	if(T[strcoords(x, y)] == null){
		T[strcoords(x, y)] = (noise.simplex2(x/15, y/15)>=0.1)
	}
}

const renderTerrain = ()=>{
	ctx.fillStyle = "#b06b27"
	ctx.fillRect(0, 0, _W, _H)

	ctx.fillStyle = "#75481c"
	for(let i=-1; i<=cols; i++){
		for(let j=-1; j<=rows; j++){
			generateCell(Math.floor(cameraOffset.x)-i, Math.floor(cameraOffset.y)-j)
			if(T[strcoords(Math.floor(cameraOffset.x)-i, Math.floor(cameraOffset.y)-j)] == 1){
				ctx.fillRect((mod(cameraOffset.x, 1)+i)*cellSize, (mod(cameraOffset.y, 1)+j)*cellSize, cellSize, cellSize)
			}
		}
	}
}


const keys = {}
document.addEventListener('keydown', (e)=>{
	keys[e.code] = true
})
document.addEventListener('keyup', (e)=>{
	keys[e.code] = null
})

const loop = ()=>{
	requestAnimationFrame(loop)

	resize()

	renderTerrain()

	if(keys["ArrowUp"]){
		cameraOffset.y+=5/cellSize
	}
	if(keys["ArrowDown"]){
		cameraOffset.y-=5/cellSize
	}
	if(keys["ArrowLeft"]){
		cameraOffset.x+=5/cellSize
	}
	if(keys["ArrowRight"]){
		cameraOffset.x-=5/cellSize
	}
	

}
loop()