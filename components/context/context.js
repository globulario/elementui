// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';

import { createElement } from "../element.js";
import { isString, parseFunction } from "../utility.js";

/**
 * The context element.
 */
export class ContextElement extends PolymerElement {
  constructor() {
    super();
    this.button = null;
    this.div = null;
    this.side = "left";
    this.speed = 1000;
    this.shadow = 0;
    this.isActive = false;
  }

  /**
   * The internal component properties.
   */
  static get properties() {
    return {
      title: String,
      icon: String,
      id: String,
      isactive: Boolean,
      isexpended: Boolean
    };
  }

  static get template() {
    return html`
        <style>
        </style>
        <slot></slot>
    `;
  }

  show() {
    var offset = "100%";

    if (this.side == "left") {
      offset = "-" + offset;
    }

    var player = this.div.animate([{
      transform: 'translate( ' + offset + ', 0px)'
    }, {
      transform: 'translate( 0px, 0px)'
    }], this.speed);

    player.onfinish = function (contextElement) {
      return function (e) {
        // apply the transformation here.
        contextElement.div.style.transform = "";
      };
    }(this);
  }

  hide() {
    var offset = "100%";

    if (this.side == "left") {
      offset = "-" + offset;
    }

    var player = this.div.animate([{
      transform: 'translate( 0px, 0px)'
    }, {
      transform: 'translate( ' + offset + ', 0px)'
    }], this.speed);

    player.onfinish = function (contextElement, offset) {
      return function (e) {
        // apply the transformation here.
        contextElement.div.style.transform = "translate( " + offset + ", 0px)";
      };
    }(this, offset);
  }

  /**
   * That function is call when the table is ready to be diplay.
   */
  ready() {
    super.ready();
  }

}
customElements.define('context-element', ContextElement);

/**
 * The context selector.
 */
export class ContextSelectorElement extends PolymerElement {
  constructor() {
    super();
    this.contexts = {};
    this.context_buttons = null;
    this.context_divs = null;
  }

  /**
   * The internal component properties.
   */
  static get properties() {
    return {
      side: String,
      speed: Number,
      shadow: Number,
      minwidth: Number,
      oncontextchange: Function
    };
  }

  /**
   *
   */
  static get template() {
    return html`
            <style>
                .active_context_button{
                    color: white;
                }

                #context_buttons{
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    background-color: #005662;
                    z-index: 100;
                }

                #context_divs{
                    height: 100%;
                    position: relative;
                }

            </style>

            <div id="context_buttons"></div>
            <div id="context_divs"></div>

            <slot></slot>
    `;
  }

  /**
   * That function is call when the table is ready to be diplay.
   */
  ready() {
    super.ready();
    this.style.display = "flex";
    this.context_buttons = this.shadowRoot.getElementById("context_buttons");
    this.context_divs = this.shadowRoot.getElementById("context_divs");

    if (this.shadow == undefined) {
      this.shadow = 0;
    }

    if (this.speed == undefined) {
      this.speed = 250;
    }

    if (this.side == undefined) {
      this.side = "left";
    }

    if (this.minwidth == undefined) {
      this.minwidth = 300;
    }

    if (this.side == "left") {
      this.context_divs.style.marginRight = this.minwidth + "px";
    } else {
      this.context_divs.style.marginLeft = this.minwidth + "px";
    }

    var contexts = this.getElementsByTagName("context-element");

    for (var i = 0; i < contexts.length; i++) {
      this.appendContext(contexts[i]);

      if (i == 0) {
        contexts[i].button.classList.add("active_context_button");
      }
    }
  }

  show() {
    var offset = this.minwidth + "px";
    var player;

    if (this.side == "left") {
      offset = "-" + offset;
      player = this.context_divs.animate([{
        marginRight: "0px"
      }, {
        marginRight: offset
      }], this.speed);
    } else {
      player = this.context_divs.animate([{
        marginLeft: "0px"
      }, {
        marginLeft: offset
      }], this.speed);
    }

    player.onfinish = function (contextSelectorElement) {
      return function (e) {
        // apply the transformation here.
        if (contextSelectorElement.side == "left") {
          contextSelectorElement.context_divs.style.marginRight = contextSelectorElement.minwidth + "px";
        } else {
          contextSelectorElement.context_divs.style.marginLeft = contextSelectorElement.minwidth + "px";
        }
      };
    }(this);
  }

