const c = document.getElementById("c")
const ctx = c.getContext("2d")

let _W, _H
let cols, rows

const T = {}

const cameraOffset = {x:0, y:0}
const cellSize = 20




class Player{
	constructor(color){
		this.color = color
	}
	render(){
		ctx.fillStyle = this.color
		ctx.fillRect(_W/2+(cameraOffset.x+this.x)*cellSize, _H/2+(cameraOffset.y+this.y)*cellSize, cellSize, cellSize)
	}
	setPos(x, y){
		this.x = x
		this.y = y
	}
	move(x, y){
		this.x += x
		this.y += y
	}
}



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

	cols = Math.floor(_W/cellSize)
	rows = Math.floor(_H/cellSize)
}

const getSimplex = (x, y)=>{
	return noise.simplex2(x/15, y/15)
}

const generationLogics = (x, y)=>{
	
	if(getSimplex(x, y)>=0.1){
		return 1 //block
	}else{
		for(let i=y; i>y-50; i--){
			if(getSimplex(x, i)>=0.1){
				return 0 //air
			}else if(getSimplex(x, i)*10000%100>80 && y-i>3){
				return 2 //vines
			}
		}
	}
	return 0
}

const generateCell = (x, y)=>{
	if(T[strcoords(x, y)] == null){
		T[strcoords(x, y)] = generationLogics(x, y)
	}
}

const renderTerrain = ()=>{
	ctx.fillStyle = "#b06b27"
	ctx.fillRect(0, 0, _W, _H)

	for(let i=-Math.ceil(cols/2)-1; i<=Math.ceil(cols/2)+1; i++){
		for(let j=-Math.ceil(rows/2)-1; j<=Math.ceil(rows/2)+1; j++){
			generateCell(Math.floor(cameraOffset.x)-i, Math.floor(cameraOffset.y)-j)
			const t = T[strcoords(Math.floor(cameraOffset.x)-i, Math.floor(cameraOffset.y)-j)]
			if(t == 1){//draw block
				ctx.fillStyle = "#75481c"
				ctx.fillRect(_W/2+(mod(cameraOffset.x, 1)+i)*cellSize, _H/2+(mod(cameraOffset.y, 1)+j)*cellSize, cellSize, cellSize)
			}else if(t == 2){//draw vines
				ctx.fillStyle = "#3eab32"
				ctx.fillRect(_W/2+(mod(cameraOffset.x, 1)+i)*cellSize+cellSize/3, _H/2+(mod(cameraOffset.y, 1)+j)*cellSize, cellSize/3, cellSize)
			}
		}
	}
}


let b
while(!b){
	noise.seed(Math.random())
	b = generationLogics(0, -1)
}

const Bob = new Player('red')
Bob.setPos(0, 0)





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
	Bob.render()

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