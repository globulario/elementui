import {Button} from "./components/buttons"
import {ButtonGroup} from "./components/buttons"
import {ButtonTest} from "./components/buttonsTest"
import {Accordion, AccordionItem} from "./components/accordion"
import {Collapse} from "./components/collapse"
import {Alerts} from "./components/alerts"
import {Badges} from "./components/badges"
import {card} from "./components/card"
import {img} from "./components/img"
import {ListGroup} from "./components/listGroup"
import {ListGroupItem} from "./components/listGroup"
import {Link} from "./components/link"
import {Modal} from "./components/modal"

function main(){
    /** That function will be call when the windows is loaded. */
    let test = `
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            margin: 0;
            font-family: var(--bs-font-sans-serif);
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #212529;
            background-color: #fff;
            -webkit-text-size-adjust: 100%;
            -webkit-tap-highlight-color: transparent;
        }
        .grid{
            display: flex;
            flex-direction: column;
            padding: 4px;
        }

        .grid div{
            padding: 4px;
        }
    </style>
    <div class="grid">
        <div>
            <bootstrap-button btn-outline-primary disabled>Disabled</bootstrap-button>
            <bootstrap-button btn-outline-primary>Enabled</bootstrap-button>
        </div>
        <div>
            <bootstrap-button-group>
                <bootstrap-button btn-primary>Left</bootstrap-button>
                <bootstrap-button btn-primary>Middle</bootstrap-button>
                <bootstrap-button btn-primary>Right</bootstrap-button>
            </bootstrap-button-group>
        </div>
        <div>
            <bootstrap-accordion always-open>
                <bootstrap-accordion-item  show>
                    <div slot="title">Accordion Item #1</div>
                    <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                </bootstrap-accordion-item>
                <bootstrap-accordion-item>
                    <div slot="title"> Accordion Item #2</div>
                    <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                </bootstrap-accordion-item>
                    <bootstrap-accordion-item>
                    <div slot="title"> Accordion Item #3</div>
                    <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                </bootstrap-accordion-item>
            </bootstrap-accordion>
        </div>
        <div>
        <div>
            <div>
                <bootstrap-button id="bootstrap-collapse-btn" btn-primary>Collapse</bootstrap-button>
            </div>
            
            <bootstrap-collapse>
                Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
            </bootstrap-collapse>
        </div>
    </div>

    <bootstrap-alerts alert-secondary>A simple primary alert—check it out!</bootstrap-alerts>

    <div>
        <bootstrap-badges badge bg-primary>Primary<bootstrap-badges>
    </div>
    <div>
        <bootstrap-button btn-primary position-relative>
        Profile
            <bootstrap-badges position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle>
                <bootstrap-badges visually-hidden>New alerts<bootstrap-badges>
            <bootstrap-badges>
        </bootstrap-button>
    </div>
    <div>
    <h1>Example heading<bootstrap-badges badge bg-primary>New<bootstrap-badges></h1>
    </div>
    <div>
    <h6>Example heading<bootstrap-badges badge bg-primary>New<bootstrap-badges></h6>
    </div>
    
    <bootstrap-cards>
    <bootstrap-images slot="image" src="https://www.w3schools.com/tags/img_girl.jpg"></bootstrap-images>
    <div slot="title">Card title</div>
    <div slot="text">Some quick example text to build on the card title and make up the bulk of the card's content.</div>
    <bootstrap-button slot="button" btn-primary>Go somewhere</bootstrap-button>
    </bootstrap-cards>

    <div style="width: 300px;">
    <bootstrap-list-group list-group-flush>
        <bootstrap-list-group-item>An active item</bootstrap-list-group-item>
        <bootstrap-list-group-item>A second item</bootstrap-list-group-item>
        <bootstrap-list-group-item>A third item</bootstrap-list-group-item>
        <bootstrap-list-group-item>A fourth item</bootstrap-list-group-item>
        <bootstrap-list-group-item>And a fifth one</bootstrap-list-group-item>
    </bootstrap-list-group>
    </div>

    <div style="width: 300px;padding-top: 80px;" >
    <bootstrap-list-group>
        <bootstrap-link href="#"  list-group-item-action active>The current link item</bootstrap-link>
        <bootstrap-link href="#"  list-group-item-action>A second link item</bootstrap-link>
        <bootstrap-link href="#"  list-group-item-action>A third link item</bootstrap-link>
        <bootstrap-link href="#"  list-group-item-action>A fourth link item</bootstrap-link>
        <bootstrap-link href="#"  list-group-item-action disabled>A disabled link item</bootstrap-link>
    </bootstrap-list-group>
    </div>

    <div style="width: 300px;padding-top: 80px;" >
        <bootstrap-button id="my-modal-btn" btn-primary>Modal</bootstrap-button>
        
            <bootstrap-modal-dialog>
                <div slot="modal-footer">
                <bootstrap-button btn-secondary data-bs-dismiss="modal">Close</bootstrap-button>
                <bootstrap-button btn-primary>Save changes</bootstrap-button>
                </div>
                ...
            </bootstrap-modal-dialog>
        

    </div>
    `
    document.body.appendChild(document.createRange().createContextualFragment(test))

    let modalBtn = document.body.querySelector("#my-modal-btn")
    let modal = document.body.querySelector("bootstrap-modal")
    modalBtn.onclick = ()=>{
        modal.show()
    }

    let collapse = document.body.querySelector("bootstrap-collapse")
    let collapse_btn = document.body.querySelector("#bootstrap-collapse-btn")

    collapse_btn.onclick = ()=>{
        collapse.toggle()
    }

    collapse.onshown = ()=>{
        console.log("---> collapse was shown!")
    }


    collapse.onhidden = ()=>{
        console.log("---> collapse was hidden!")
    }

}

window.onload = ()=>{
    main();
}