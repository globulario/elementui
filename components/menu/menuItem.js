// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/iron-icons/iron-icons.js';

// List of imported functionality.
import { createElement } from "../element"
import { randomUUID } from "../utility"

/*
 * Menu item represent element contain inside a menu.
 */
class MenuItemElement extends PolymerElement {

    constructor() {
        super()

        // The parent menu.
        this.menu = null

        // The parent of the item...
        this.parent = null

        // The map of subitems.
        this.subItems = {}

    }

    /**
     * The internal component properties.
     */
    static get properties() {
        return {
            id: String,
            level: Number,
            name: String,
            action: Function,
            separator: Boolean
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
        this.style.textAlign = "left"
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].tagName == "MENU-ITEM-ELEMENT") {
                this.appendItem(this.children[i])
            }
        }
    }

    // Menu item methods
    /**
     * Append a sub menu item to an existing menu item.
     */
    appendItem(item) {
        item.parent = this
        this.subItems[item.id] = item

        if (this.menu != null) {
            this.menu.appendItem(item)
        }
    }

    /**
     * Delete a sub menu item to an existing menu item.
     */
    deleteItem() {
        // remove it from it parent,
        delete this.parent.subItems[this.id]
        var menu = document.getElementById(this.id)
        if (menu != null) {
            menu.parentNode.parentNode.removeChild(menu.parentNode)
        }
    }

    /**
     * Rename a sub menu item to an existing menu item.
     */
    renameItem(name, id) {
        delete this.parent.subItems[this.id]
        this.parent.subItems[this.id] = this
        var menu = document.getElementById(this.id)
        if (menu != null) {
            // set the new name.
            menu.firstChild.innerHTML = name
        }
    }
}

customElements.define('menu-item-element', MenuItemElement);