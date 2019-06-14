// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';

// List of imported functionality.
import { createElement } from "../element.js"
import { randomUUID } from "../utility.js"

class LanguageSelectorElement extends PolymerElement {
    constructor() {
        super();
    }

    /**
     * The internal component properties.
     */
    static get properties() {
        return {
            pagesize : Number
        }
    }

    static get template() {
        return html`
            <slot></slot>
    `;
    }

    /**
     * That function is call when the table is ready to be diplay.
     */
    ready() {
        super.ready();
    }

}

customElements.define('language-selector-element', ApplicationMenuElement);