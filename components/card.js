import { BootstrapElement } from "./element";


/**
 * See documentation at: https://getbootstrap.com/docs/5.0/components/buttons/
 */
export class Cards extends BootstrapElement {
    // attributes.

    // Create the applicaiton view.
    constructor() {
        super()

        // Innitialisation of the layout.
        this.shadowRoot.innerHTML = `
        <link href="css/bootstrap.min.css" rel="stylesheet">
        <div class="card" style="width: 18rem;"> 
          <slot name="image"></slot>
            <div class="card-body">
                <h5 class="card-title"><slot name="title"></slot></h5>
                    <p class="card-text"><slot name="text"></slot></p>
                        <a href="#"><slot name="button"></slot></a>
            </div>
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

customElements.define('bootstrap-cards', Cards)