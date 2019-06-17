// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js'

// List of imported functionality.
import { createElement } from "../element.js"
import { randomUUID, parseFunction } from "../utility.js"

class LoginElement extends PolymerElement {
  constructor() {
    super();
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
      login: Function,
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

    var loginBtn = this.shadowRoot.getElementById("login-btn"); // Here I will set the text

    if (this.login_btn_txt != undefined) {
      loginBtn.innerHTML = this.login_btn_txt;
    }

    var loginPanel = createElement(this.shadowRoot.getElementById("login-panel"));

    var loggedBtn = this.shadowRoot.getElementById("logged-btn"); // Here I will set the text
    var loggedPanel = createElement(this.shadowRoot.getElementById("logged-panel"));

    if (this.side == undefined) {
      this.side = "left";
    }

    if (this.speed == undefined) {
      this.speed = 1000;
    } // display the login button.
    
    var userInput = this.shadowRoot.getElementById("user-id")
    var pwdInput = this.shadowRoot.getElementById("pwd-id")

    if (this.login != undefined) {
      this.login = parseFunction(this.login)
    }
    var displayName = this.shadowRoot.getElementById("display-user-name")

    if (this.onlogin != undefined) {
      // this.onlogin = parseFunction(this.onlogin)
      var onlogin = parseFunction(this.onlogin)
      this.onlogin = function (onlogin, loginPanel, loginBtn, loggedBtn, displayName, loginElement) {
        return function (param) {
          loginPanel.element.style.display = "none"
          loginBtn.style.display = "none"
          loggedBtn.style.display = ""
          displayName.innerHTML = loginElement.user_display_name
          onlogin(param)
        }
      }(onlogin, loginPanel, loginBtn, loggedBtn, displayName, this)
    }

    // Logout to be call when the logout button is click.
    if (this.onlogout != undefined) {
      var onlogout = parseFunction(this.onlogout)
      this.onlogout = function(loginElement, loggedPanel, loginPanel, loginBtn, loggedBtn, displayName, onlogout){
        return function(){
          loginPanel.element.style.display = ""
          loggedPanel.element.style.display = "none"
          loginBtn.style.display = ""
          loggedBtn.style.display = "none"
          displayName.innerHTML = ""
          loginElement.innerHTML = ""
          onlogout()
        }
      }(this, loggedPanel, loginPanel, loginBtn, loggedBtn, displayName, onlogout)
    }

    pwdInput.onkeyup = function (loginElement, userInput) {
      return function (evt) {
        if (evt.keyCode == 13) {
          // Call the function.
          loginElement.login(loginElement, userInput.value, this.value)
        }
        if(this.value.lenght == 0){
          this.setAttribute('invalid', false);
        }
      }
    }(this, userInput)

    loginBtn.onclick = function (loginElement, loginPanel, userInput, pwdInput, side) {
      return function () {
        loginPanel.element.style.top = this.offsetHeight + "px"
        loginPanel.element.style[side] = "0px"
        if (loginPanel.element.style.display == "none") {
          loginPanel.element.style.display = "";
          userInput.focus()
        } else {
          loginPanel.element.style.display = "none";
          if(userInput.value.length > 0 && pwdInput.value.length > 0){
            loginElement.login(loginElement, userInput.value, pwdInput.value)
          }
        }
        
      };
    }(this, loginPanel, userInput, pwdInput, this.side);

    loggedBtn.onclick = function (loggedPanel, side) {
      return function () {
        loggedPanel.element.style.top = this.offsetHeight + "px"
        loggedPanel.element.style[side] = "0px"
        if (loggedPanel.element.style.display == "none") {
          loggedPanel.element.style.display = "";
        } else {
          loggedPanel.element.style.display = "none";
        }
      };
    }(loggedPanel, this.side);


    // The logout event.
    this.shadowRoot.getElementById("logout-btn").onclick = function (loginElement) {
      return function () {
        if (loginElement.onlogout != undefined) {
          loginElement.onlogout()
        }
      }
    }(this)
  }

  // Set user login message error.
  setUserError(message) {
    var userInput = this.shadowRoot.getElementById("user-id")
    var pwdInput = this.shadowRoot.getElementById("pwd-id")
    pwdInput.value = ""
    userInput.inputElement.inputElement.select()
    userInput.inputElement.inputElement.focus()
    userInput.setAttribute('invalid', false);
    userInput.setAttribute('invalid', true);
    userInput.setAttribute('error-message', message)
  }

  // Set user login message error.
  setPasswordError(message) {
    var pwdInput = this.shadowRoot.getElementById("pwd-id")
    pwdInput.setAttribute('invalid', false);
    pwdInput.setAttribute('invalid', true);
    pwdInput.setAttribute('error-message', message)
    pwdInput.inputElement.inputElement.select()
    setTimeout(function(pwdInput){
      return function(){
        pwdInput.value = ""
        pwdInput.inputElement.inputElement.focus()
      }
    }(pwdInput), 1000)
  }

}

customElements.define('login-element', LoginElement);