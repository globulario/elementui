// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';

// List of imported functionality.
import { createElement } from "../element.js"
import { randomUUID } from "../utility.js"
import '../dialog/dialog.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/neon-animation/neon-animatable.js';

/**
 * Display a single image.
 */
class ImagePanel {
  constructor(parent, fileInfo, data) {
    // Keep the parent.
    this.parent = parent

    // The file info.
    this.fileInfo = fileInfo;

    this.panel = parent.panel.appendElement({
      "tag": "div",
      "class": "image_panel",
      "style": "margin:10px 5px 10px 5px"
    }).down(); // Supported video.

    if (fileInfo.Mime.endsWith(".mp4") || fileInfo.Mime.endsWith(".mp3") || fileInfo.Mime.endsWith(".avi") || fileInfo.Mime.endsWith(".mpeg")) {// this.video = this.panel.appendElement({ "tag": "video", "src": "http://" + server.hostName + ":" + server.port + path, "type": "video/mp4", "controls": "" }).down()
    } else {
      this.image = this.panel.appendElement({
        "tag": "img",
        "src": fileInfo.Thumbnail,
        "title": fileInfo.Name
      }).down();
    } // Now the delete button...

    this.deleteBtn = this.panel.appendElement({
      "tag": "div",
      "class": "append_picture_btn",
      "style": "top: -10px; right: -10px; display: none;"
    }).down();

    this.deleteBtn.appendElement({
      "tag": "paper-icon-button",
      "icon": "clear"
    });

    this.image.element.onclick = function (imagePanel) {
      return function () {
        // Call onopen on parent and give fileInfo and data.
        if (imagePanel.parent != null) {
          imagePanel.parent.onopen(imagePanel.fileInfo, imagePanel.data)
        }
      }
    }(this)

    this.image.element.onmouseenter = this.deleteBtn.element.onmouseenter = function () {
      this.style.cursor = "pointer";
    };

    this.image.element.onmouseleave = this.deleteBtn.element.onmouseleave = function () {
      this.style.cursor = "default";
    }; // Now the delete warning...

    this.deleteBtn.element.onclick = function (imagePanel, filePaneElement) {
      return function (e) {
        // this.panel
        e.stopPropagation(); // delete a file.

        var confirmDialog = document.createElement("dialog-element");
        confirmDialog.title = "Delete file";
        confirmDialog.ismodal = true;
        confirmDialog.innerHTML = "<div style='height: 100%; width: 100%; padding: 15px;'>Do you want to delete file " + imagePanel.fileInfo.Path + "?</div>"; // Remove the file from the panel.

        confirmDialog.onok = function (imagePanel, filePaneElement) {
          return function () {
            if (filePaneElement.ondelete != undefined) {
              filePaneElement.ondelete(imagePanel.fileInfo.Path);
              filePaneElement.removeImage(imagePanel.fileInfo.Path)
            }

            imagePanel.panel.element.parentNode.removeChild(imagePanel.panel.element);
          };
        }(imagePanel, filePaneElement);

        document.body.appendChild(confirmDialog);
      };
    }(this, parent);

    this.panel.element.onmouseenter = function (deleteBtn) {
      return function () {
        deleteBtn.element.style.display = "block";
      };
    }(this.deleteBtn);

    this.panel.element.onmouseleave = function (deleteBtn) {
      return function () {
        deleteBtn.element.style.display = "none";
      };
    }(this.deleteBtn);
  }
}

/**
 * This element is use to display files in a server directory.
 * It can be use to upload file, delete file, download file...
 */
class FilePaneElement extends PolymerElement {
  constructor() {
    super(); // The directory object.
    // this.directory = null; // This is the json string...

    this.uuid = randomUUID();
    this.panel = null;
    this.path = "";
    this.imagePanels = {};
    this.selectImageBtn = null;
  }

  /**
   * The internal component properties.
   */
  static get properties() {
    return {
      id: String,
      path: String, // The file path on the server.
      width: Number,
      height: Number,
      ondelete: Function,
      onopen: Function,
      onnewfile: Function,
      uploadHandler: Function, // That function is use to upload the file.
    };
  }

  static get template() {
    return html`
            <style>
                .image_picker{
                    position: relative;
                    overflow: auto;
                    width: 100%;
                    height: 100%;
                    border: 2px dotted #ced4da;
                    margin-bottom: 1rem!important;
                    flex-direction: row;
                    display: flex;
                    flex-wrap: wrap;
                }

                .append_picture_btn {
                    position: absolute;
                    border-radius: 20px;
                    border: 1px solid #ced4da;
                    z-index: 10;
                    height: 40px;
                    width: 40px;
                    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
                    background-color: white;
                    color: #495057;
                }
                
                .append_picture_btn:hover{
                    cursor: pointer;
                }
                
                .image_panel{
                    margin-top: 10px;
                    border: 1px solid #ced4da;
                    width: 150px;
                    height: 150px;
                    position: relative;
                }
                
                .image_panel img {
                    position:absolute;
                    max-width: 148px;
                    max-height: 148px;
                    top:0;
                    bottom:0;
                    margin:auto;
                }
                
                .image_panel  video{
                    position:absolute;
                    max-width: 148px;
                    max-height: 148px;
                    top:0;
                    bottom:0;
                    margin:auto;
                }
                
            </style>
            <slot>
            </slot>
    `;
  }

