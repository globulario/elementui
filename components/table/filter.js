// Polymer dependencies
import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js"; // List of imported functionality.

import { createElement } from "../element.js";
import { attachAutoComplete } from "../autocomplete/autocomplete.js";
import { fireResize, isNumeric, intersectSafe, isString, isBoolean, getCoords } from "../utility.js"; // Expression contain operator and field to be test.

class Expression {
  constructor(parent) {
    // Keep a link to the parent filter for that expression.
    this.parent = parent; // So here I will append the expression panel.

    this.panel = this.parent.expressionsPanel.appendElement({
      "tag": "div",
      "style": "display: flex; align-items: stretch; padding: 2px;"
    }).down(); // The button to remove the expression

    this.deleteBtn = this.panel.appendElement({
      "tag": "paper-icon-button",
      "icon": "close",
      "style": "height: 18px; width: 18px; padding: 1px;"
    }).down(); // The expression panel.

    this.expressionPanel = this.panel.appendElement({
      "tag": "div",
      "style": "display: flex; align-items: stretch; font-size: 12pt; padding-left: 5px;"
    }).down(); // Here the user can select the...

    this.selectorDiv = this.expressionPanel.appendElement({
      "tag": "div",
      "innerHtml": "value"
    }).down(); // Display the operator 

    this.operatorDiv = this.expressionPanel.appendElement({
      "tag": "div",
      "style": "padding-left: 5px; padding-right: 5px;"
    }).down(); // The operator value div

    this.operatorValueDiv = this.operatorDiv.appendElement({
      "tag": "div",
      "style": "color: " + this.parent.color + ";"
    }).down();

    this.operatorDiv.element.onmouseover = function () {
      this.style.cursor = "pointer";
    };

    this.operatorDiv.element.onmouseout = function () {
      this.style.cursor = "default";
    }; // The operator selector.


    this.operatorSelector = this.operatorDiv.appendElement({
      "tag": "select",
      "style": "display: none;"
    }).down();

    this.operatorSelector.element.onblur = function (operatorSelector, operatorValueDiv) {
      return function () {
        operatorSelector.element.style.display = "none";
        operatorValueDiv.element.style.display = "";
        operatorValueDiv.element.innerHTML = operatorSelector.element.options[operatorSelector.element.selectedIndex].text;
      };
    }(this.operatorSelector, this.operatorValueDiv);

    this.operatorDiv.element.onclick = function (operatorSelector, operatorValueDiv) {
      return function (evt) {
        evt.stopPropagation();

        if (operatorSelector.element.style.display == "none") {
          operatorSelector.element.style.display = "";
          operatorValueDiv.element.style.display = "none";
        }
      };
    }(this.operatorSelector, this.operatorValueDiv); // The value div.


    this.valueDiv = this.expressionPanel.appendElement({
      "tag": "div"
    }).down(); // Set the input number.

    this.input = this.valueDiv.appendElement({
      "tag": "input"
    }).down(); // Here I will set the input value...

    this.displayValueDiv = this.valueDiv.appendElement({
      "tag": "div",
      "style": "display: none"
    }).down();

    this.valueDiv.element.onmouseover = function () {
      this.style.cursor = "pointer";
    };

    this.valueDiv.element.onmouseout = function () {
      this.style.cursor = "default";
    }; // Create value selector.


    this.valueDiv.element.onclick = function (expression) {
      return function (evt) {
        evt.stopPropagation();
        var input = expression.input;
        var displayValueDiv = expression.displayValueDiv;

        if (input.element.style.display == "none") {
          displayValueDiv.element.style.display = "none";
          input.element.style.display = "";
          input.element.value = displayValueDiv.element.innerHTML;
          input.element.focus();
          input.element.setSelectionRange(0, input.element.value.length);
        }
      };
    }(this);

    this.input.element.onblur = function (expression) {
      return function () {
        var input = expression.input;
        var displayValueDiv = expression.displayValueDiv;
        input.element.style.display = "none";
        displayValueDiv.element.style.display = "";
        displayValueDiv.element.innerHTML = input.element.value;
      };
    }(this); // Set the focus to the element.


    this.input.element.focus(); // append the enter event on the input.

    this.input.element.addEventListener("keyup", function (evt) {
      function getFilterPanel(div, input) {
        if (div.parentNode != null) {
          if (div.className == "filter-panel") {
            input.blur();
            div.children[1].children[1].click();
          } else {
            getFilterPanel(div.parentNode, input);
          }
        }
      }

      if (evt.keyCode == 13) {
        // okBtn.element.click()
        getFilterPanel(this, this);
      }
    });

    this.operatorSelector.element.onchange = function (valueDiv) {
      return function () {
        valueDiv.element.click();
      };
    }(this.valueDiv);
  } // send blur event to operator selector and 
  // Test if the expression is empty.


  isEmpty() {
    return this.input.element.value.length == 0;
  }

  blur() {
    this.operatorSelector.element.style.display = "none";
    this.operatorValueDiv.element.style.display = "";
    this.operatorValueDiv.element.innerHTML = this.operatorSelector.element.options[this.operatorSelector.element.selectedIndex].text; // Recursively call blur on element

    function recusiveBlur(element) {
      element.blur();

      for (var i = 0; i < element.children.length; i++) {
        recusiveBlur(element.children[i]);
      }
    }

    recusiveBlur(this.valueDiv.element);
  }

  delete() {
    this.panel.element.parentNode.removeChild(this.panel.element);
  } // must be implemented by all expression type.


  evaluate() {}

