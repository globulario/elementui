
import { BootstrapElement } from "./element";
import * as bootstrap from 'bootstrap/dist/js/bootstrap.js';


export class Collapse extends BootstrapElement {
    // attributes.

    // Create the applicaiton view.
    constructor() {
        super()

        // Innitialisation of the layout.
        this.shadowRoot.innerHTML = `
        <link href="css/bootstrap.min.css" rel="stylesheet">
        <div class="collapse">
            <div class="card card-body">
                <slot></slot>
            </div>
        </div>
        `
        this.element = this.shadowRoot.querySelector(".collapse")

        this.onshow = null
        this.element.addEventListener("show.bs.collapse", ()=>{
            if(this.onshow != undefined){
                this.onshow()
            }
        })

        this.onshown = null
        this.element.addEventListener("shown.bs.collapse", ()=>{
            if(this.onshown != undefined){
                this.onshown()
            }
        })

        this.onhide = null
        this.element.addEventListener("hide.bs.collapse", ()=>{
            if(this.onhide != undefined){
                this.onhide()
            }
        })

        this.onhidden = null
        this.element.addEventListener("hidden.bs.collapse", ()=>{
            if(this.onhidden != undefined){
                this.onhidden()
            }
        })

        this.bsCollapse = new bootstrap.Collapse(this.element, {
          toggle: false
        })

    }

    // The connection callback.
    connectedCallback() {
        super.connectedCallback()
    }

    // Toggle the panel.
    toggle() {
        this.bsCollapse.toggle()
    }

    // show the panel
    show(){
        this.bsCollapse.show()
    }

    hide(){
        this.bsCollapse.hide()
    }

    dispose() {
        this.bsCollapse.dispose()
    }

}

customElements.define('bootstrap-collapse', Collapse)