  /**
   * That function is call when the file pane is ready to be diplay.
   */
  ready() {
    super.ready();
    var shadowRootElement = createElement(this.shadowRoot.children[1]); // The panel that will contain the list of files.

    var div = shadowRootElement.appendElement({
      "tag": "div",
      "style": "position: relative;"
    }).down();

    this.panel = div.appendElement({
      "tag": "div",
      "class": "image_picker"
    }).down(); // Set the width and heigth if specified...

    if (this.width != 0) {
      div.element.style.width = this.width + "px";
    }

    if (this.height != 0) {
      div.element.style.height = this.height + "px";
    } // Display the local image selector.

    this.selectImageBtn = div.appendElement({
      "tag": "div",
      "class": "append_picture_btn",
      "style": "top: 0px; left: 0px; display: none;"
    }).down().appendElement({
      "tag": "paper-icon-button",
      "icon": "add"
    });

    div.element.onmouseover = function (selectImageBtn) {
      return function () {
        selectImageBtn.element.style.display = "";
      };
    }(this.selectImageBtn);

    div.element.onmouseout = function (selectImageBtn) {
      return function () {
        selectImageBtn.element.style.display = "none";
      };
    }(this.selectImageBtn); // Ajout d'un image a l'aide du selecteur de fichier.

    //////////////////////////////// Drag/Drop /////////////////////////////
    this.panel.element.addEventListener('dragover', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
      this.style.borderColor = "darkgrey"
    }, false)

    this.panel.element.addEventListener('dragleave', function (evt) {
      this.style.borderColor = ""
    }, false)

    this.panel.element.addEventListener('drop', function (filePaneElement) {
      return function (evt) {
        /* Here I will get the list of files... **/
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files // FileList object.
        for (var i = 0, f; f = files[i]; i++) {
          var reader = new FileReader();
          // Closure to capture the file information.
          reader.onload = (function (info, filePaneElement) {
            return function (e) {
              // append / at end if not given.
              if(!filePaneElement.path.endsWith("/")){
                filePaneElement.path += "/"
              }
              var fileInfo = {
                "Name": info.name,
                "Size": info.size,
                "IsDir": false,
                "Path": filePaneElement.path + info.name,
                "Mime": info.type,
                "Thumbnail": e.target.result,
                "Local": info
              }
              filePaneElement.appendImage(fileInfo)
              filePaneElement.onnewfile(fileInfo)
            };
          })(f, filePaneElement);

          // Read the file as data url to create the image
          reader.readAsDataURL(f);
        }
      }
    }(this), false)

    //////////////////  File input /////////////////////
    this.fileInput = this.panel.appendElement({
      "tag": "input",
      "type": "file",
      "multiple": "",
      "style": "display: none;"
    }).down();

    this.selectImageBtn.element.onclick = function (fileInput) {
      return function () {
        fileInput.element.click();
      };
    }(this.fileInput); // Ajout d'un image dans le repertoire.


    this.fileInput.element.onchange = function (filePaneElement) {
      return function (evt) {
        /* Here I will get the list of files... **/
        var files = evt.target.files; // FileList object.

        for (var i = 0, f; f = files[i]; i++) {
          var reader = new FileReader();
          // Closure to capture the file information.
          reader.onload = (function (info, filePaneElement) {
            return function (e) {
              if (!filePaneElement.path.endsWith("/")) {
                filePaneElement.path += "/";
              }
              var fileInfo = {
                "Name": info.name,
                "Size": info.size,
                "IsDir": false,
                "Path": filePaneElement.path + info.name,
                "Mime": info.type,
                "Thumbnail": e.target.result,
                "Local": info
              }
              filePaneElement.appendImage(fileInfo)
              filePaneElement.onnewfile(fileInfo)
            };
          })(f, filePaneElement);

          // Read the file as data url to create the image
          reader.readAsDataURL(f);
        }
      };
    }(this);

  } // Clear the content of the file.

  //////////////////// FilePaneElement //////////////////////////
  clear() {
    this.panel.removeAllChilds();
    this.panel.element.innerHTML = "";
  } // Set the directory and display files.

  setDirInfo(dirInfo) {
    // Here I will create the panel that will contain the files.
    this.clear(); // Create the dir object from the string.

    var dir = JSON.parse(dirInfo);
    if (dir.Files != undefined) {
      for (var i = 0; i < dir.Files.length; i++) {
        // Here I will create a local image info.
        var f = dir.Files[i];
        if (f.Mime.startsWith("image/")) {
          this.appendImage(f);
        }
      }
    }
  } // Upload a file...

  appendImage(imageInfo) {
    this.imagePanels[imageInfo.Path] = new ImagePanel(this, imageInfo);
  }

  removeImage(path) {
    delete this.imagePanels[path]
  }

  // Save all 'Local' file contain in the pane.
  saveAll() {
    for (var id in this.imagePanels) {
      if (this.imagePanels[id].fileInfo.Local != undefined) {
        this.uploadHandler(this.imagePanels[id].fileInfo)
      }
    }
  }

  // Return the list of local files.
  getLocalFiles(){
    var files = []
    for(var id in this.imagePanels){
      if(this.imagePanels[id].fileInfo.Local != undefined){
        files.push(this.imagePanels[id].fileInfo.Local)
      }
    }
    return files
  }

  // Return the file info.
  getFileInfos(){
    var files = []
    for(var id in this.imagePanels){
        files.push(this.imagePanels[id].fileInfo)
    }
    return files
  }

}

customElements.define('file-pane-element', FilePaneElement);