  toString() {
    var str = this.selectorDiv.element.innerText + " " + this.operatorValueDiv.element.innerText;
    return str;
  }

} // Use to filter numberic value


class NumericExpression extends Expression {
  constructor(parent) {
    super(parent); // Set the available operators.

    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "==",
      "innerHtml": "=",
      "title": "equal"
    });
    this.operatorValueDiv.element.innerHTML = "=";
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "!=",
      "innerHtml": "!=",
      "title": "Not equal"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "<",
      "innerHtml": "<",
      "title": "Less-than"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": ">",
      "innerHtml": ">",
      "title": "Greather-than"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "<=",
      "innerHtml": "<=",
      "title": "Less-than or equal"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": ">=",
      "innerHtml": ">=",
      "title": "Greather-than or equal"
    }); // Selector is static in that case.

    this.selectorDiv.element.innerHTML = "number";
    this.input.element.type = "number";
    this.input.element.value = 0;
    this.input.element.style.maxWidth = "60px";
    this.displayValueDiv.element.innerHTML = "0";
    this.displayValueDiv.element.style.minWidth = "60px";
  }
  /**
   * Evaluate the filter.
   * Return the list of rows that meet the expression.
   */


  evaluate() {
    // The rows that meet the expression.
    var rows = [];
    var v = parseFloat(this.input.element.value);
    var op = this.operatorSelector.element.options[this.operatorSelector.element.selectedIndex].value;
    var values = this.parent.getValues();

    for (var i = 0; i < values.length; i++) {
      var value = values[i].value; // Now I will test the value contain in the operator div.

      if (eval(value + op + v)) {
        // push the row index in the rows.
        rows.push(values[i].index);
      }
    }

    return rows;
  }

  toString() {
    var str = super.toString();
    return str + " " + this.displayValueDiv.element.innerText;
  }

} // Use to filter string value, regular expression can be use here.


class StringExpression extends Expression {
  constructor(parent) {
    super(parent); // Selector is static in that case.

    this.selectorDiv.element.innerHTML = "text"; // So here I will set the list of available operation.

    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "contain",
      "innerHtml": "contain",
      "title": "contain given value"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "equal",
      "innerHtml": "equal",
      "title": "equal a given value"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "startsWith",
      "innerHtml": "starts with",
      "title": "starts with value"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "endsWith",
      "innerHtml": "ends with",
      "title": "ends with value"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "empty",
      "innerHtml": "empty",
      "title": "get empty value"
    }); // negation

    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "not_equal",
      "innerHtml": "not equal",
      "title": "not equal a given value"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "not_contain",
      "innerHtml": "not contain",
      "title": "not contain given value"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "not_startsWith",
      "innerHtml": "not starts with",
      "title": "not starts with given value"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "not_endsWith",
      "innerHtml": "not ends with",
      "title": "not ends with given value"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "not_empty",
      "innerHtml": "not empty",
      "title": "is not empty"
    }); // regex

    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "match",
      "innerHtml": "match",
      "title": "match a regular expression"
    });
    this.operatorValueDiv.element.innerHTML = "contain"; // Here I will set the input value...

    this.input.element.style.maxWidth = "100px";
    this.displayValueDiv.element.style.minWidth = "100px";
    this.displayValueDiv.element.style.minHeight = "12px";
    var values = this.parent.getValues();
    var lst = [];

    for (var i = 0; i < values.length; i++) {
      if (lst.indexOf(values[i].value) == -1) {
        if (values[i].value != undefined) {
          if (values[i].value.length > 0) {
            lst.push(values[i].value);
          }
        }
      }
    }

    this.operatorSelector.element.addEventListener("change", function (expression, lst) {
      return function () {
        expression.valueDiv.element.style.display = ""; // hide the value div in that case.

        if (this.value == "not_empty" || this.value == "empty") {
          expression.valueDiv.element.style.display = "none";
        } else {
          /** to do remove the autocomplete. */
        }

        if (this.value == "not_equal" || this.value == "equal") {
          // Here I will attach the autocomplete to the selector.
          attachAutoComplete(expression.input, lst, false, function (input, displayValueDiv) {
            return function (value) {
              input.element.value = value;
              displayValueDiv.element.innerHTML = value;
              input.element.blur();
            };
          }(expression.input, expression.displayValueDiv)); // Append event listener to selector.
        }
      };
    }(this, lst));
  }
  /**
   * Implement empty function.
   */


  isEmpty() {
    if (this.operatorSelector.element.value != "not_empty" && this.operatorSelector.element.value != "empty") {
      return this.input.element.value == "";
    }
  }
  /**
   * Evaluate the filter.
   * Return the list of rows that meet the expression.
   */


  evaluate() {
    // The rows that meet the expression.
    var rows = [];
    var op = this.operatorSelector.element.options[this.operatorSelector.element.selectedIndex].value;
    var values = this.parent.getValues();
    var v = this.displayValueDiv.element.innerHTML;

    for (var i = 0; i < values.length; i++) {
      var value = values[i].value; // Now I will test the value contain in the operator div.

      if (value == undefined) {
        value = ""; // empty value in that case..
      }

      var valid = false;

      if (op == "contain" && v.length != 0) {
        valid = value.toUpperCase().indexOf(v.toUpperCase()) != -1;
      } else if (op == "equal") {
        valid = value.toUpperCase() == v.toUpperCase();
      } else if (op == "startsWith" && v.length != 0) {
        valid = value.toUpperCase().startsWith(v.toUpperCase());
      } else if (op == "endsWith" && v.length != 0) {
        valid = value.toUpperCase().endsWith(v.toUpperCase());
      } else if (op == "empty") {
        valid = value.length == 0;
      }

      if (op == "not_equal") {
        valid = !(value == v);
      } else if (op == "not_contain" && v.length != 0) {
        valid = !(value.toUpperCase().indexOf(v.toUpperCase()) != -1);
      } else if (op == "not_startsWith" && v.length != 0) {
        valid = !value.toUpperCase().startsWith(v.toUpperCase());
      } else if (op == "not_endsWith" && v.length != 0) {
        valid = !value.toUpperCase().endsWith(v.toUpperCase());
      } else if (op == "not_empty") {
        valid = value.length != 0;
      } else if (op == "match") {
        var patt = new RegExp(v);
        valid = patt.test(value);
      }

      if (valid) {
        // push the row index in the rows.
        rows.push(values[i].index);
      }
    }

    return rows;
  }

  toString() {
    var str = super.toString();
    return str + " " + this.displayValueDiv.element.innerText;
  }

}

