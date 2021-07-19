import { BootstrapElement } from "./element";



/**
 * See documentation at: https://getbootstrap.com/docs/5.0/components/buttons/
 */
export class Alerts extends BootstrapElement {
    // attributes.

    // Create the applicaiton view.
    constructor() {
        super()

        // Innitialisation of the layout.
        this.shadowRoot.innerHTML = `
        <link href="css/bootstrap.min.css" rel="stylesheet">
        <div class="alert" role="alert"> 
            <slot></slot> 
        </div>
       
        `

        this.element = this.shadowRoot.querySelector("div")
       
    }

    // The connection callback.
    connectedCallback() {
        super.connectedCallback()
        // The class...
    }

}

customElements.define('bootstrap-alerts', Alerts)
