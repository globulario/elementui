/**
 * Sample empty component, can be use to start a new component.
 */
export class BootstrapElement extends HTMLElement {
    // attributes.

    // Create the applicaiton view.
    constructor() {
        super()
        // Set the shadow dom.
        this.attachShadow({ mode: 'open' });

        // The boostrap element.
        this.element = null;

        // Innitialisation of the layout.
        this.shadowRoot.innerHTML = ``

        const observer = new MutationObserver(records => {
            this.setElementAttributes()
        })

        // Notify me of style changes
        observer.observe(this, {
            attributes: true
        });

    }

    // Make the sub-element keep same attribute as it web-component.
    setElementAttributes() {
        for (var i = this.element.attributes.length - 1; i >= 0; i--) {
            this.element.removeAttribute(this.element.attributes[i].name);
        }

        for (var i = 0; i < this.attributes.length; i++) {
            var attrib = this.attributes[i];
            this.element.setAttribute(attrib.name, attrib.value)
        }
    }

    // The connection callback.
    connectedCallback() {
        this.setElementAttributes()
    }

}

customElements.define('boostrap-element', BootstrapElement)