class BooleanExpression extends Expression {
  constructor(parent) {
    super(parent); // Set the available operators.

    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "isTrue",
      "innerHtml": "is true",
      "title": "the value is true"
    });
    this.operatorValueDiv.element.innerHTML = "is true";
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "isFalse",
      "innerHtml": "is false",
      "title": "the value is false"
    });
    this.valueDiv.element.style.display = "none"; // Selector is static in that case.

    this.selectorDiv.element.innerHTML = "value";
  }
  /**
   * Evaluate the filter.
   * Return the list of rows that meet the expression.
   */


  evaluate() {
    var rows = [];
    var op = this.operatorSelector.element.options[this.operatorSelector.element.selectedIndex].value;
    var values = this.parent.getValues();

    for (var i = 0; i < values.length; i++) {
      var value = values[i].value; // Now I will test the value contain in the operator div.

      var valid = false;

      if (op == "isTrue") {
        valid = value == true;
      } else if (op == "isFalse") {
        valid = value == false;
      }

      if (valid) {
        // push the row index in the rows.
        rows.push(values[i].index);
      }
    }

    return rows;
  }

  toString() {
    var str = super.toString();
    return str + " " + this.displayValueDiv.element.innerText;
  }

} // That class is use to select date/time field.


class DateFieldSelector {
  constructor(parent) {
    this.panel = parent.appendElement({
      "tag": "div",
      "style": "display: flex; flex-direction: column; overflow: hidden;"
    }).down();
    var div0 = this.panel.appendElement({
      "tag": "div",
      "style": "display: flex;"
    }).down(); // the expand button

    this.expandBtn = div0.appendElement({
      "tag": "iron-icon",
      "icon": "arrow-drop-down",
      "style": "height:18px; width: 18px;"
    }).down(); // the shrink button

    this.shrinkBtn = div0.appendElement({
      "tag": "iron-icon",
      "icon": "arrow-drop-up",
      "style": "height:18px; width: 18px; display: none;"
    }).down(); // the current selection...

    this.selectionDiv = div0.appendElement({
      "tag": "div",
      "style": ""
    }).down(); // the input that contain the year

    this.yearEditor = createElement(null, {
      "tag": "input",
      "type": "number",
      "min": "1900",
      "max": "2100",
      "step": "1",
      "maxlength": "4",
      "placeholder": "year",
      "title": "year",
      "style": "border: none; max-width: 55px;"
    }); // the input that contain the month

    this.monthEditor = createElement(null, {
      "tag": "input",
      "type": "number",
      "min": "0",
      "step": "1",
      "max": "12",
      "maxlength": "2",
      "placeholder": "month",
      "title": "month",
      "style": "border: none; max-width: 55px;"
    }); // the input that contain the day

    this.dayEditor = createElement(null, {
      "tag": "input",
      "type": "number",
      "min": "0",
      "max": "31",
      "step": "1",
      "maxlength": "2",
      "placeholder": "day",
      "title": "day",
      "style": "border: none; max-width: 55px;"
    }); // the input that contain the hour

    this.hourEditor = createElement(null, {
      "tag": "input",
      "type": "number",
      "min": "0",
      "max": "24",
      "step": "1",
      "maxlength": "2",
      "placeholder": "hour",
      "title": "hour",
      "style": "border: none; max-width: 55px;"
    }); // the input that contain the hour

    this.minuteEditor = createElement(null, {
      "tag": "input",
      "type": "number",
      "min": "0",
      "max": "60",
      "step": "1",
      "maxlength": "2",
      "placeholder": "minute",
      "title": "minute",
      "style": "border: none; max-width: 55px;"
    }); // the input that contain the hour

    this.secondEditor = createElement(null, {
      "tag": "input",
      "type": "number",
      "min": "0",
      "max": "60",
      "step": "1",
      "maxlength": "2",
      "placeholder": "second",
      "title": "second",
      "style": "border: none; max-width: 55px;"
    }); // Now the selector div.

    var div1 = this.panel.appendElement({
      "tag": "div",
      "style": "display: flex; height: 0px;"
    }).down(); // The year selector.

    var div2 = div1.appendElement({
      "tag": "div",
      "style": "display: flex; flex-direction: column; padding-right: 4px"
    }).down();
    this.yearSelector = div2.appendElement({
      "tag": "div"
    }).down();
    this.yearSelector.appendElement({
      "tag": "input",
      "type": "checkbox",
      "checked": "true"
    }).appendElement({
      "tag": "span",
      "innerHtml": "Year"
    });
    this.monthSelector = div2.appendElement({
      "tag": "div"
    }).down();
    this.monthSelector.appendElement({
      "tag": "input",
      "type": "checkbox",
      "checked": "true"
    }).appendElement({
      "tag": "span",
      "innerHtml": "Month"
    });
    this.daySelector = div2.appendElement({
      "tag": "div"
    }).down();
    this.daySelector.appendElement({
      "tag": "input",
      "type": "checkbox",
      "checked": "true"
    }).appendElement({
      "tag": "span",
      "innerHtml": "Day"
    });
    var div3 = div1.appendElement({
      "tag": "div",
      "style": "display: flex; flex-direction: column;"
    }).down();
    this.hourSelector = div3.appendElement({
      "tag": "div"
    }).down();
    this.hourSelector.appendElement({
      "tag": "input",
      "type": "checkbox"
    }).appendElement({
      "tag": "span",
      "innerHtml": "Hour"
    });
    this.minuteSelector = div3.appendElement({
      "tag": "div"
    }).down();
    this.minuteSelector.appendElement({
      "tag": "input",
      "type": "checkbox"
    }).appendElement({
      "tag": "span",
      "innerHtml": "Minute"
    });
    this.secondSelector = div3.appendElement({
      "tag": "div"
    }).down();
    this.secondSelector.appendElement({
      "tag": "input",
      "type": "checkbox"
    }).appendElement({
      "tag": "span",
      "innerHtml": "Second"
    }); // Now I will set the event.

    this.yearSelector.element.firstChild.onclick = this.monthSelector.element.firstChild.onclick = this.daySelector.element.firstChild.onclick = this.minuteSelector.element.firstChild.onclick = this.hourSelector.element.firstChild.onclick = this.secondSelector.element.firstChild.onclick = function (fieldSelector) {
      return function () {
        fieldSelector.setSelection();
      };
    }(this);

    this.expandBtn.element.onmouseover = this.shrinkBtn.element.onmouseover = function () {
      this.style.cursor = "pointer";
    };

    this.expandBtn.element.onmouseout = this.shrinkBtn.element.onmouseout = function () {
      this.style.cursor = "default";
    }; // Now The expand btn...


    this.expandBtn.element.onclick = function (shrinkBtn, expandBtn, div) {
      return function () {
        // Little animation here...
        var keyframe = "100% {height:80px;}";
        div.animate(keyframe, .5, function (shrinkdivBtn, expandBtn, div) {
          return function () {
            div.element.style.height = "80px";
            shrinkdivBtn.element.style.display = "block";
            expandBtn.element.style.display = "none";
          };
        }(shrinkBtn, expandBtn, div));
      };
    }(this.shrinkBtn, this.expandBtn, div1);

    this.shrinkBtn.element.onclick = function (expandBtn, shrinkBtn, div) {
      return function () {
        // Little animation here...
        var keyframe = "100% {height:0px;}";
        div.animate(keyframe, .5, function (expandBtn, shrinkBtn, div) {
          return function () {
            div.element.style.height = "0px";
            expandBtn.element.style.display = "block";
            shrinkBtn.element.style.display = "none";
          };
        }(expandBtn, shrinkBtn, div));
      };
    }(this.expandBtn, this.shrinkBtn, div1);

    this.selectionDiv.element.onclick = function (dateFieldSelector) {
      return function (evt) {
        evt.stopPropagation();
        dateFieldSelector.setSelection();
      };
    }; // set the selection


    this.setSelection();
  } // Return the string value.


