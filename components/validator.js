import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';   
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {IronValidatableBehavior} from '@polymer/iron-validatable-behavior/iron-validatable-behavior.js';

import { parseFunction } from "./utility.js";

class CustomValidator extends mixinBehaviors([IronValidatorBehavior], PolymerElement) {
  /**
   * The internal component properties.
   */
  static get properties() {
    return {
      onvalidate: Function,
      target: Object,
      message: String,
    };
  }

  /**
   * That function is call when the table is ready to be diplay.
   */
  ready() {
    super.ready();
    if (this.onvalidate != undefined) {
      this.onvalidate = parseFunction(this.onvalidate);
    }
  }

  /**
   * Simple call the validation function previously register.
   * @param {*} value 
   */
  validate(value) {
    var valid = this.onvalidate(value);
    this.target.setAttribute('invalid', false);
    if ( valid ){
      this.removeAttribute('invalid');
    }else{
      this.setAttribute('invalid', true);
      this.setAttribute('error-message', this.message)
    }
    return valid;
  }

}

customElements.define('custom-validator', CustomValidator);
