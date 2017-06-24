const w = window.innerWidth,h = window.innerHeight
class TabComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.div = document.createElement('div')
        shadow.appendChild(this.div)
        const children = this.children
        this.tabObjs = children.map((child)=>{
            return {title:child.getAttribute('title'),text:child.innerHTML}
        })
        this.currIndex = 0
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = this.tabs.length * (w/10)
        canvas.height = h/30
        const context = canvas.getContext('2d')
        if(!this.tabs) {
            this.tabs = this.tabObjs.map((tabObj,index) => {
                return new Tab(text,index*(w/10),w/10)
            })
            if(this.tabs.length > 0 && this.animationHandler) {
                this.animationHandler.startAnimation(this.tabs[0])
            }
        }
        context.font = context.font.replace(/\d{2}/,h/30)
        this.tabs.forEach((tab)=>{
            tab.draw(context)
        })
        this.div.style.backgroundImage = `url(${canvas.toDataURL()})`
    }
    connectedCallback() {
        if(this.tabs.length > 0) {
            this.animationHandler = new AnimationHandler()
            this.render()
            this.div.onmousedown = (event) => {
                for(var i=0;i<tabs.length;i++) {
                    const tab = this.tabs[i]
                    if(tab.handleTap(event.offsetX) == true) {
                        this.animationHandler.startAnimation(tab)
                        break
                    }
                }
            }
        }
    }
}
class Tab {
    constructor(text,x,w) {
        this.text = text
        this.x = x
        this.w = w
        this.lx = 0
        this.dir = 0
    }
    draw(context) {
        context.fillStyle = 'gray'
        context.fillRect(this.x,h/20,this.w,h/10)
        context.fillStyle = 'black'
        const tw = context.measureText(this.text)
        context.fillText(this.text,this.x-tw/2,h/10)
        context.strokeStyle = 'blue'
        context.lineWidth = 3
        context.beginPath()
        context.moveTo(-lx,0)
        context.lineTo(lx,0)
        context.stroke()
    }
    update() {
        this.lx += this.dir*(this.w/10)
        if(this.lx > this.w/2) {
            this.dir = 0
            this.lx = this.w/2
        }
        if(this.lx < 0) {
            this.lx = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    startUpdating(dir) {
        this.dir = dir
    }
    handleTap(x) {
        const condition =  x>=this.x && x<=this.x+this.w
        return condition
    }
}
class AnimationHandler  {
    startAnimation(currTab) {
        if(currTab == this.currTab) {
            return 0
        }
        if(this.currTab) {
            this.prevTab = this.currTab
            this.prevTab.startUpdating(-1)
        }
        this.currTab = currTab
        this.currTab.startUpdating(1)
        const interval = setInterval(()=>{
            if(this.currTab) {
                this.currTab.update()
                if(this.prevTab) {
                    this.prevTab.update()
                }
                if(this.currTab.stopped() == true)  {
                    clearInterval(interval)
                }
            }
        },100)
    }
}