  getValue() {
    var selections = []; // create a date from selection.

    var value = new Date(0); // Set value to 0

    value.setFullYear(1970);
    value.setMonth(0);
    value.setDate(1);
    value.setHours(0);
    value.setMinutes(0);
    value.setSeconds(0);

    if (this.yearSelector.element.children[0].checked) {
      value.setFullYear(parseInt(this.yearEditor.element.value));
    }

    if (this.monthSelector.element.children[0].checked) {
      value.setMonth(parseInt(this.monthEditor.element.value) - 1);
    }

    if (this.daySelector.element.children[0].checked) {
      value.setDate(parseInt(this.dayEditor.element.value));
    }

    if (this.hourSelector.element.children[0].checked) {
      value.setHours(parseInt(this.hourEditor.element.value));
    }

    if (this.minuteSelector.element.children[0].checked) {
      value.setMinutes(parseInt(this.minuteEditor.element.value));
    }

    if (this.secondSelector.element.children[0].checked) {
      value.setSeconds(parseInt(this.secondEditor.element.value));
    }

    return value;
  } // Set the content of the selection div.


  setSelection() {
    var selections = [];

    if (this.yearSelector.element.children[0].checked) {
      selections.push(this.yearEditor);
    }

    if (this.monthSelector.element.children[0].checked) {
      // The mount index 0 is janurary...
      selections.push(this.monthEditor);
    }

    if (this.daySelector.element.children[0].checked) {
      selections.push(this.dayEditor);
    }

    if (this.hourSelector.element.children[0].checked) {
      selections.push(this.hourEditor);
    }

    if (this.minuteSelector.element.children[0].checked) {
      selections.push(this.minuteEditor);
    }

    if (this.secondSelector.element.children[0].checked) {
      selections.push(this.secondEditor);
    }

    this.selectionDiv.removeAllChilds();
    this.selectionDiv.element.innerHTML = "";

    for (var i = 0; i < selections.length; i++) {
      this.selectionDiv.appendElement(selections[i]);

      if (i < selections.length - 1) {
        this.selectionDiv.appendElement({
          "tag": "span",
          "innerHtml": "/",
          "style": "padding-right: 5px;"
        });
      }
    }
  }

