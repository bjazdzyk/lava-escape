const c = document.getElementById("c")
const ctx = c.getContext("2d")

let _W, _H
let cols, rows

const T = {}

const cameraOffset = {x:0, y:0}
const cellSize = 20
let step = cellSize/100



class Player{
	constructor(color){
		this.color = color
		this.VY = 0
		this.moveType = "walk"
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
	update(){
		if(this.y*-1<lavaLevel){
			step = cellSize/200
		}else{
			step = cellSize/100
		}

		if(T[strcoords(Math.ceil(Bob.x)*-1, Math.ceil(Bob.y)*-1)] == 1 || T[strcoords(Math.floor(Bob.x)*-1, Math.ceil(Bob.y)*-1)] == 1){//zatrzymanie po upadaniu
			if(this.VY>0){
				this.VY = 0
				this.y = Math.floor(this.y)
			}
		}else if(T[strcoords(Math.ceil(Bob.x)*-1, Math.floor(Bob.y)*-1)] == 1 || T[strcoords(Math.floor(Bob.x)*-1, Math.floor(Bob.y)*-1)] == 1){//zatrzymanie po walnięciu w sufit
			if(this.VY<0){
				this.VY = 0
				this.y = Math.ceil(this.y)
			}
		}else{
			this.VY += cellSize/800
		}
		if(this.moveType == "walk"){
			this.y += this.VY//gravitacja
		}else{
			this.VY = 0
		}

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
	
	if(getSimplex(x, y)>=0.20){
		return 1 //block
	}else{
		let i = y
		while(1){
			if(getSimplex(x, i)>=0.20){
				return 0 //air
			}else if(getSimplex(x, i)*10000000%100>75 && y-i>1){
				return 2 //vines
			}
			i--
		}
	}
	return 0
}

const generateCell = (x, y)=>{
	if(T[strcoords(x, y)] == undefined){
		T[strcoords(x, y)] = generationLogics(x, y)
	}
}
var onclick = function(x, y, weigth, height, fun) {
	if((xclick > x && xclick < x+weigth) && (yclick > y && yclick < y+height)){
		if(ifclick){
			
			fun()
			
		}
		
	}
}

const renderTerrain = ()=>{
	
	ctx.fillStyle = "#b06b27"
	ctx.fillRect(0, 0, _W, _H)

	for(let i=-Math.ceil(cols/2)-1; i<=Math.ceil(cols/2)+1; i++){
		for(let j=-Math.ceil(rows/2)-1; j<=Math.ceil(rows/2)+1; j++){

			generateCell(Math.floor(cameraOffset.x)-i, Math.floor(cameraOffset.y)-j)

			const x = Math.floor(cameraOffset.x)-i
			const y = Math.floor(cameraOffset.y)-j

			const t = T[strcoords(x, y)]

			if(t == 1){//draw block
				ctx.fillStyle = "#75481c"
				ctx.fillRect(_W/2+(mod(cameraOffset.x, 1)+i)*cellSize, _H/2+(mod(cameraOffset.y, 1)+j)*cellSize, cellSize+1, cellSize+1)

			}else if(t == 2){//draw vines
				ctx.fillStyle = "#3eab32"
				ctx.fillRect(_W/2+(mod(cameraOffset.x, 1)+i)*cellSize+cellSize/3, _H/2+(mod(cameraOffset.y, 1)+j)*cellSize, cellSize/3, cellSize)

			}else if(t == 3){//chest
        ctx.fillStyle = "yellow"
        ctx.fillRect(_W/2+(mod(cameraOffset.x, 1)+i)*cellSize, _H/2+(mod(cameraOffset.y, 1)+j)*cellSize, cellSize+1, cellSize+1)

        //open chest gui
				onclick(_W/2+(mod(cameraOffset.x, 1)+i)*cellSize, _H/2+(mod(cameraOffset.y, 1)+j)*cellSize, cellSize+1, cellSize+1, ()=>{
					chests[strcoords(x, y)].open = true
					activeChest = chests[strcoords(x, y)]
				})
				
      }
		}
	}
	updateLava()
	renderLava()
}

let lavaLevel = -20
let lavaRisingSpeed = 0.06

const updateLava = ()=>{
	lavaLevel += lavaRisingSpeed
	lavaRisingSpeed = Math.abs(lavaLevel + Bob.y)/500+0.07
	console.log(Math.floor(lavaLevel + Bob.y))

}
const renderLava = ()=>{
	ctx.globalAlpha = 0.8
	ctx.fillStyle = "darkorange"
	ctx.fillRect(0, _H, _W, Math.max(-_H, (cameraOffset.y-lavaLevel)*cellSize-_H/2))
	ctx.globalAlpha = 1
}

//nowy seed az gracz stoi na ziemi
let b
while(!b){
	noise.seed(Math.random())
	b = (generationLogics(0, -1) == 1)
}


const Bob = new Player('red')
Bob.setPos(0, 0)


var przyklad = new skrzynia(4, 3, {"0:0":"dirt", "2:1":"dirt"})
chests["0:0"] = przyklad
T[strcoords(0,0)] = 3




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


	Bob.update()
	Bob.render()

	if(keys["Space"]){

		if(Bob.moveType == "walk"){
			if(T[strcoords(Math.ceil(Bob.x)*-1, Math.ceil(Bob.y)*-1)] == 1 || T[strcoords(Math.floor(Bob.x)*-1, Math.ceil(Bob.y)*-1)] == 1){//gdy stoi na ziemi
				if(T[strcoords(Math.ceil(Bob.x)*-1, Math.floor(Bob.y-1)*-1)] != 1 && T[strcoords(Math.floor(Bob.x)*-1, Math.floor(Bob.y-1)*-1)] != 1){//i nie ma sufitu tuz nad sobą
					Bob.VY=-step*2//skakanie
				}
			}
		}else if(Bob.moveType == "climb"){
			Bob.moveType = "walk"
			if(T[strcoords(Math.ceil(Bob.x)*-1, Math.floor(Bob.y-1)*-1)] != 1 && T[strcoords(Math.floor(Bob.x)*-1, Math.floor(Bob.y-1)*-1)] != 1){//i nie ma sufitu tuz nad sobą
				Bob.VY=-step*2//skakanie
			}
		}
	}

	if(keys["KeyW"]){
		if(T[strcoords(Math.ceil(Bob.x-0.5)*-1, Math.floor(Bob.y)*-1)] == 2){//wspinanie
			Bob.moveType = "climb"
			Bob.x = Math.ceil(Bob.x-0.5)

		}
		if(Bob.moveType == "climb"){
			if(T[strcoords(Math.ceil(Bob.x-0.5)*-1, Math.floor(Bob.y-step)*-1)] != 1){
				Bob.y -= step
			}
		}
	}

	if(keys["KeyS"]){
		if(Bob.moveType == "climb"){
			if(T[strcoords(Math.ceil(Bob.x-0.5)*-1, Math.ceil(Bob.y)*-1)] == 2){
				Bob.y += step
			}else{
				Bob.moveType = "walk"
			}
		}
	}
	
	if(keys["KeyA"]){
		if(Bob.moveType == "walk"){
			if(T[strcoords(Math.floor(Bob.x-step)*-1, Math.floor(Bob.y)*-1)] != 1){//kolizja
				Bob.x-=step
			}else{
				Bob.x = Math.floor(Bob.x)
			}
		}
	}
	
	if(keys["KeyD"]){
		if(Bob.moveType == "walk"){
			if(T[strcoords(Math.ceil(Bob.x+step)*-1, Math.floor(Bob.y)*-1)] != 1){//kolizja
				Bob.x+=step
			}else{
				Bob.x = Math.ceil(Bob.x)
			}
		}
	}
	cameraOffset.x=-Bob.x
	cameraOffset.y=-Bob.y

	chestfunctions()




	//console.log(T[strcoords(Math.ceil(Bob.x-0.5)*-1, Math.floor(Bob.y)*-1)])

}
loop()