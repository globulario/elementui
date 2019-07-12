// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js'

import { createElement } from "../element.js";
import { randomUUID, parseFunction } from "../utility.js";

class LoginElement extends PolymerElement {
  constructor() {
    super();
    this.loginBtn = null;
    this.loginPanel = null;
    this.loggedBtn = null;
    this.loggedPanel = null;
    this.userInput = null;
    this.pwdInput = null;
    this.displayName = null;
  }
  /**
   * The internal component properties.
   */


  static get properties() {
    return {
      side: String,
      speed: Number,
      login_btn_txt: String,
      user_input_label: String,
      pwd_input_label: String,
      user_display_name: String,
      onlogin: Function,
      onlogout: Function,
      login: Function
    };
  }

  static get template() {
    return html`
            <style>
                .panel{
                    background-color: white;
                    position: absolute;
                    min-width: 200px;
                    -webkit-box-shadow: 0px 0px 15px 0px;
                    -moz-box-shadow: 0px 0px 15px 0px;
                    box-shadow: 0px 0px 15px 0px;
                    border: 1px solid grey;
                    z-index: 1;
                    padding: 10px;
                }

                #login-box{
                    display: flex; 
                    flex-direction: column;
                }

                #logged-box{
                  display: flex; 
                  flex-direction: column;
                }

                #logout-btn{
                  color: rgb(32, 33, 36);
                  align-self: flex-end;
                }

            </style>
            <div style="position: relative;">
                <paper-button id="login-btn">Login</paper-button>
                <div id="login-panel" class="panel" style="display: none;">
                    <div id="login-box">
                        <paper-input id="user-id" label="User name" auto-validate></paper-input>
                        <paper-input id="pwd-id" auto-validate type="password" id="pwd-id" label="Password"></paper-input>
                    </div>
                </div>

                <span id="display-user-name"></span>
                <paper-icon-button icon="account-circle" id="logged-btn", style="display: none;"></paper-icon-button>
                <div id="logged-panel" class="panel" style="display: none;">
                    <div id="logged-box">
                      <slot></slot>
                      <paper-icon-button icon="exit-to-app" id="logout-btn"></paper-icon-button>
                    </div>
                </div>
            </div>
    `;
  }
  /**
   * That function is call when the table is ready to be diplay.
   */


  ready() {
    // Here I will get grip on the shadow root element.
    super.ready(); // The login button.

    this.loginBtn = this.shadowRoot.getElementById("login-btn"); // Here I will set the text

    if (this.login_btn_txt != undefined) {
      loginBtn.innerHTML = this.login_btn_txt;
    }

    this.loginPanel = createElement(this.shadowRoot.getElementById("login-panel"));
    this.loggedBtn = this.shadowRoot.getElementById("logged-btn"); // Here I will set the text

    this.loggedPanel = createElement(this.shadowRoot.getElementById("logged-panel"));

    if (this.side == undefined) {
      this.side = "left";
    }

    if (this.speed == undefined) {
      this.speed = 1000;
    } // display the login button.


    this.userInput = this.shadowRoot.getElementById("user-id");
    this.pwdInput = this.shadowRoot.getElementById("pwd-id");

    if (this.login != undefined) {
      this.login = parseFunction(this.login);
    }

    this.displayName = this.shadowRoot.getElementById("display-user-name");

    if (this.onlogin != undefined) {
      // this.onlogin = parseFunction(this.onlogin)
      var onlogin = parseFunction(this.onlogin);

      this.onlogin = function (loginElement, onlogin) {
        return function (param) {
          loginElement.hide();
          onlogin(param);
        };
      }(this, onlogin);
    } // Logout to be call when the logout button is click.


    if (this.onlogout != undefined) {
      var onlogout = parseFunction(this.onlogout);

      this.onlogout = function (loginElement, onlogout) {
        return function () {
          loginElement.clear();
          onlogout();
        };
      }(this, onlogout);
    }

    this.pwdInput.onkeyup = function (loginElement, userInput) {
      return function (evt) {
        if (evt.keyCode == 13) {
          // Call the function.
          loginElement.login(loginElement, userInput.value, this.value);
        }

        if (this.value.lenght == 0) {
          this.setAttribute('invalid', false);
        }
      };
    }(this, this.userInput);

    this.loginBtn.onclick = function (loginElement, side) {
      return function () {
        loginElement.loginPanel.element.style.top = this.offsetHeight + "px";
        loginElement.loginPanel.element.style[side] = "0px";

        if (loginElement.loginPanel.element.style.display == "none") {
          loginElement.loginPanel.element.style.display = "";
          loginElement.userInput.focus();
        } else {
          loginElement.loginPanel.element.style.display = "none";

          if (loginElement.userInput.value.length > 0 && loginElement.pwdInput.value.length > 0) {
            loginElement.login(loginElement, loginElement.userInput.value, loginElement.pwdInput.value);
          }
        }
      };
    }(this, this.side);

    this.loggedBtn.onclick = function (loggedPanel, side) {
      return function () {
        loggedPanel.element.style.top = this.offsetHeight + "px";
        loggedPanel.element.style[side] = "0px";

        if (loggedPanel.element.style.display == "none") {
          loggedPanel.element.style.display = "";
        } else {
          loggedPanel.element.style.display = "none";
        }
      };
    }(this.loggedPanel, this.side); // The logout event.


    this.shadowRoot.getElementById("logout-btn").onclick = function (loginElement) {
      return function () {
        if (loginElement.onlogout != undefined) {
          loginElement.onlogout();
        }

        loginElement.clear();
      };
    }(this);
  } // Set user login message error.


  hide() {
    this.loginPanel.element.style.display = "none";
    this.loginPanel.element.style.display = "none";
    this.loginBtn.style.display = "none";
    this.loggedBtn.style.display = "";
    this.displayName.innerHTML = this.user_display_name;
  }

  clear() {
    this.loginPanel.element.style.display = "";
    this.loggedPanel.element.style.display = "none";
    this.loginBtn.style.display = "";
    this.loggedBtn.style.display = "none";
    this.displayName.innerHTML = "";
  }

  setUserError(message) {
    this.pwdInput.value = "";
    this.userInput.inputElement.inputElement.select();
    this.userInput.inputElement.inputElement.focus();
    this.userInput.setAttribute('invalid', false);
    this.userInput.setAttribute('invalid', true);
    this.userInput.setAttribute('error-message', message);
  } // Set user login message error.


  setPasswordError(message) {
    var pwdInput = this.shadowRoot.getElementById("pwd-id");
    this.pwdInput.setAttribute('invalid', false);
    this.pwdInput.setAttribute('invalid', true);
    this.pwdInput.setAttribute('error-message', message);
    this.pwdInput.inputElement.inputElement.select();
    setTimeout(function (pwdInput) {
      return function () {
        pwdInput.value = "";
        pwdInput.inputElement.inputElement.focus();
      };
    }(this.pwdInput), 1000);
  }

}

customElements.define('login-element', LoginElement);