  hasYear() {
    return this.yearSelector.element.children[0].checked;
  }

  hasMonth() {
    return this.monthSelector.element.children[0].checked;
  }

  hasDay() {
    return this.daySelector.element.children[0].checked;
  }

  hasHour() {
    return this.hourSelector.element.children[0].checked;
  }

  hasMinute() {
    return this.minuteSelector.element.children[0].checked;
  }

  hasSecond() {
    return this.secondSelector.element.children[0].checked;
  }

} // Use to filter numberic value


class DateExpression extends Expression {
  constructor(parent) {
    super(parent); // Set the available operators.
    // The first set of operator are mathematical on that use unix time to compare date togheter...

    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "==",
      "innerHtml": "=",
      "title": "equal"
    });
    this.operatorValueDiv.element.innerHTML = "=";
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "!=",
      "innerHtml": "!=",
      "title": "Not equal"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "<",
      "innerHtml": "<",
      "title": "Less-than"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": ">",
      "innerHtml": ">",
      "title": "Greather-than"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": "<=",
      "innerHtml": "<=",
      "title": "Less-than or equal"
    });
    this.operatorSelector.appendElement({
      "tag": "option",
      "value": ">=",
      "innerHtml": ">=",
      "title": "Greather-than or equal"
    }); // The second set are operator more specific to date.

    this.selectorDiv.element.innerHTML = "date"; // Remove the input ...

    this.input.element.parentNode.removeChild(this.input.element);
    this.displayValueDiv.element.innerHTML = ""; // Selector is static in that case.

    this.fieldSelector = new DateFieldSelector(this.valueDiv);
  }
  /**
   * Evaluate the filter.
   * Return the list of rows that meet the expression.
   */


  isEmpty() {
    function isValidDate(d) {
      return d instanceof Date && !isNaN(d);
    }

    return !isValidDate(this.fieldSelector.getValue());
  }

  evaluate() {
    // The rows that meet the expression.
    var rows = [];
    var v = this.fieldSelector.getValue();
    var op = this.operatorSelector.element.options[this.operatorSelector.element.selectedIndex].value;
    var values = this.parent.getValues();

    for (var i = 0; i < values.length; i++) {
      var value = new Date(values[i].value);
      var valid = false; // Now I will test the value contain in the operator div.
      // specific date filter types.

      if (!this.fieldSelector.hasYear()) {
        value.setFullYear(1970);
      }

      if (!this.fieldSelector.hasMonth()) {
        value.setMonth(0);
      }

      if (!this.fieldSelector.hasDay()) {
        value.setDate(1);
      }

      if (!this.fieldSelector.hasHour()) {
        value.setHours(0);
      }

      if (!this.fieldSelector.hasMinute()) {
        value.setMinutes(0);
      }

      if (!this.fieldSelector.hasSecond()) {
        value.setSeconds(0);
      } // not take milisecond...


      value.setMilliseconds(0);
      v.setMilliseconds(0); // evaluate the comparasion...

      valid = eval(value.getTime() + op + v.getTime());

      if (valid) {
        // push the row index in the rows.
        rows.push(values[i].index);
      }
    }

    return rows;
  }

  toString() {
    var str = super.toString();

    if (this.fieldSelector.hasYear()) {
      str += " year:" + this.fieldSelector.yearEditor.element.value;
    }

    if (this.fieldSelector.hasMonth()) {
      str += " month:" + this.fieldSelector.monthEditor.element.value;
    }

    if (this.fieldSelector.hasDay()) {
      str += " day:" + this.fieldSelector.dayEditor.element.value;
    }

    if (this.fieldSelector.hasHour()) {
      str += " hour:" + this.fieldSelector.hourEditor.element.value;
    }

    if (this.fieldSelector.hasMinute()) {
      str += " minute:" + this.fieldSelector.minuteEditor.element.value;
    }

    if (this.fieldSelector.hasSecond()) {
      str += " second:" + this.fieldSelector.secondEditor.element.value;
    }

    return str;
  }

} // Filter is a recursive structure that can contain other filter or expressions whit one operator (AND/OR).


