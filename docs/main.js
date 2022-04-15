const c = document.getElementById("c")
const ctx = c.getContext("2d")

let _W, _H

const resize = ()=>{
	_W = window.innerWidth
	_H = window.innerHeight
	c.width = _W
	c.height = _W
}

const loop = ()=>{
	requestAnimationFrame(loop)

	resize()
}
loop()