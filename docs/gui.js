

var mousex=0, mousey=0
const amounts = function(text,a,b,c,d) {
    text = text +''
    ctx.fillStyle = 'black'
    var x = c/4 +'px serif'
    ctx.font = x
    
    
    ctx.fillText(text,a+0.9*c,b+0.9*d)
}
class item{
    constructor(img,stack){
        this.img = img
        this.stack = stack
    }
}
const itemMap = {
    dirt: new item("imgs/dirt.png",64),
    sand: new item("imgs/dirt.png",64),
    0: new item("lalalala",0)

}

var xclick , yclick, ifclick = false
const chests = {} 
let activeChest = null



c.addEventListener("click", (e)=>{
    xclick=e.clientX
    yclick=e.clientY
    ifclick = true
},false)
c.addEventListener("mousemove", (e)=>{
    mousex=e.offsetX
    mousey=e.offsetY 
},false)

var spot_myszka = [0,"0"]

class skrzynia{
    constructor(cols, rows, items){
        this.items = items
        this.open = false
        this.cols = cols
        this.rows = rows
    }
    
    opener(){
        //TODO sprawdzanie odległości od skrzynki
        this.open = true
        activeChest = this
    }
    checkClose(){
        if(keys["Escape"]){
            this.open=false
            activeChest = null
        }
    }
    drawGui(inventory = null){

        const guiWidth = Math.min(_H * 5/6 * 3/2, _W*5/6)  // 5/6->stosunek dlugosci gui do dlugosci ekranu 3/2->stosunek szer do wys
        const guiHeight = Math.min(_W * 5/6 * 2/3, _H*5/6)

        const guiOffsetX = (_W-guiWidth)/2
        const guiOffsetY = (_H-guiHeight)/2

        ctx.strokeStyle = "#291b10"
        ctx.fillStyle = '#915d36'
        ctx.fillRect(guiOffsetX-10, guiOffsetY-10, guiWidth+20, guiHeight+20)
        ctx.lineWidth = 5
        ctx.strokeRect(guiOffsetX-10, guiOffsetY-10, guiWidth+20, guiHeight+20)

        let invCols=0, invRows=0, guiGap = 0

        if(inventory instanceof skrzynia){
            invCols = inventory.cols
            invRows = inventory.rows
            guiGap = 1 // przerwa między chest a inv
        }

        const cellSize = Math.min(guiHeight/(this.rows+invRows+guiGap), Math.min(guiWidth/this.cols, guiWidth/invCols))
        const chestOffsetX = (guiWidth-this.cols*cellSize)/2
        const chestOffsetY = (guiHeight-(this.rows+invRows+guiGap)*cellSize)/2
        const invOffsetX = (guiWidth-invCols*cellSize)/2
        const invOffsetY = (chestOffsetY + (this.rows+guiGap)*cellSize)


        //chest gui section
        for(let i=0; i<this.cols; i++){
            for(let j=0; j<this.rows; j++){

                ctx.strokeRect(guiOffsetX + chestOffsetX + i*cellSize, guiOffsetY + chestOffsetY + j*cellSize, cellSize, cellSize)
                onclick(guiOffsetX + chestOffsetX + i*cellSize, guiOffsetY + chestOffsetY + j*cellSize, cellSize, cellSize,()=> {  
                    if(! this.items[strcoords(i,j)]) {
                        
                        this.items[strcoords(i,j)]=[0,"0"]
                    }
                    if(this.items[strcoords(i,j)][1]==spot_myszka[1]){
                        this.items[strcoords(i,j)][0]+=spot_myszka[0]
                        spot_myszka[0]=0
                        if(itemMap[this.items[strcoords(i,j)][1]].stack<this.items[strcoords(i,j)][0]){
                            spot_myszka[0] = this.items[strcoords(i,j)][0]-itemMap[this.items[strcoords(i,j)][1]].stack
                            this.items[strcoords(i,j)][0]=itemMap[this.items[strcoords(i,j)][1]].stack
                        }else{
                            spot_myszka[0]=0
                            spot_myszka[1]="0"
                        }
                    }else {
                        var x = this.items[strcoords(i,j)]
                        this.items[strcoords(i,j)]=spot_myszka
                        spot_myszka=x
                    }
                        
                    
                    
                })
                if(this.items[strcoords(i, j)]&&this.items[strcoords(i, j)][1]!="0"){
                    const img = new Image()
                    
                    img.src = itemMap[this.items[strcoords(i, j)][1]].img
                    ctx.drawImage(img, guiOffsetX + chestOffsetX + i*cellSize + cellSize/10, guiOffsetY + chestOffsetY + j*cellSize + cellSize/10, cellSize*0.8, cellSize*0.8)
                    amounts(this.items[strcoords(i,j)][0],guiOffsetX + chestOffsetX + i*cellSize + cellSize/10, guiOffsetY + chestOffsetY + j*cellSize + cellSize/10, cellSize*0.8, cellSize*0.8)
                }
            }
        }

        //inventory gui section
        for(let i=0; i<invCols; i++){
            for(let j=0; j<invRows; j++){

                ctx.strokeRect(guiOffsetX + invOffsetX + i*cellSize, guiOffsetY + invOffsetY + j*cellSize, cellSize, cellSize)
                onclick(guiOffsetX + invOffsetX + i*cellSize + cellSize/10, guiOffsetY + invOffsetY + j*cellSize + cellSize/10, cellSize*0.8, cellSize*0.8,()=>{
                    if(! inventory.items[strcoords(i,j)]){
                        inventory.items[strcoords(i,j)]=[0,"0"]
                        
                    }
                    if(inventory.items[strcoords(i,j)][1]==spot_myszka[1]){
                        inventory.items[strcoords(i,j)][0]+=spot_myszka[0]
                        spot_myszka[0]=0
                        if(itemMap[inventory.items[strcoords(i,j)][1]].stack<inventory.items[strcoords(i,j)][0]){
                            spot_myszka[0] = inventory.items[strcoords(i,j)][0]-itemMap[inventory.items[strcoords(i,j)][1]].stack
                            inventory.items[strcoords(i,j)][0]=itemMap[inventory.items[strcoords(i,j)][1]].stack
                        }else{
                            spot_myszka[0]=0
                            spot_myszka[1]="0"
                        }
                    }else {
                        var x = inventory.items[strcoords(i,j)]
                        inventory.items[strcoords(i,j)]=spot_myszka
                        spot_myszka=x
                    }
                    
                })
                if(inventory.items[strcoords(i, j)]&&inventory.items[strcoords(i,j)][1]!="0"){
                    const img = new Image()
                    
                    img.src = itemMap[inventory.items[strcoords(i, j)][1]].img
                    ctx.drawImage(img, guiOffsetX + invOffsetX + i*cellSize + cellSize/10, guiOffsetY + invOffsetY + j*cellSize + cellSize/10, cellSize*0.8, cellSize*0.8)
                    amounts(inventory.items[strcoords(i, j)][0],guiOffsetX + invOffsetX + i*cellSize + cellSize/10, guiOffsetY + invOffsetY + j*cellSize + cellSize/10, cellSize*0.8, cellSize*0.8)
                }
            }
        }
        if(spot_myszka[1]!="0"){
            const img = new Image()
            img.src = itemMap[spot_myszka[1]].img
            ctx.drawImage(img,mousex-cellSize*0.4,mousey-cellSize*0.4,cellSize*0.8,cellSize*0.8)
            document.getElementById("c").style.cursor="none"
            
            amounts((spot_myszka[0]),mousex-cellSize*0.4,mousey-cellSize*0.4,cellSize*0.8,cellSize*0.8)
        }else{
            document.getElementById("c").style.cursor="crosshair"
        }
        
    }
}


const playerInv = new skrzynia(8, 4, {"0:0":[63,"dirt"]})
console.log(playerInv.items["0:0"][1])

var chestfunctions = ()=>{
    if(keys["KeyE"]){
        playerInv.open = true
        activeChest = playerInv
    }
    if(activeChest){
        if(activeChest == playerInv){
            activeChest.drawGui()
            activeChest.checkClose()
        }else{
            activeChest.drawGui(playerInv)
            activeChest.checkClose()
        }
    }

    ifclick = false
}