class Filter {
  // Parent can be null if the filter is the main filter.
  constructor(parent, table, index) {
    this.table = table;
    this.index = index;
    this.operator = "OR"; // can also be OR

    this.filters = []; // subfilter.

    this.expressions = []; // list of expression to evaluate.

    this.colors = []; // keep the parent filter element.

    this.parent = parent; // Now i will create the panel.

    var parentElement = createElement(parent.panel.element.children[0]); // Here I will create the interface.

    this.panel = parentElement.appendElement({
      "tag": "div",
      "style": "display: flex; position: relative;"
    }).down(); // The panel that will contain the expressions.

    this.expressionsPanel = this.panel.appendElement({
      "tag": "div",
      "style": "flex: 1;"
    }).down(); // The panel that will display the OR/AND operator...

    this.color = this.getColors().splice(0, 1); // The panel that contain the filter operator.

    this.operatorPanel = this.panel.appendElement({
      "tag": "div",
      "style": "display: flex; flex-direction: column; align-items: center; color: white; background-color:" + this.color + ";"
    }).down();

    this.operatorPanel.element.onmouseover = function (filter) {
      return function () {
        filter.blur();
      };
    }(this); // That given expression.


    this.addExpressionBtn = this.operatorPanel.appendElement({
      "tag": "paper-icon-button",
      "icon": "add",
      "style": "height: 18px; width: 18px; padding: 1px;",
      "title": "append a new exprssion"
    }).down();
    this.andOrBtn = this.operatorPanel.appendElement({
      "tag": "div",
      "innerHtml": "or",
      "style": "display: none; flex: 1; column; writing-mode: vertical-rl; text-orientation: sideways-right; text-align: center;"
    }).down(); // Set the operator.

    this.andOrBtn.element.onclick = function (filter) {
      return function () {
        if (this.innerHTML == "and") {
          this.innerHTML = "or";
          filter.operator = "OR";
        } else {
          this.innerHTML = "and";
          filter.operator = "AND";
        }
      };
    }(this);

    this.andOrBtn.element.onmouseover = function () {
      this.style.cursor = "pointer";
    };

    this.andOrBtn.element.onmouseout = function () {
      this.style.cursor = "default";
    }; // append a new expression to the group.


    this.addExpressionBtn.element.onclick = function (filter) {
      return function (evt) {
        evt.stopPropagation(); // append a new expression.

        filter.appendExpression();
      };
    }(this);

    this.expressionsPanel.element.onclick = function (filter) {
      return function () {
        if (filter.filters.length == 0 && filter.expressions.length == 0) {
          filter.addExpressionBtn.element.click();
        }
      };
    }(this); // Set the append/delete filter menu


    this.filterMenu = this.panel.appendElement({
      "tag": "div",
      "style": "z-index: 1; position: absolute; background-color: white; top:0px; -webkit-box-shadow: 0px 0px 5px -1px rgba(0,0,0,0.75);  -moz-box-shadow: 0px 0px 5px -1px rgba(0,0,0,0.75);  box-shadow: 0px 0px 5px -1px rgba(0,0,0,0.75);"
    }).down(); // Remove/add btn

    this.addFilterBtn = this.filterMenu.appendElement({
      "tag": "paper-icon-button",
      "icon": "add",
      "style": "height: 18px; width: 18px; padding: 1px;",
      "title": "append new group of expression."
    }).down();
    this.clearFileterBtn = this.filterMenu.appendElement({
      "tag": "paper-icon-button",
      "icon": "close",
      "style": "height: 18px; width: 18px; padding: 1px;",
      "title": "clear the content of filter"
    }).down();
    this.deleteFileterBtn = this.filterMenu.appendElement({
      "tag": "paper-icon-button",
      "icon": "delete",
      "style": "height: 18px; width: 18px; padding: 1px;",
      "title": "delele the filter and it content"
    }).down();

    this.clearFileterBtn.element.onmouseover = this.addFilterBtn.element.onmouseover = function () {
      this.style.cursor = "pointer";
    };

    this.clearFileterBtn.element.onmouseout = this.addFilterBtn.element.onmouseout = function () {
      this.style.cursor = "default";
    }; // remove a given filter.


    this.deleteFileterBtn.element.onclick = function (filter) {
      return function () {
        for (var i = 0; i < filter.parent.filters.length; i++) {
          if (filter.parent.filters[i] === filter) {
            filter.parent.filters.splice(i, 1);
            break;
          }
        } // remove the filter.


        filter.getColors().push(filter.color);
        filter.panel.element.parentNode.removeChild(filter.panel.element);

        if (filter.parent.expressions.length > 1) {
          filter.parent.andOrBtn.element.style.display = "block";
        } else if (filter.parent.expressions.length >= 1 && filter.parent.filters.length >= 1) {
          filter.parent.andOrBtn.element.style.display = "block";
        } else {
          filter.parent.andOrBtn.element.style.display = "none";
        }
      };
    }(this);

    this.clearFileterBtn.element.onclick = function (filter) {
      return function () {
        filter.clear();
      };
    }(this);

    this.filterMenu.element.style.display = "none";

    this.panel.element.onmouseover = this.panel.element.onmousemouve = function (filterMenu) {
      return function (evt) {
        evt.stopPropagation();
        filterMenu.element.style.display = "block";
        filterMenu.element.style.right = -1 * filterMenu.element.offsetWidth + "px";
      };
    }(this.filterMenu);

    this.expressionsPanel.element.onmouseover = this.panel.element.onmouseout = function (filterMenu) {
      return function (evt) {
        evt.stopPropagation();
        filterMenu.element.style.display = "none";
      };
    }(this.filterMenu); // Append a sub-filter


    this.addFilterBtn.element.onclick = function (filter) {
      return function () {
        filter.appendFilter();
      };
    }(this);
  }

  isEmpty() {
    for (var i = 0; i < this.expressions.length; i++) {
      if (!this.expressions[i].isEmpty()) {
        return false;
      }
    } // if it contain filter.


    return this.filters.length == 0;
  }

  getValues() {
    return this.table.getColumnData(this.index);
  } // Return the color list for a filter.


  getFilterdValues() {
    return this.table.getFilteredColumnData(this.index);
  } // Return the color list for a filter.


  getColors() {
    if (this.colors.length == 0) {
      if (this.parent.colors == undefined) {
        this.colors = ["rgb(233, 30, 99)", "rgb(0, 188, 212)", "rgb(244, 67, 54)", "rgb(121, 85, 72)", "rgb(156, 39, 176)", "rgb(3, 169, 244)", "rgb(0, 150, 136)", "rgb(255, 235, 59)", "rgb(255, 193, 7)", "rgb(255, 152, 0)", "rgb(255, 87, 34)", "rgb(158, 158, 158)", "rgb(76, 175, 80)", "rgb(63, 81, 181)", "rgb(139, 195, 74)", "rgb(96, 125, 139)"];
      } else {
        return this.parent.getColors();
      }
    }

    return this.colors;
  } // remove all filters and expressions.


