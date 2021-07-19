import { BootstrapElement } from "./element";



/**
 * See documentation at: https://getbootstrap.com/docs/5.0/components/buttons/
 */
export class ButtonTest extends HTMLElement {
    // attributes.

    // Create the applicaiton view.
    constructor() {
        super()
        this.attachShadow({ mode: 'open' });
        this.classBtn = this.getAttribute("class")
        // Innitialisation of the layout.
        this.shadowRoot.innerHTML = `
        <link href="css/bootstrap.min.css" rel="stylesheet">
        <button type="button" class="${this.classBtn}"> 
          <slot></slot> 
        </button>
       
        `
    }

    // The connection callback.
    connectedCallback() {


 //       this.element = this.shadowRoot.querySelector("button")
 //       this.element.innerHTML = this.innerHTML;
        // The class...
    }

}

customElements.define('bootstrap-button-test', ButtonTest)


export class ButtonGroupTest extends HTMLElement {
    // attributes.

    // Create the applicaiton view.
    constructor() {
        super()
       this.attachShadow({ mode: 'open' });
       this.classBtn = this.getAttribute("class-button")
       this.classGroup = this.getAttribute("class-group")
       this.NameBtn = this.getAttribute("btn-name")
        // Innitialisation of the layout.
        this.shadowRoot.innerHTML = `
        <link href="css/bootstrap.min.css" rel="stylesheet">    
        <div class="${this.classGroup}" role="group">        
        </div>
      
       
        `;
         this.element = this.shadowRoot.querySelector("div")
        let name_btn = this.NameBtn.split(",")
        let class_name = this.classBtn.split(",")
        for (let i = 0; i< name_btn.length; i++){
        let range = document.createRange();
        let list_html = ` 
        <button type="button" class="btn ${class_name[i]}">${name_btn[i]}</button>

        `

        this.element.appendChild(range.createContextualFragment(list_html));
            
        }

    }
    

    // The connection callback.
    connectedCallback() {

    }

}

customElements.define('bootstrap-button-test-group', ButtonGroupTest)