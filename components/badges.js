import { BootstrapElement } from "./element";



/**
 * See documentation at: https://getbootstrap.com/docs/5.0/components/buttons/
 */
export class Badges extends BootstrapElement {
    // attributes.

    // Create the applicaiton view.
    constructor() {
        super()

        // Innitialisation of the layout.
        this.shadowRoot.innerHTML = `
        <link href="css/bootstrap.min.css" rel="stylesheet">
        <span> 
            <slot></slot> 
        </span>
       
        `

        this.element = this.shadowRoot.querySelector("span")
        
    }

    // The connection callback.
    connectedCallback() {
        super.connectedCallback()
        // The class...
    }

}

customElements.define('bootstrap-badges', Badges)