  clear() {
    for (var i = 0; i < this.filters.length; i++) {
      this.filters[i].panel.element.parentNode.removeChild(this.filters[i].panel.element);
      this.filters[i].clear(); // set back the color in the filter.

      this.getColors().push(this.filters[i].color);
    } // this.panel.element.parentNode.removeChild(this.panel.element)
    // remove the filter from the list.


    this.filters = []; // Now the expression.

    for (var i = 0; i < this.expressions.length; i++) {
      this.expressions[i].delete();
    }

    this.expressions = []; // hide the and/or text.

    this.andOrBtn.element.style.display = "none";
  }

  blur() {
    for (var i = 0; i < this.filters.length; i++) {
      this.filters[i].blur();
    }

    for (var i = 0; i < this.expressions.length; i++) {
      this.expressions[i].blur();
    }
  } // append the empty expression...


  appendExpression() {
    var expression;

    if (isNumeric(this.getValues()[0].value)) {
      // Here I will create a numeric expression.
      expression = new NumericExpression(this);
    } else if (isString(this.getValues()[0].value)) {
      expression = new StringExpression(this);
    } else if (isBoolean(this.getValues()[0].value)) {
      expression = new BooleanExpression(this);
    } else if (this.getValues()[0].value instanceof Date) {
      expression = new DateExpression(this);
    }

    this.expressions.push(expression); // Set the border color.

    this.expressionsPanel.element.style.border = "1px solid " + this.color;

    if (this.expressions.length > 1) {
      this.andOrBtn.element.style.display = "block";
    } else if (this.expressions.length >= 1 && this.filters.length >= 1) {
      this.andOrBtn.element.style.display = "block";
    } else {
      this.andOrBtn.element.style.display = "none";
    } // Delete the expression from the filter.


    expression.deleteBtn.element.onclick = function (index, expression, filter) {
      return function (evt) {
        evt.stopPropagation(); // remove the expression from the list.

        filter.expressions.splice(index, 1);

        if (filter.expressions.length == 0) {
          filter.expressionsPanel.element.style.border = "none";
        }

        filter.expressionsPanel.element.style.border = "1px solid " + filter.color;

        if (filter.expressions.length > 1) {
          filter.andOrBtn.element.style.display = "block";
        } else if (filter.expressions.length >= 1 && filter.filters.length >= 1) {
          filter.andOrBtn.element.style.display = "block";
        } else {
          filter.andOrBtn.element.style.display = "none";
        } // remove it visual.


        expression.panel.element.parentNode.removeChild(expression.panel.element);
      };
    }(this.expressions.length - 1, expression, this);
  } // Append sub-filter...


  appendFilter() {
    var filter = new Filter(this, this.table, this.index);
    this.filters.push(filter);

    if (this.filters.length > 1) {
      this.andOrBtn.element.style.display = "block";
    }

    if (this.filters.length >= 1 && this.expressions.length >= 1) {
      this.andOrBtn.element.style.display = "block";
    } else {
      this.andOrBtn.element.style.display = "none";
    }
  } // Return the list of row to remove from the table values.


  evaluate() {
    // So here I will evaluate the filter and expression recursively...
    var rows_ = [];
    var rows = [];

    for (var i = 0; i < this.filters.length; i++) {
      rows_.push(this.filters[i].evaluate());
    }

    for (var i = 0; i < this.expressions.length; i++) {
      rows_.push(this.expressions[i].evaluate());
    }

    if (this.operator == "OR") {
      // simply append the rows in the result.
      for (var i = 0; i < rows_.length; i++) {
        rows = rows.concat(rows_[i]);
      }
    } else {
      // here I will keep intersection only.
      if (rows_.length > 0) {
        rows = rows_[0];

        if (rows_.length > 1) {
          for (var i = 1; i < rows_.length; i++) {
            rows = intersectSafe(rows, rows_[i]);
          }
        }
      }
    }

    return rows.removeDuplicates().sort();
  }

}

class TableFilterElement extends PolymerElement {
  constructor() {
    super();
    this.filterBtn = null;
    this.table = null;
    this.header = null;
    this.headerCell = null;
    this.filter = null;
    this.panel = null;
  }
  /**
   * The internal component properties.
   */


  static get properties() {
    return {
      /**
       * Sort function with the form sort(a, b)
       */
      index: Number,
      onfilter: Function
    };
  }
  /**
   * That function is call when the table is ready to be diplay.
   */


