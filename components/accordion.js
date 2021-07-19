import { BootstrapElement } from "./element";
import * as bootstrap from 'bootstrap/dist/js/bootstrap.js';

export class Accordion extends BootstrapElement {
    // attributes.

    // Create the applicaiton view.
    constructor() {
        super()

        // Innitialisation of the layout.
        this.shadowRoot.innerHTML = `
        <link href="css/bootstrap.min.css" rel="stylesheet">
         <div class="accordion"></div>
        <slot></slot> 
        `

        this.element = this.shadowRoot.querySelector(".accordion")
    }

    // The connection callback.
    connectedCallback() {
        super.connectedCallback()
        // The class...
        for (var i = 0; i < this.children.length; i++) {
            let item = this.children[i]
            if (this.getAttribute("always-open") != undefined) {
                item.onshow = () => {
                    for (var i = 0; i < this.children.length; i++) {
                        this.children[i].hide()
                    }
                }
            }
        }
    }

}

customElements.define('bootstrap-accordion', Accordion)


export class AccordionItem extends BootstrapElement {
    // attributes.

    // Create the applicaiton view.
    constructor() {
        super()

        // Innitialisation of the layout.
        this.shadowRoot.innerHTML = `
        <link href="css/bootstrap.min.css" rel="stylesheet">
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <slot id="accordion-item-title" name="title"></slot>
                </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <slot></slot> 
                </div>
            </div>
        </div>
        `

        this.element = this.shadowRoot.querySelector(".accordion-item")

        // get the collapse element
        this.bsCollapse = new bootstrap.Collapse(this.shadowRoot.querySelector("#collapseOne"), {
            toggle: false
        })

        this.button = this.shadowRoot.querySelector(".accordion-button")

        this.button.onclick = () => {
            this.bsCollapse.toggle()
        }

        this.shadowRoot.querySelector("#collapseOne").addEventListener("hide.bs.collapse", () => {
            this.button.classList.add("collapsed")
            if (this.onhide != undefined) {
                this.onhide(this)
            }
        })

        this.shadowRoot.querySelector("#collapseOne").addEventListener("show.bs.collapse", () => {
            this.button.classList.remove("collapsed")
            if (this.onshow != undefined) {
                this.onshow(this)
            }
        })

        this.body = this.shadowRoot.querySelector(".accordion-body")
        this.onshow = null


        this.onshown = null
        this.shadowRoot.querySelector("#collapseOne").addEventListener("shown.bs.collapse", () => {
            if (this.onshown != undefined) {
                this.onshown(this)
            }
        })

        this.onhide = null
        this.shadowRoot.querySelector("#collapseOne").addEventListener("hide.bs.collapse", () => {

        })

        this.onhidden = null
        this.shadowRoot.querySelector("#collapseOne").addEventListener("hidden.bs.collapse", () => {
            if (this.onhidden != undefined) {
                this.onhidden(this)
            }
        })

    }

    // show the panel
    show() {
        this.bsCollapse.show()
    }

    hide() {
        this.bsCollapse.hide()
    }


    // The connection callback.
    connectedCallback() {
        super.connectedCallback()
    }

}

customElements.define('bootstrap-accordion-item', AccordionItem)