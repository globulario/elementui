/**
 * That propertie take a div and append resizeable capabilities.
 */
export function setResizeable(div) {
  // keep movable attribute in the div itself.
  div.isResizeWidth = false;
  div.isResizeHeigth = false;
  div.isOverResizeWidthDiv = false;
  div.isOverResizeHeihtgDiv = false;
  div.isOverResizeDiv = false; // first of all I will create the resize divs...

  var resizeWidthDiv = document.createElement("div");
  resizeWidthDiv.id = "resize-with-div";
  resizeWidthDiv.style.position = "absolute";
  resizeWidthDiv.style.top = "0px";
  resizeWidthDiv.style.bottom = "10px";
  resizeWidthDiv.style.width = "10px";
  resizeWidthDiv.style.right = "-1px";
  div.appendChild(resizeWidthDiv);

  resizeWidthDiv.onmouseover = function () {
    this.style.cursor = "ew-resize";
    this.style.borderRight = "5px solid lightgrey";
  };

  resizeWidthDiv.onmouseout = function () {
    this.style.cursor = "default";
    this.style.borderRight = "";
  };

  var resizeHeightDiv = document.createElement("div");
  resizeHeightDiv.id = "resize-height-div";
  resizeHeightDiv.style.position = "absolute";
  resizeHeightDiv.style.height = "10px";
  resizeHeightDiv.style.bottom = "-1px";
  resizeHeightDiv.style.left = "0px";
  resizeHeightDiv.style.right = "10px";
  div.appendChild(resizeHeightDiv);

  resizeHeightDiv.onmouseover = function () {
    this.style.cursor = "row-resize";
    this.style.borderBottom = "5px solid lightgrey";
  };

  resizeHeightDiv.onmouseout = function () {
    this.style.cursor = "default";
    this.style.borderBottom = "";
  };

  var resizeDiv = document.createElement("div");
  resizeDiv.id = "resize-div";
  resizeDiv.style.position = "absolute";
  resizeDiv.style.bottom = "-1px";
  resizeDiv.style.right = "-1px";
  resizeDiv.style.height = "10px";
  resizeDiv.style.width = "10px";
  div.appendChild(resizeDiv);

  resizeDiv.onmouseover = function () {
    this.style.cursor = "nwse-resize";
    this.style.backgroundColor = "lightgrey";
  };

  resizeDiv.onmouseout = function () {
    this.style.cursor = "default";
    this.style.backgroundColor = "";
  };

  resizeDiv.onmouseenter = function (div) {
    return function () {
      div.isOverResizeDiv = true;
    };
  }(div);

  resizeDiv.onmouseleave = function (div) {
    return function () {
      div.isOverResizeDiv = false;
    };
  }(div);

  resizeHeightDiv.onmouseenter = function (div) {
    return function () {
      div.isOverResizeHeihtgDiv = true;
    };
  }(div);

  resizeHeightDiv.onmouseleave = function (div) {
    return function () {
      div.isOverResizeHeihtgDiv = false;
    };
  }(div);

  resizeWidthDiv.onmouseenter = function (div) {
    return function () {
      div.isOverResizeWidthDiv = true;
    };
  }(div);

  resizeWidthDiv.onmouseleave = function (div) {
    return function () {
      div.isOverResizeWidthDiv = false;
    };
  }(div);

  document.body.addEventListener("mouseup", function (div) {
    return function (e) {
      div.isResizeWidth = false;
      div.isResizeHeigth = false;
      document.body.style.cursor = "default"; // fire resize event at start...

      var evt = document.createEvent('HTMLEvents');
      evt.initEvent('resize', true, false);
      div.dispatchEvent(evt);
    };
  }(div));
  document.body.addEventListener("mousedown", function (div) {
    return function (e) {
      if (div.isOverResizeWidthDiv) {
        div.isResizeWidth = true;
      }

      if (div.isOverResizeHeihtgDiv) {
        div.isResizeHeigth = true;
      }

      if (div.isOverResizeDiv) {
        div.isResizeWidth = true;
        div.isResizeHeigth = true;
      }
    };
  }(div)); // Here I will resize the div as needed.

  document.body.addEventListener("mousemove", function (div) {
    return function (e) {
      var w = e.clientX - div.offsetLeft;
      var h = e.clientY - div.offsetTop;

      if (div.isResizeWidth && div.isResizeHeigth) {
        div.style.width = w + "px";
        div.style.height = h + "px";
      } else if (div.isResizeWidth) {
        if (div.offsetWidth > w) {
          document.body.style.cursor = "w-resize";
        } else if (div.offsetWidth < w) {
          document.body.style.cursor = "e-resize";
        } else {
          document.body.style.cursor = "ew-resize";
        }

        div.style.width = w + "px";
      } else if (div.isResizeHeigth) {
        if (div.offsetHeight > h) {
          document.body.style.cursor = "n-resize";
        } else if (div.offsetHeight < h) {
          document.body.style.cursor = "s-resize";
        } else {
          document.body.style.cursor = "ns-resize";
        }

        div.style.height = h + "px";
      }
    };
  }(div));
}