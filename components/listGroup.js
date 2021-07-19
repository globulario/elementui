import { BootstrapElement } from "./element";

/**
 * See documentation at: https://getbootstrap.com/docs/5.0/components/buttons/
 */
export class ListGroup extends BootstrapElement {
  // attributes.

  // Create the applicaiton view.
  constructor() {
    super();

    // Innitialisation of the layout.
    this.shadowRoot.innerHTML = `

        <link href="css/bootstrap.min.css" rel="stylesheet">

        <style>
        </style>

        <ul class="list-group">
        <slot></slot>             
        </ul>
       

        
        `;

    this.element = this.shadowRoot.querySelector("ul");
  }

  // The connection callback.
  connectedCallback() {
    super.connectedCallback();
    // The class...
  }

  setElementAttributes() {
    super.setElementAttributes();
    console.log("if I can change anyone can change!");
    for(var i=0; i < this.children.length; i++){
        if(this.hasAttribute("list-group-flush")){
            this.children[i].setListGroupFlush()
        }else{
            this.children[i].resetListGroupFlush()
        }

        if(this.hasAttribute("list-group-numbered")){
            this.children[i].displayBeforeSpan()
        }else{
            this.children[i].hideBeforeSpan()
        }
    }
  }
}

customElements.define("bootstrap-list-group", ListGroup);

/**
 * See documentation at: https://getbootstrap.com/docs/5.0/components/buttons/
 */
export class ListGroupItem extends BootstrapElement {
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
       <li class="list-group-item"><span></span><slot></slot></li>
       `;

    this.element = this.shadowRoot.querySelector("li");
    this.before = this.shadowRoot.querySelector("span");

    this.parentNode.children[0].element.classList.add("rounded-top-border");

    // in case the parent has attribute list-group-flush
    if (this.parentNode.hasAttribute("list-group-flush")) {
        this.setListGroupFlush()
    }


    let index = Array.from(this.parentNode.children).indexOf(this)
    this.before.innerHTML = ++index +"."


    if(this.parentNode.hasAttribute("list-group-numbered")){
        this.displayBeforeSpan()
    }

  }

  displayBeforeSpan(){
    this.before.style.display = "inline"
  }

  hideBeforeSpan(){
    this.before.style.display = "none"
  }
  
  setListGroupFlush(){
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

  resetListGroupFlush(){
    this.element.classList.remove("list-group-flush");
    this.element.classList.remove("last");
  }

  // The connection callback.
  connectedCallback() {
    super.connectedCallback();
    // The class...
  }
}

customElements.define("bootstrap-list-group-item", ListGroupItem);
