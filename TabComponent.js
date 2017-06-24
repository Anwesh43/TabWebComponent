const w = window.innerWidth,h = window.innerHeight
class TabComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.div = document.createElement('div')
        shadow.appendChild(this.div)
        this.contentDiv = document.createElement('div')
        this.createTabObjs()
        this.currIndex = 0
        shadow.appendChild(this.contentDiv)
    }
    createTabObjs() {
      this.tabObjs = []
      for(var i=0;i<this.children.length;i++) {
          const child = this.children[i]
          this.tabObjs.push({title:child.getAttribute('title'),text:child.innerHTML})
      }
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = this.tabObjs.length * (w/10)
        canvas.height = h/10
        this.div.style.width = canvas.width
        this.div.style.height = canvas.height
        //console.log(canvas.height)
        const context = canvas.getContext('2d')
        if(!this.tabs) {
            this.tabs = this.tabObjs.map((tabObj,index) => {
                return new Tab(tabObj.title,index*(w/10),w/10)
            })
            if(this.tabs.length > 0 && this.animationHandler) {
                this.animationHandler.startAnimation(this.tabs[0])
                this.contentDiv.innerHTML = this.tabObjs[0].text
            }
        }
        context.font = context.font.replace(/\d{2}/,h/30)
        this.tabs.forEach((tab)=>{
            tab.draw(context)
        })
        this.div.style.backgroundImage = `url(${canvas.toDataURL()})`
    }
    connectedCallback() {
        if(this.tabObjs && this.tabObjs.length > 0) {
            this.animationHandler = new AnimationHandler(this)
            this.render()
            this.contentDiv.style.width = this.div.style.width
            this.contentDiv.style.height = h/2
            this.div.onmousedown = (event) => {
                for(var i=0;i<this.tabs.length;i++) {
                    const tab = this.tabs[i]
                    this.contentDiv.innerHTML = this.tabObjs[i].text
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
        context.fillStyle = '#E0E0E0'
        context.fillRect(this.x,0,this.w,h/10)
        context.fillStyle = 'black'
        const tw = context.measureText(this.text).width
        context.fillText(this.text,this.x+this.w/2-tw/2,h/20)
        context.strokeStyle = 'blue'
        context.lineWidth = h/80
        context.save()
        context.translate(this.x+this.w/2,0)
        context.beginPath()
        console.log(this.lx)
        context.moveTo(-this.lx,h/12)
        context.lineTo(this.lx,h/12)
        context.stroke()
        context.restore()
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
    constructor(component) {
        this.component = component
        this.isAnimating = false
    }
    startAnimation(currTab) {
        if(this.currTab && currTab == this.currTab) {
            return 0
        }
        if(this.isAnimating == false) {
          this.isAnimating = true
          if(this.currTab) {
              this.prevTab = this.currTab
              this.prevTab.startUpdating(-1)
          }
          this.currTab = currTab
          this.currTab.startUpdating(1)
          const interval = setInterval(()=>{
              if(this.component) {
                  this.component.render()
              }
              if(this.currTab) {
                  this.currTab.update()
                  if(this.prevTab) {
                      this.prevTab.update()
                  }
                  if(this.currTab.stopped() == true)  {
                      this.isAnimating = false
                      clearInterval(interval)
                  }
              }
          },20)
        }
    }
}
customElements.define('tabs-comp',TabComponent)
