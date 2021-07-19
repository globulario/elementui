import { BootstrapElement } from "./element";

/**
 * See documentation at: https://getbootstrap.com/docs/5.0/components/buttons/
 */
export class Link extends BootstrapElement {
  // attributes.

  // Create the applicaiton view.
  constructor() {
    super();

    // Innitialisation of the layout.
    this.shadowRoot.innerHTML = `
        <link href="css/bootstrap.min.css" rel="stylesheet">
       
        <style>
        .rounded-top-border {
            backgroud-color: pink;
            border-top-right-radius: .25em;
            border-top-left-radius: .25em;
        }

        .list-group-flush {
            border-width: 0 0 1px;
        }
        
        .last{
            border: none;
        }

       
        span{
            padding-right: 5px;
            display: none;
        }
        </style>  
      
        <a href="" class="list-group-item list-group-item-action"><span></span><slot></slot></a>
        `;
    this.element = this.shadowRoot.querySelector("a");
    this.before = this.shadowRoot.querySelector("span");
    this.parentNode.children[0].element.classList.add("rounded-top-border");

    // in case the parent has attribute list-group-flush
    if (this.parentNode.hasAttribute("list-group-flush")) {
      this.setListGroupFlush();
    }
  }

  // The connection callback.
  connectedCallback() {
    super.connectedCallback();
    // The class...
  }

  setListGroupFlush() {
    this.element.classList.add("list-group-flush");
    if (
      this.parentNode.children[this.parentNode.children.length - 1].element !=
      undefined
    ) {
      this.parentNode.children[
        this.parentNode.children.length - 1
      ].element.classList.add("last");
    }
  }

  resetListGroupFlush() {
    this.element.classList.remove("list-group-flush");
    this.element.classList.remove("last");
  }

  displayBeforeSpan(){
    this.before.style.display = "inline"
  }

  hideBeforeSpan(){
    this.before.style.display = "none"
  }
  
}

customElements.define("bootstrap-link", Link);
