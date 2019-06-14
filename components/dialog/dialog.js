// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';

// List of imported functionality.
import { createElement } from "../element"
import { randomUUID } from "../utility"


/*
 * Menu item represent element contain inside a menu.
 */
export class DialogElement extends PolymerElement {
  // Constructor.
  constructor() {
    super();
    this.div = null;
    this.titleDiv = null; // btn actions.

    this.cancelBtn = null;
    this.okBtn = null;
    this.closeBtn = null;
    /* Property used to move the dialog **/

    this.isMoving = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }
  /**
   * The internal component properties.
   */


  static get properties() {
    return {
      title: String,
      ismodal: Boolean,
      onclose: Function,
      onok: Function,
      oncancel: Function
    };
  }

  static get template() {
    return html`
            <style>
            /** Dialog style **/
            .dialog{
                position: absolute;
                background-color: white;
                top: 0px;
                left: 0px;
                min-width: 200px;
                -webkit-box-shadow: 0px 0px 15px 0px;
                -moz-box-shadow: 0px 0px 15px 0px;
                box-shadow: 0px 0px 15px 0px;
                border: 1px solid;
                z-index: 1;
            }
            
            .dialog_header{
                width: 100%;
                display: flex;
                align-items: center;
            }
            
            /** The title **/
            .dialog_header span{
                font-size: 10pt;
                font-family: Arial, Helvetica, sans-serif;
                color: black;
                text-align: left;
            }
            
            /** The title **/
            .dialog_title{
                width: 100%;
                padding: 1px;
                text-align: center;
            }
            
            /** The delete button **/
            .dialog_delete_button{
                /*color: gainsboro;*/
                display: flex;
                justify-content: center;
                align-items: center;
                min-width: 16px;
                z-index: 10;
            }
            
            .dialog_delete_button i:hover {
                cursor: pointer;
                transition: all .2s ease;
            }
            
            .unselectable{
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            
            .dialog_footer{
                display: flex;
                position: relative;
                text-align: center;
                vertical-align: middle;
                justify-content: flex-end;
                padding: 1px;
            }
            
            /** In case of iframe content **/
            .dialog_content iframe{
                outline: none;
                border: none;
            }
            
            .dialog_content span{
                display: table-cell;
                vertical-align: middle;
                padding: 10px;
            }
            
            /** Buttons of the dialog **/
            .diablog_button{
                display: inline-flex;
                height: 29px;
                min-width: 60px;
                justify-content: center;
                align-items: center;
                border: 1px solid transparent;
            }
            
            .diablog_button:hover{
                cursor: pointer;
                border-color: white;
            }
            
            .diablog_button:active{
                border: solid 1px lightblue;
            }
            </style>

            <div id="dialog_div" class="dialog modal-content">
                <div class="dialog_header modal-header">
                    <div style = "height: 40px;display: table;" >
                        <div style="display: table-cell; vertical-align: middle;" id="title" class="dialog_title modal-title unselectable">
                    </div>
                </div>
                <paper-icon-button id="close_btn" icon="clear" class="dialog_delete_button close"></paper-icon-button>
                </div>
                
                <slot></slot>
   
                <div class="dialog_footer modal-footer">
                    <div class="dialog_buttons">
                        <paper-button id="ok_btn"  class="dialog_buttons">Ok</paper-button>
                        <paper-button id="cancel_btn" class="dialog_buttons">Cancel</paper-button>
                    </div>
                </div>
            </div>
    `;
  }
  /**
   * That function is call when the table is ready to be diplay.
   */


