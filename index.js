import {Button} from "./components/buttons"
import {Accordion, AccordionItem} from "./components/accordion"
import {Collapse} from "./components/collapse"
function main(){
    /** That function will be call when the windows is loaded. */
    let test = `
    <style>
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
            <bootstrap-button class="btn btn-outline-primary" disabled>Disabled</bootstrap-button>
            <bootstrap-button class="btn btn-outline-primary">Enabled</bootstrap-button>
        </div>
        <div>
            <bootstrap-button-group class="btn-group" role="group">
                <bootstrap-button class="btn btn-primary">Left</bootstrap-button>
                <bootstrap-button class="btn btn-primary">Middle</bootstrap-button>
                <bootstrap-button class="btn btn-primary">Right</bootstrap-button>
            </bootstrap-button-group>
        </div>
        <div>
            <bootstrap-accordion  class="accordion" always-open>
                <bootstrap-accordion-item class="accordion-item show">
                    <div slot="title"> Accordion Item #1</div>
                    <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                </bootstrap-accordion-item>
                <bootstrap-accordion-item class="accordion-item">
                    <div slot="title"> Accordion Item #2</div>
                    <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                </bootstrap-accordion-item>
                    <bootstrap-accordion-item class="accordion-item">
                    <div slot="title"> Accordion Item #3</div>
                    <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                </bootstrap-accordion-item>
            </bootstrap-accordion>
        </div>
        <div>
        <div>
            <div>
                <bootstrap-button id="bootstrap-collapse-btn" class="btn btn-primary">Collapse</bootstrap-button>
            </div>
            
            <bootstrap-collapse>
                Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
            </bootstrap-collapse>
        </div>
    </div>
    `
    document.body.appendChild(document.createRange().createContextualFragment(test))

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