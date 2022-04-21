class item{
    constructor(img){
        this.img = img
    }
}
const itemMap = {
    dirt: new item("imgs/dirt.png"),
    sand: new item("imgs/dirt.png")

}

var xclick , yclick, ifclick = false
const chests = {} 



c.addEventListener("click", (e)=>{
    xclick=e.clientX
    yclick=e.clientY
    ifclick = true
},false)



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
    }
    checkClose(){
        if(keys["Escape"]){
            this.open=false
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
                if(this.items[strcoords(i, j)]){
                    const img = new Image()
                    img.src = itemMap[this.items[strcoords(i, j)]].img
                    ctx.drawImage(img, guiOffsetX + chestOffsetX + i*cellSize + cellSize/10, guiOffsetY + chestOffsetY + j*cellSize + cellSize/10, cellSize*0.8, cellSize*0.8)
                }
            }
        }

        //inventory gui section
        for(let i=0; i<invCols; i++){
            for(let j=0; j<invRows; j++){

                ctx.strokeRect(guiOffsetX + invOffsetX + i*cellSize, guiOffsetY + invOffsetY + j*cellSize, cellSize, cellSize)
                
                if(inventory.items[strcoords(i, j)]){
                    const img = new Image()
                    img.src = itemMap[this.items[strcoords(i, j)]].img
                    ctx.drawImage(img, guiOffsetX + invOffsetX + i*cellSize + cellSize/10, guiOffsetY + invOffsetY + j*cellSize + cellSize/10, cellSize*0.8, cellSize*0.8)
                }
            }
        }
    }
}


const playerInv = new skrzynia(8, 4, {})


var chestfunctions = ()=>{
    for(const i in chests) {
        
        if(chests[i].open) {
            chests[i].drawGui(playerInv)
            chests[i].checkClose()
        }
    }
    ifclick = false
}