  ready() {
    super.ready();

    if (this.ismodal) {
      var body = document.getElementsByTagName("body")[0];
      var html = document.getElementsByTagName("html")[0];
      this.modalDiv = document.createElement("div");
      this.modalDiv.style.position = "absolute";
      this.modalDiv.style.top = "0px";
      this.modalDiv.style.left = "0px";
      this.modalDiv.style.height = "100%";
      this.modalDiv.style.width = "100%";
      this.modalDiv.style.backgroundColor = "rgba(0,0,0,.25)";
      this.modalDiv.style.zIndex = "1000";
      this.modalDiv.style.display = "block";
      document.body.appendChild(this.modalDiv);
      this.parent = this.modalDiv;
    } // The dialog div.


    this.div = this.shadowRoot.getElementById("dialog_div");
    this.parent.appendChild(this); // Now I will set the dialog properties.

    this.closeBtn = this.shadowRoot.getElementById("close_btn");
    this.okBtn = this.shadowRoot.getElementById("ok_btn");
    this.cancelBtn = this.shadowRoot.getElementById("cancel_btn"); // Set the title

    this.titleDiv = this.shadowRoot.getElementById("title");
    this.titleDiv.innerHTML = this.title;
    this.titleDiv.parentNode.style.width = this.div.offsetWidth - this.closeBtn.offsetWidth + "px";

    this.titleDiv.parentNode.onmousedown = function (dialog) {
      return function (evt) {
        if (evt.which == 1) {
          dialog.isMoving = true;
          dialog.offsetX = evt.offsetX;
          dialog.offsetY = evt.offsetY;
        }
      };
    }(this);

    this.mouseUpListener = this.titleDiv.parentNode.onmouseup = function (dialog) {
      return function (evt) {
        if (evt.which == 1) {
          dialog.isMoving = false;
          dialog.offsetX = 0;
          dialog.offsetY = 0;
        }
      };
    }(this);

    document.body.addEventListener("mouseup", this.mouseUpListener);

    this.mouseMoveListener = function (dialog) {
      return function (evt) {
        if (dialog.isMoving == true) {
          var rect = dialog.parent.getBoundingClientRect();
          var body = document.body;
          var docEl = document.documentElement;
          var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
          var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft; // Here i will calculate the new position of the dialogue...

          var x = evt.pageX;
          var y = evt.pageY; // Now the new postion of the dialog...

          dialog.x = x - dialog.offsetX - rect.left - scrollLeft;
          dialog.y = y - dialog.offsetY - rect.top - scrollTop;
          dialog.div.style.left = dialog.x + "px";
          dialog.div.style.top = dialog.y + "px";
        }
      };
    }(this);
    /*this.div.parentNode.*/


    document.body.addEventListener("mousemove", this.mouseMoveListener);

    var closeHandler = function (dialog) {
      return function (evt) {
        evt.stopPropagation();
        dialog.parentNode.removeEventListener("mousemove", dialog.mouseMoveListener);

        if (dialog.ismodal) {
          dialog.modalDiv.parentNode.removeChild(dialog.modalDiv);
        }

        if (this.id == "close_btn") {
          if (dialog.onclose != undefined) {
            dialog.onclose();
          }
        } else if (this.id == "cancel_btn") {
          if (dialog.oncancel != undefined) {
            dialog.oncancel();
          }
        }

        dialog.div.parentNode.removeChild(dialog.div);
      };
    }(this);
    /* The button action **/


    this.cancelBtn.onclick = closeHandler;
    this.closeBtn.onclick = closeHandler;

    this.okBtn.onclick = function (dialog) {
      return function () {
        if (dialog.onok != undefined) {
          dialog.onok();
        }

        dialog.closeBtn.click();
      };
    }(this);

    this.setCentered();
  }

  close() {
    this.removeChild(this.div);
    this.parent.element.removeEventListener("mousemove", this.mouseMoveListener);

    if (this.ismodal) {
      this.modalDiv.parentNode.removeChild(this.modalDiv);
    }
  }

  setCentered() {
    var docEl = document.documentElement;
    var body = document.body;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft; // I will set the position of the dialog 

    this.x = (this.parent.offsetWidth - scrollLeft - this.div.offsetWidth) / 2 + scrollLeft;
    this.div.style.left = this.x + "px";
    this.y = (window.innerHeight - this.div.offsetHeight) / 2;
    this.div.style.top = this.y + "px";
  }

  setPosition(x, y) {
    /* I will set the position of the dialog **/
    this.x = x;
    this.div.style.left = this.x + "px";
    this.y = y;
    this.div.style.top = this.y + "px";
  }

  fitWidthToContent() {
    this.content.style.width = "auto";
    this.div.style.width = this.content.clientWidth + "px";
  }

}
customElements.define('dialog-element', DialogElement);