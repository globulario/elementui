import { BootstrapElement } from "./element";
import * as bootstrap from 'bootstrap/dist/js/bootstrap.js';


/**
 * See documentation at: https://getbootstrap.com/docs/5.0/components/buttons/
 */
export class Modal extends BootstrapElement {
    // attributes.

    // Create the applicaiton view.
    constructor() {
        super()

        // Innitialisation of the layout.
        this.shadowRoot.innerHTML = `
        <link href="css/bootstrap.min.css" rel="stylesheet">
        
        <!-- Modal -->
        <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <slot></slot>
        </div>
        `

        this.element = this.shadowRoot.querySelector("#myModal")
      //  this.myInput = this.shadowRoot.querySelector("#myInput")
      this.Modal = new bootstrap.Modal(this.element, {
        keyboard: false 
      })
  
    }

    // The connection callback.
    connectedCallback() {
        super.connectedCallback()
        // The class...
    }

    show(){
        this.Modal.toggle()
    }

    hide(){
        this.Modal.dismiss()
    }

}

customElements.define('bootstrap-modal', Modal)

/**
 * See documentation at: https://getbootstrap.com/docs/5.0/components/buttons/
 */
 export class ModalDialog extends BootstrapElement {
    // attributes.

    // Create the applicaiton view.
    constructor() {
        super()

        // Innitialisation of the layout.
        this.shadowRoot.innerHTML = `
        <link href="css/bootstrap.min.css" rel="stylesheet">
        
        <!-- Modal -->
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <slot></slot>
                </div>
                <div class="modal-footer">
                <slot name="modal-footer">

                </slot>
                </div>
            </div>
        </div>
        `

        this.element = this.shadowRoot.querySelector(".modal-dialog")

    }

    // The connection callback.
    connectedCallback() {
        super.connectedCallback()
        // The class...
    }

}

customElements.define('bootstrap-modal-dialog', ModalDialog)