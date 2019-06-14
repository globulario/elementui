/**
 * That class is use to display a message to a user.
 */

// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/iron-icons/iron-icons.js';

// Those are imported to enable use of paper and iron element.
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';

// simple html5 functionality from Cargo.
import { createElement } from "../element.js"
import { randomUUID } from "../utility.js"
var __dragOver__ = null

var __dragOver__ = null;

class GrowlElement extends PolymerElement {
  constructor() {
    super(); // Generate a random uuid.

    this.id = randomUUID(); // The growl external div.

    this.div; // The shadow offset.

    this.shadow = 6; // width and heigth

    this.w = 200;
    this.h = 150; // The time the growl is display, -1 mean 
    // stay visible all the time but closeable.

    this.delay = -1; // The animation spent time.

    this.speed = 1;
    this.side = "right";
  }
  /**
   * The internal component properties.
   */


  static get properties() {
    return {
      // The width in pixel
      w: Number,
      // The heigth in pixel
      h: Number,
      // The time in millisecond before the panel is hidden.
      delay: Number,
      speed: Number,
      // Style properties.
      shadow: Number,
      // chose the side where the growl will be display.
      side: String
    };
  }

  static get template() {
    return html`
        <div id={$this.id}>
            <slot></slot>
        </div>
    `;
  }

  get width() {
    return this.w + "px";
  }

  get heigth() {
    return this.h + "px";
  }

  show() {
    var keyframe = "100% { " + this.side + ":" + this.shadow + "px;}";
    this.div.element.style.display = "";
    this.div.animate(keyframe, this.speed, function (growlElement) {
      return function () {
        growlElement.div.element.style[growlElement.side] = growlElement.shadow + "px";
      };
    }(this));
  }

  hide() {
    var keyframe = "100% { " + this.side + ":" + -1 * this.w + this.shadow + "px;}";
    this.div.animate(keyframe, this.speed, function (growlElement) {
      return function () {
        growlElement.div.element.style[growlElement.side] = -1 * (growlElement.w + growlElement.shadow) + "px"; // Now I will set the position of all reminding growl panel.

        var growls = document.getElementById("growls_" + growlElement.side);
        growls.removeChild(growlElement.div.element);

        if (growls.childNodes.length == 0) {
          growls.parentNode.removeChild(growls);
        } else {
          for (var i = 0; i < growls.childNodes.length; i++) {
            growls.childNodes[i].style.top = (growlElement.h + 10) * getChildNumber(growls.childNodes[i]) + "px";
          }
        }
      };
    }(this));
  } // I will build the component around the slot content...


  ready() {
    super.ready(); // Keep the inner value

    var content = this.innerHTML;
    this.innerHTML = ""; // Here I will get the actual parent

    var parent = this.parentNode;

    if (parent.id != "growls_" + this.side) {
      // Here I will create a new div that will old all growl panel...
      var growls = document.getElementById("growls_" + this.side);
      var top = window.pageYOffset || document.documentElement.scrollTop;

      if (growls == undefined) {
        growls = document.createElement("div");
        growls.id = "growls_" + this.side;
        growls.style.position = "absolute";
        growls.style.width = this.w + 2 * this.shadow + "px";
        growls.style.paddingLeft = this.shadow + "px";
        growls.style.paddingRigth = this.shadow + "px";
        growls.style.top = top + "px";
        growls.style[this.side] = "0px";
        growls.style.bottom = -1 * top + "px";
        growls.style.overflow = "hidden";
        parent.removeChild(this);
        parent.appendChild(growls);
        parent.style.zIndex = 1001;

        growls.ondrop = function (e) {
          console.log("I'm drop!");
        };
      }

      growls.appendChild(this);
      window.addEventListener('scroll', function (growls) {
        return function (e) {
          var top = window.pageYOffset || document.documentElement.scrollTop;
          growls.style.top = top + "px";
          growls.style.bottom = -1 * top + "px";
        };
      }(growls));
    } // Create the growl panel...


    this.div = createElement(document.getElementById(this.id)); // Set it position...

    this.div.element.style.position = "absolute";
    this.div.element.style.top = (this.h + 10) * getChildNumber(this.div.element) + "px"; // Set the draggable propertie.

    this.draggable = "true";

    this.ondragstart = function () {
      this.style.opacity = '0.4';
    };

    this.ondragend = function () {
      this.style.opacity = ''; // console.log("---> move ", getChildNumber(this), " to ", getChildNumber(__dragOver__))
      //var growls = __dragOver__.parentNode

      /*growls.insertBefore(__dragOver__, this);
      for (var i = 0; i < growls.childNodes.length; i++) {
          growls.childNodes[i].style.top = (growls.childNodes[i].h + 10) * getChildNumber(growls.childNodes[i]) + "px"
      }*/

      __dragOver__ = null;
    }; // Set the drag index on drag enter index.


    this.ondragenter = function () {
      __dragOver__ = this;
    };

    this.div.element.style[this.side] = -1 * (this.w + this.shadow) + "px"; // The div that contain the element.

    var shadow = this.shadow;

    if (this.side == "right") {
      shadow = -1 * shadow;
    }

    var div = this.div.appendElement({
      "tag": "div",
      "style": "width: " + this.width + "; min-height: " + this.heigth + "; position: relative; box-shadow: " + shadow + "px " + this.shadow + "px 12px -6px rgba(0,0,0,0.75);"
    }).down();
    div.appendElement({
      "tag": "div",
      "style": "position: absolute; top:0px; left: 0px; bottom: 0px; right: 0px; display: flex; align-items: center; justify-content: center;",
      "innerHtml": content
    }); // hide the panel automaticaly if the delay i greather than 0.

    if (this.delay > 0) {
      setTimeout(function (growlElement) {
        return function () {
          growlElement.hide();
        };
      }(this), this.delay);
    } else {
      // The close button.
      var closeBtn = div.appendElement({
        "tag": "paper-icon-button",
        "icon": "close",
        "title": "Close it!",
        "style": "position: absolute; top: 0px; right: 0px"
      }).down(); // The close button action.

      closeBtn.element.onclick = function (growlElement) {
        return function () {
          growlElement.hide();
        };
      }(this);
    } // Show the growl panel.


    this.show();
  }

}

customElements.define('growl-element', GrowlElement); // simple function to get element index in it parent.

function getChildNumber(node) {
  return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
}