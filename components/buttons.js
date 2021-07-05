import { BootstrapElement } from "./element";



/**
 * See documentation at: https://getbootstrap.com/docs/5.0/components/buttons/
 */
export class Button extends BootstrapElement {
    // attributes.

    // Create the applicaiton view.
    constructor() {
        super()

        // Innitialisation of the layout.
        this.shadowRoot.innerHTML = `
        <link href="css/bootstrap.min.css" rel="stylesheet">
        <button type="button" class="btn"> 
            <slot></slot> 
        </button>
       
        `

        this.element = this.shadowRoot.querySelector("button")
        this.element.innerHTML = this.innerHTML;
    }

    // The connection callback.
    connectedCallback() {
        super.connectedCallback()
        // The class...
    }

}

customElements.define('bootstrap-button', Button)


export class ButtonGroup extends BootstrapElement {
    // attributes.

    // Create the applicaiton view.
    constructor() {
        super()

        // Innitialisation of the layout.
        this.shadowRoot.innerHTML = `
        <link href="css/bootstrap.min.css" rel="stylesheet">
        <div class="btn-group" role="group"></div>
        <slot></slot>
        `
        this.element = this.shadowRoot.querySelector(".btn-group")

    }

    // The connection callback.
    connectedCallback() {
        super.connectedCallback()
        // The class...
        for (var i = 0; i < this.children.length; i++) {
            this.element.appendChild(this.children[i].element)
        }
    }

}

customElements.define('bootstrap-button-group', ButtonGroup)