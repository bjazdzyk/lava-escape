const c = document.getElementById("c")
const ctx = c.getContext("2d")

let _W, _H
let cols, rows

const T = {}

const cameraOffset = {x:0, y:0}
const cellSize = 40


noise.seed(Math.random())

const strcoords = (x, y)=>{
	return `${x}:${y}`
}

const resize = ()=>{
	_W = window.innerWidth
	_H = window.innerHeight
	c.width = _W
	c.height = _W

	cols = _W/cellSize + 2
	rows = _H/cellSize + 2
}

const generateCell = (x, y)=>{
	if(T[strcoords(x, y)] == null){
		T[strcoords(x, y)] = (noise.simplex2(x/15, y/15)>=0)
	}
}

const renderTerrain = ()=>{
	ctx.fillStyle = "#b06b27"
	ctx.fillRect(0, 0, _W, _H)

	ctx.fillStyle = "#75481c"
	for(let i=0; i<cols; i++){
		for(let j=0; j<rows; j++){
			generateCell(i, j)
			//console.log(T[strcoords(Math.floor(cameraOffset.x)+i, Math.floor(cameraOffset.y)+j)])
			if(T[strcoords(Math.floor(cameraOffset.x)+i, Math.floor(cameraOffset.y)+j)] == 1){
				ctx.fillRect((cameraOffset.x%1+i)*cellSize, (cameraOffset.y%1+j)*cellSize, cellSize, cellSize)
			}
		}
	}
}



const loop = ()=>{
	requestAnimationFrame(loop)

	resize()

	renderTerrain()

	

}
loop()