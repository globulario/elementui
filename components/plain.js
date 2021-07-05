/**
 * Sample empty component, can be use to start a new component.
 */
export class Empty extends HTMLElement {
    // attributes.

    // Create the applicaiton view.
    constructor() {
        super()
        // Set the shadow dom.
        this.attachShadow({ mode: 'open' });

        // Innitialisation of the layout.
        this.shadowRoot.innerHTML = `
        <style>
            ${theme}
            #container{
            }
        </style>
        <div id="container">
        </div>
        `
        // give the focus to the input.
        let container = this.shadowRoot.querySelector("#container")
    }

    // The connection callback.
    connectedCallback() {

    }

    // Call search event.
    hello() {

    }
}

customElements.define('boostrap-5-empty', Empty)