  ready() {
    this.innerHTML = `
        <style>
            .filter-panel {
                /** display empty filter **/
                max-height: 350px;
                
                /** Position properties **/
                position: absolute;
                flex-direction: column;
                align-items: stretch;

                /** can be overide **/
                background-color: white;
                color: grey;

                box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
            }

        </style>
        <div>
            <iron-icon id="ascSortBtn" icon="filter-list" style="height: 18px; display: none;"></iron-icon>
        </div>
        `;
    super.ready();
    this.table = this.parentNode.parentNode.parentNode;
    this.header = this.parentNode.parentNode; // The parent cell.

    this.headerCell = this.parentNode;
    this.filterBtn = this.children[1].children[0];
    this.headerCell.style.position = "relative";
    this.headerCell.style.paddingRight = "25px";
    this.style.position = "absolute";
    this.style.right = "0px";
    this.parentNode.addEventListener("mouseover", function (filter) {
      return function () {
        filter.filterBtn.style.display = "block";
      };
    }(this));
    this.parentNode.addEventListener("mouseout", function (filter) {
      return function () {
        // test if some filter are applied...
        if (filter.panel.element.style.display == "none") {
          if (filter.filter != null) {
            if (filter.filter.expressions.length > 0 || filter.filter.filters.length > 0) {
              filter.filterBtn.style.display = "block";
              return;
            }
          }

          filter.filterBtn.style.display = "none";
        }
      };
    }(this));
    this.panel = createElement(document.createElement("div"));
    document.body.appendChild(this.panel.element);
    this.panel.element.className = "filter-panel";
    this.panel.element.style.minWidth = "160px";
    this.panel.element.style.display = "none";
    this.panel.element.style.left = "0px";
    this.panel.element.style.zIndex = 100; // So here I will create content of the filter.
    // Here I will hide the filter panel if the mouse get out of it.

    document.body.addEventListener("mousemove", function (filter, filterPanel) {
      return function (evt) {
        if (filterPanel.style.display != "none") {
          var isOutX = !(evt.pageX > filterPanel.offsetLeft && evt.pageX < filterPanel.offsetLeft + filterPanel.offsetWidth + 35);
          var isOutY = !(evt.pageY + 20 > filterPanel.offsetTop && evt.pageY < filterPanel.offsetTop + filterPanel.offsetHeight + 200);
          var isIn = !(isOutX || isOutY);

          if (!isIn) {
            // hide it.
            filterPanel.style.display = "none"; // Remove empty expressions.

            for (var i = 0; i < filter.filter.expressions.length; i++) {
              if (filter.filter.expressions[i].isEmpty()) {
                filter.filter.expressions[i].deleteBtn.element.click();
              }
            }
          }
        }
      };
    }(this, this.panel.element));
    var filterDiv = this.panel.appendElement({
      "tag": "div",
      "style": "width: 100%; height: 100%; flex: 1; display: flex; flex-direction: column; border-bottom: 1px solid grey; "
    }).down(); // Display the button filter.

    var buttonDiv = this.panel.appendElement({
      "tag": "div",
      "style": "width: 100%; margin-bottom: 2px; display: flex; justify-content: flex-end;"
    }).down();
    var applyBtn = buttonDiv.appendElement({
      "tag": "button",
      "innerHtml": "Apply",
      "style": "background-color: white; border: none; margin: 2px; font-size: 14px; -webkit-font-smoothing; antialiased; font-weight:normal;font-family:'Roboto', 'Noto', sans-serif;"
    }).down();
    var okBtn = buttonDiv.appendElement({
      "tag": "button",
      "innerHtml": "Ok",
      "style": "background-color: white; border: none; margin: 2px; font-size: 14px; -webkit-font-smoothing; antialiased; font-weight:normal;font-family:'Roboto', 'Noto', sans-serif;"
    }).down(); // Set the pointer for various button...

    applyBtn.element.onmouseover = okBtn.element.onmouseover = this.filterBtn.onmouseover = function () {
      this.style.cursor = "pointer";
    };

    applyBtn.element.onmouseout = okBtn.element.onmouseout = this.filterBtn.onmouseout = function () {
      this.style.cursor = "default";
    };

    okBtn.element.onclick = function (filter) {
      return function () {
        filter.panel.element.style.display = "none";

        if (filter.filter.expressions.length == 0 && filter.filter.filters.length == 0) {
          filter.filterBtn.style.display = "none"; // Here I will keep a deep copy of the filter.
        } // Also apply change.
        // Remove empty expressions.


        for (var i = 0; i < filter.filter.expressions.length; i++) {
          if (filter.filter.expressions[i].isEmpty()) {
            filter.filter.expressions[i].deleteBtn.element.click();
          }
        }

        filter.table.filter(filter);
        filter.table.refresh();
        fireResize();
      };
    }(this);

    applyBtn.element.onclick = function (filter) {
      return function () {
        // Apply sorter filter and refresh after.
        filter.table.filter(filter);
        filter.table.refresh();
      };
    }(this);

    window.addEventListener("resize", function (filter, table) {
      return function () {
        // Set the top position.
        var elemRect = getCoords(filter.filterBtn);
        filter.panel.element.style.top = elemRect.top + filter.filterBtn.offsetHeight + 1 + "px"; // Set the left position.

        filter.panel.element.style.left = elemRect.left - 5 + "px";
        /** TODO be sure that the panel is inside the screen... */
      };
    }(this, this.parentNode.parentNode.parentNode));
    /**
     * Display the panel...
     */

    this.filterBtn.onclick = function (tableFilter) {
      return function () {
        if (tableFilter.panel.element.style.display == "none") {
          tableFilter.panel.element.style.display = "flex";

          if (tableFilter.filter == null) {
            // Create new default filter if no filter exist...
            tableFilter.filter = new Filter(tableFilter, tableFilter.table, tableFilter.headerCell.index);
            tableFilter.filter.deleteFileterBtn.element.style.display = "none";
          }

          if (tableFilter.filter.expressions.length == 0) {
            // also create an expression panel
            tableFilter.filter.expressionsPanel.element.click();
          }
        } else {
          tableFilter.panel.element.style.display = "none"; // Here I will remove empty expressions.

          for (var i = 0; i < tableFilter.filter.expressions.length; i++) {
            if (tableFilter.filter.expressions[i].isEmpty()) {
              tableFilter.filter.expressions[i].deleteBtn.element.click();
            }
          }
        }
      };
    }(this);
  }

}

customElements.define('table-filter-element', TableFilterElement);