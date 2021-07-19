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
        if(this.className_ == undefined){
            this.className_ = this.element.className
        }

        this.element.className = this.className_

        for (var i = 0; i < this.attributes.length; i++) {
            var attrib = this.attributes[i];

            if(attrib.name == "tabindex" || attrib.name == "src" || attrib.name == "href" ){
                this.element.setAttribute(attrib.name, attrib.value)
            }else{
                this.element.classList.add(attrib.name)
            }
        }
    }

    // The connection callback.
    connectedCallback() {
        
        this.setElementAttributes()
    }

}

customElements.define('boostrap-element', BootstrapElement)