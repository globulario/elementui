// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';

import { createElement } from "../element.js";
import { randomUUID } from "../utility.js";
import { setResizeable } from "../rezieable.js";
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
    this.buttonsDiv = null;
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
      ismoveable: Boolean,
      isresizeable: Boolean,
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
                display: flex;
                flex-direction: column;
                background-color: white;
                top: 0px;
                left: 0px;
                min-width: 200px;
                box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
                border-radius: 5px;
                z-index: 1;
                font-family: 'Open Sans', sans-serif;
                font-weight: 100;
                font-size: 1em;
                color: #606060;
            }
            
            .dialog_header{
                width: 100%;
                display: flex;
                align-items: center;
                color: #212121;
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
                  <div id="title" class="dialog_title modal-title unselectable">
                </div>
                <paper-icon-button id="close_btn" icon="clear" class="dialog_delete_button close"></paper-icon-button>
                </div>
                
                <slot></slot>
   
                <div class="dialog_footer modal-footer unselectable">
                    <div id="dialog_buttons_div" class="dialog_buttons">
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
      this.modalDiv = document.createElement("div");
      this.modalDiv.style.position = "fixed";
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


    this.div = this.shadowRoot.getElementById("dialog_div"); // Set it reziable.

    if (this.isresizeable) {
      setResizeable(this.div);
    }

    this.parent.appendChild(this); // Now I will set the dialog properties.

    this.buttonsDiv = this.shadowRoot.getElementById("dialog_buttons_div");
    this.closeBtn = this.shadowRoot.getElementById("close_btn");
    this.okBtn = this.shadowRoot.getElementById("ok_btn");
    this.cancelBtn = this.shadowRoot.getElementById("cancel_btn"); // Set the title

    this.titleDiv = this.shadowRoot.getElementById("title");
    this.titleDiv.innerHTML = this.title; //////////////////////// Move function ///////////////////////////

    if (this.ismoveable) {
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

      document.body.addEventListener("mousemove", this.mouseMoveListener);
    } // Close handler function.


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
  /**
   * Close the dialog
   */


  close() {
    this.div.parentNode.removeChild(this.div);
    this.parentNode.removeEventListener("mousemove", this.mouseMoveListener);

    if (this.ismodal) {
      this.modalDiv.parentNode.removeChild(this.modalDiv);
    }
  }
  /**
   * Center the dialog with it parent.
   */


  setCentered() {
    var docEl = document.documentElement;
    var body = document.body;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft; // I will set the position of the dialog 

    this.x = (this.parent.offsetWidth - scrollLeft - this.div.offsetWidth) / 2 + scrollLeft;
    this.div.style.left = this.x + "px";
    this.y = (window.innerHeight - this.div.offsetHeight) / 2;
    this.div.style.top = this.y + "px";
  }
  /**
   * Set the dialog position in the screen
   * @param {*} x The horizontal postion
   * @param {*} y The vertical position
   */


  setPosition(x, y) {
    /* I will set the position of the dialog **/
    this.x = x;
    this.div.style.left = this.x + "px";
    this.y = y;
    this.div.style.top = this.y + "px";
  } //////////////// Getter //////////////////

  /**
   * return the div of the dialog.
   */


  getDiv() {
    return this.div;
  }
  /**
   * Return a reference to the ok button
   */


  getOkBtn() {
    return this.okBtn;
  }
  /**
   * Return a reference to the cancel button
   */


  getCancelBtn() {
    return this.cancelBtn;
  }
  /**
   * Return a reference to the buttons div.
   */


  getButtonsDiv() {
    return this.buttonsDiv;
  }
  /**
   * Return a reference to the close button
   */


  getCloseBtn() {
    return this.closeBtn;
  }
  /**
   * Return a reference to the titlte div
   */


  getTitleDiv() {
    return this.titleDiv;
  } ///////////////////////////// method /////////////////////////////////

  /**
   * Append a new button with a given text and return a reference to 
   * the newly created button.
   * @param {*} text The button text
   * @param {*} index The position relative to other btn
   * @param {*} icon The icon as need
   */


  appendButton(text, index, icon) {
    var btn;

    if (icon != undefined) {
      btn = document.createElement("paper-icon-button");
      btn.icon = icon;
    } else {
      btn = document.createElement("paper-button");
    }

    btn.innerHTML = text;

    if (index != undefined) {
      this.buttonsDiv.insertBefore(btn, this.buttonsDiv.children[index]);
    } else {
      this.buttonsDiv.appendChild(btn);
    }

    return btn;
  }

}
customElements.define('dialog-element', DialogElement);