  hide() {
    var offset = this.minwidth + "px";
    var player;

    if (this.side == "left") {
      offset = "-" + offset;
      player = this.context_divs.animate([{
        marginRight: offset
      }, {
        marginRight: "0px"
      }], this.speed);
    } else {
      player = this.context_divs.animate([{
        marginLeft: offset
      }, {
        marginLeft: "0px"
      }], this.speed);
    }

    player.onfinish = function (contextSelectorElement, offset) {
      return function (e) {
        // apply the transformation here.
        if (contextSelectorElement.side == "left") {
          contextSelectorElement.context_divs.style.marginRight = "0px";
        } else {
          contextSelectorElement.context_divs.style.marginLeft = "0px";
        }
      };
    }(this, offset);
  }

  /**
   * Append context.
   */
  appendContext(context) {
    // Set the context properties.
    context.side = this.side;
    context.speed = this.speed;
    context.shadow = this.shadow; // Here I will dynamically create the button and the div.

    context.button = document.createElement("paper-icon-button");
    context.button.id = context.id + "_btn";
    context.button.title = context.title;
    context.button.icon = context.icon;
    context.button.style.width = "50px";
    context.button.style.height = "50px";
    context.button.classList.add("context-button");
    this.context_buttons.appendChild(context.button); // The div.

    context.div = document.createElement("div");
    context.div.style.position = "absolute";
    context.div.style.minWidth = this.minwidth + "px";
    context.div.style.backgroundColor = "white";
    context.div.style.top = "0px";
    context.div.style.bottom = "0px";
    context.div.style.borderRight = "1px solid lightgray";

    window.addEventListener('resize', (event) => {
      // do stuff here
      var isActive = context.button.classList.contains("active_context_button");
      if (isActive) {
        if (this.side == "left") {
          this.context_divs.style.marginRight = context.div.offsetWidth + "px";
        } else {
          this.context_divs.style.marginLeft = context.div.offsetWidth + "px";
        }
      }
    });

    context.button.onclick = function (contextSelector, context) {
      return function () {
        var isActive = context.button.classList.contains("active_context_button");
        for (var id in contextSelector.contexts) {
          var ctx = contextSelector.contexts[id];
          ctx.button.classList.remove("active_context_button"); // Here I will also hide it div

          ctx.div.style.display = "none";

          if (context.div.style.transform.length == 0) {
            ctx.div.style.transform = "";
          }
          ctx.isActive = false;
        } // show the div for animation

        context.isActive = true;
        context.div.style.display = ""; // Append the visible.
        context.button.classList.add("active_context_button"); // If the context is active.

        if (isActive) {
          if (context.div.style.transform.length == 0) {
            context.hide();
            contextSelector.hide();
          } else {
            context.show();
            contextSelector.show();
          }
        }

        if (contextSelector.oncontextchange != undefined) {
          var oncontextchange
          if (isString(contextSelector.oncontextchange)) {
            oncontextchange = parseFunction(contextSelector.oncontextchange)
          } else {
            oncontextchange = contextSelector.oncontextchange
          }
          // call the function onchange.
          oncontextchange(context)
        }
      };
    }(this, context); // Append element from context slot to divs element.


    for (var i = 0; i < context.children.length; i++) {
      context.div.appendChild(context.children[i]);
    } // Append the div.

    this.context_divs.appendChild(context.div);
    this.contexts[context.id] = context;
  }

  setContext(id) {

    var context = this.contexts[id]
    if (context == undefined) {
      return;
    }
    if (context.isActive) {
      return
    }

    for (var id in this.contexts) {
      var ctx = this.contexts[id];
      ctx.button.classList.remove("active_context_button"); // Here I will also hide it div
      ctx.div.style.display = "none";
      if (context.div.style.transform.length == 0) {
        ctx.div.style.transform = "";
      }
    } // show the div for animation

    context.button.classList.add("active_context_button"); // If the context is active.
    context.div.style.display = ""; // Append the visible.

    if (this.side == "left") {
      this.context_divs.style.marginRight = this.minwidth + "px";
    } else {
      this.context_divs.style.marginLeft = this.minwidth + "px";
    }
  }

}
customElements.define('context-selector-element', ContextSelectorElement);