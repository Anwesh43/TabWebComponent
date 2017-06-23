const w = window.innerWidth,h = window.innerHeight
class TabComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.div = document.createElement('div')
        shadow.appendChild(this.div)
        const children = this.children
        this.tabs = children.map((child)=>{
            return {title:child.getAttribute('title'),text:child.innerHTML}
        })
        this.currIndex = 0
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = this.tabs.length * (w/10)
        canvas.height = h/30
        const context = canvas.getContext('2d')
        this.div.style.backgroundImage = `url(${canvas.toDataURL()})`
    }
    connectedCallback() {
        this.render()
    }
}
