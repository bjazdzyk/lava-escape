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
		this.VY = 0
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
		if(T[strcoords(Math.ceil(Bob.x)*-1, Math.ceil(Bob.y)*-1)] == 1 || T[strcoords(Math.floor(Bob.x)*-1, Math.ceil(Bob.y)*-1)] == 1){
			if(this.VY>0){
				this.VY = 0
				this.y = Math.floor(this.y)
			}
		}else if(T[strcoords(Math.ceil(Bob.x)*-1, Math.floor(Bob.y)*-1)] == 1 || T[strcoords(Math.floor(Bob.x)*-1, Math.floor(Bob.y)*-1)] == 1){
			if(this.VY<0){
				this.VY = 0
				this.y = Math.ceil(this.y)
			}
		}else{
			this.VY += 0.5/cellSize
		}
		this.y += this.VY

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
	
	if(getSimplex(x, y)>=0.15){
		return 1 //block
	}else{
		for(let i=y; i>y-500; i--){
			if(getSimplex(x, i)>=0.15){
				return 0 //air
			}else if(getSimplex(x, i)*10000000%100>90 && y-i>3){
				return 2 //vines
			}
		}
	}
	return 0
}

const generateCell = (x, y)=>{
	if(T[strcoords(x, y)] == undefined){
		T[strcoords(x, y)] = generationLogics(x, y)
	}
}
var onclick = function(x,y,weigth,height) {
	if((xclick>x&&xclick<x+weigth)&&(yclick>y&&yclick<y+height)){
		if(ifclick){
			
			return true
		}
		
	}
}
T[strcoords(0,0)]=3
const renderTerrain = ()=>{
	
	ctx.fillStyle = "#b06b27"
	ctx.fillRect(0, 0, _W, _H)

	for(let i=-Math.ceil(cols/2)-1; i<=Math.ceil(cols/2)+1; i++){
		for(let j=-Math.ceil(rows/2)-1; j<=Math.ceil(rows/2)+1; j++){
			generateCell(Math.floor(cameraOffset.x)-i, Math.floor(cameraOffset.y)-j)
			const t = T[strcoords(Math.floor(cameraOffset.x)-i, Math.floor(cameraOffset.y)-j)]
			if(t == 1){//draw block
				ctx.fillStyle = "#75481c"
				ctx.fillRect(_W/2+(mod(cameraOffset.x, 1)+i)*cellSize, _H/2+(mod(cameraOffset.y, 1)+j)*cellSize, cellSize+1, cellSize+1)
			}else if(t == 2){//draw vines
				ctx.fillStyle = "#3eab32"
				ctx.fillRect(_W/2+(mod(cameraOffset.x, 1)+i)*cellSize+cellSize/3, _H/2+(mod(cameraOffset.y, 1)+j)*cellSize, cellSize/3, cellSize)
			}else if(t == 3){
                ctx.fillStyle = "yellow"
                ctx.fillRect(_W/2+(mod(cameraOffset.x, 1)+i)*cellSize, _H/2+(mod(cameraOffset.y, 1)+j)*cellSize, cellSize+1, cellSize+1)
				if(onclick(_W/2+(mod(cameraOffset.x, 1)+i)*cellSize, _H/2+(mod(cameraOffset.y, 1)+j)*cellSize, cellSize+1, cellSize+1)){
					console.log("boom")
					
					for(var z = 0;z<chestlist.length;z++) {
						if((chestlist[z].x == Math.floor(cameraOffset.x)-i)&&(chestlist[z].y == Math.floor(cameraOffset.y)-j)) {
							chestlist[z].open =true
							
						}
					}
				}
            }
		}
	}
	ifclick = false
}


let b
while(!b){
	noise.seed(Math.random())
	b = (generationLogics(0, -1) == 1)
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
	Bob.update()
	Bob.render()

	if(keys["ArrowUp"]){
		if(T[strcoords(Math.ceil(Bob.x)*-1, Math.ceil(Bob.y)*-1)] == 1 || T[strcoords(Math.floor(Bob.x)*-1, Math.ceil(Bob.y)*-1)] == 1){
			if(!T[strcoords(Math.ceil(Bob.x)*-1, Math.floor(Bob.y-1)*-1)] == 1 && !T[strcoords(Math.floor(Bob.x)*-1, Math.floor(Bob.y-1)*-1)] == 1){
				Bob.VY=-8/cellSize
			}
		}
	}
	
	if(keys["ArrowLeft"]){
		if(T[strcoords(Math.floor(Bob.x-3/cellSize)*-1, Math.floor(Bob.y)*-1)] != 1){
			Bob.x-=3/cellSize
		}else{
			Bob.x = Math.floor(Bob.x)
		}
	}
	
	if(keys["ArrowRight"]){
		if(T[strcoords(Math.ceil(Bob.x+3/cellSize)*-1, Math.floor(Bob.y)*-1)] != 1){
			Bob.x+=3/cellSize
		}else{
			Bob.x = Math.ceil(Bob.x)
		}
	}
	cameraOffset.x=-Bob.x
	cameraOffset.y=-Bob.y
	ctx.fillStyle="red"
	
	//chestfunctions()
	for(var z=0;z<chestlist.length;z++){
		if(chestlist[z].open) {
			chestlist[z].opendraw()
			chestlist[z].close()
		}
	}

}
loop()