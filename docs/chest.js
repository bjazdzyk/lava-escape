const mapa = new Map()

var xclick , yclick, ifclick = false
var chestlist = [] 

c.addEventListener("click",e =>{
    xclick=e.clientX
    yclick=e.clientY
    ifclick = true
},false)

var item = function(img) {
    this.img = img
}
var dirt = new item("https://static.wikia.nocookie.net/minecraft_pl_gamepedia/images/6/6b/Ziemia.png/revision/latest?cb=20190404212047")
mapa.set("dirt",dirt)
//sloty to tablica, jesli w slocie nr 9  nie ma niczego to wpisane jest tam 0
var skrzynia = function(x,y,sloty,size) {
    this.x=x
    this.y=y
    this.sloty = sloty
    this.open = false
    this.size=size
}
skrzynia.prototype.opener = function() {
//warunek kolizji
    if(((Bob.x-this.x)*(Bob.x-this.x)+(Bob.y-this.y)*(Bob.y-this.y))<101) {
        if((cameraOffset.x+xclick-_W/2>=this.x)&&(cameraOffset.x+xclick-_W/2<=this.x+this.size)&&(cameraOffset.y+yclick-_H/2>=this.y)&&(cameraOffset.y+yclick-_H/2<=this.y+this.size)){
            this.open = true
        }
        
    }

}
//skrzynia.prototype.draw = function() {
//    ctx.fillStyle ="yellow"
    
//    ctx.fillRect(this.x+cameraOffset.x*cellSize-_W/2,this.y+cameraOffset.y*cellSize-_H/2,this.size,this.size)
//}

//funkcje wykonywane jesli this.open = true
skrzynia.prototype.opendraw = function(){
    ctx.fillStyle = 'Brown'
    ctx.lineWidth = 6
    ctx.fillRect(0,0,1365,969)
    ctx.strokeStyle= "green"
    ctx.beginPath()
    ctx.moveTo(682.5,0)
    ctx.lineTo(682.5,969)
    ctx.stroke()
    ctx.lineWidth = 2
    ctx.strokeRect(10,10,662.5,662.5)
    var counter =0 
    for(var i = 20;i<672.5;i=i+217.5) {
        for(var j =20;j<672.5;j=j+217.5) {
            if(this.sloty[counter] != "0" ) {
                var img = new Image()
                img.src = mapa.get(this.sloty[counter]).img
 //               img.onload = function() {
                    
                    ctx.drawImage(img,i,j,217.5,217.5)
//                }
                
                
                
// this.sloty counter zwraca nazwe bloku, ktory przez mape paruje go z jego obiektem w ktorym szukamy atrybutu src
                
            }
            
            counter++
        }
    }
    
}
skrzynia.prototype.close = function() {
//jezeli nacisniesz escape zmayka
    if(keys["Escape"]){
        this.open=false
    }
}
var przyklad = new skrzynia(0,0,["dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt"],20)
chestlist.push(przyklad)
var chestfunctions = function() {
    for(var i =0;i<chestlist.length;i++) {
        chestlist[i].draw()
       
        chestlist[i].opener()
        
        if(chestlist[i].open) {
            chestlist[i].opendraw()
            chestlist[i].close()
        }
    }
}
