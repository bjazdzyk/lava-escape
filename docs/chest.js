const itemMap = {}

var xclick , yclick, ifclick = false
const chests = {} 

c.addEventListener("click", (e)=>{
    xclick=e.clientX
    yclick=e.clientY
    ifclick = true
},false)

class item{
    constructor(img){
        this.img = img
    }
}

itemMap["dirt"] = new item("imgs/dirt.png")

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
    drawGui(){
        const guiWidth = Math.min(_H * 5/6 * 3/2, _W*5/6)  // 5/6->stosunek dlugosci gui do dlugosci ekranu 3/2->stosunek szer do wys
        const guiHeight = Math.min(_W * 5/6 * 2/3, _H*5/6)

        const guiOffsetX = (_W-guiWidth)/2
        const guiOffsetY = (_H-guiHeight)/2

        ctx.fillStyle = 'Brown'
        ctx.fillRect(guiOffsetX-10, guiOffsetY-10, guiWidth+20, guiHeight+20)

        ctx.strokeStyle = "black"
        ctx.lineWidth = 5
        
        for(let i=0; i<this.cols; i++){
            for(let j=0; j<this.rows; j++){
                const cellSize = Math.min(guiWidth/this.cols, guiHeight/this.rows)
                const gridOffsetX = (guiWidth-this.cols*cellSize)/2
                const gridOffsetY = (guiHeight-this.rows*cellSize)/2

                ctx.strokeRect(guiOffsetX + gridOffsetX + i*cellSize, guiOffsetY + gridOffsetY + j*cellSize, cellSize, cellSize)
                if(this.items[strcoords(i, j)]){
                    const img = new Image()
                    img.src = itemMap[this.items[strcoords(i, j)]].img
                    ctx.drawImage(img, guiOffsetX + gridOffsetX + i*cellSize, guiOffsetY + gridOffsetY + j*cellSize, cellSize, cellSize)
                }
            }
        }
    }
}


var przyklad = new skrzynia(5, 4, {"0:0":"dirt", "4:1":"dirt", "1:2":"dirt", "2:3":"dirt"})
chests["0:0"] = przyklad

var chestfunctions = ()=>{
    for(const i in chests) {
        
        if(chests[i].open) {
            chests[i].drawGui()
            chests[i].checkClose()
        }
    }
}
