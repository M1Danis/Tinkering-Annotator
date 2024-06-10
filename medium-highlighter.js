

var highlights;
var highlightColor = "rgb(0,15,0)";

// function setColor() {
//   var newColor = document.getElementById("colorPicker");
//   highlightColor = newColor;
//   // chrome.storage.local.get("highlights", results => {
//   //   highlights = results.highlights;
//   //   highlights[color] = newColor.value;
//   // chrome.storage.local.set({ highlights }, () => {});
//   // });
// }
console.log('medium');
const template = `
  <template id="highlightTemplate">
    <span class="highlight" style="background: ${highlightColor}; display: inline"></span>
  </template>
  <button id="mediumHighlighter">
    <svg class="text-marker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 544 512"><path d="M0 479.98L99.92 512l35.45-35.45-67.04-67.04L0 479.98zm124.61-240.01a36.592 36.592 0 0 0-10.79 38.1l13.05 42.83-50.93 50.94 96.23 96.23 50.86-50.86 42.74 13.08c13.73 4.2 28.65-.01 38.15-10.78l35.55-41.64-173.34-173.34-41.52 35.44zm403.31-160.7l-63.2-63.2c-20.49-20.49-53.38-21.52-75.12-2.35L190.55 183.68l169.77 169.78L530.27 154.4c19.18-21.74 18.15-54.63-2.35-75.13z"></path></svg>
  </button>
`; 


const styled = ({ display = "none", left = 0, top = 0 }) => `
  #mediumHighlighter {
    align-items: center;
    background-color: black;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    display: ${display};
    justify-content: center;
    left: ${left}px;
    padding: 5px 10px;
    position: fixed;
    top: ${top}px;
    width: 40px;
    z-index: 9999;
  }
  .text-marker {
    fill: white;
  }
  .text-marker:hover {
    fill: ${highlightColor};
  }
`;


class MediumHighlighter extends HTMLElement {
  get markerPosition() {
    return JSON.parse(this.getAttribute("markerPosition") || "{}");
  }

  get styleElement() {
    return this.shadowRoot.querySelector("style");
  }

  get highlightTemplate() {
    return this.shadowRoot.getElementById("highlightTemplate");
  }

  static get observedAttributes() {
    return ["markerPosition"];
  }

  constructor() {
    super();
    this.render();
  }

  render() {
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = styled({});
    this.shadowRoot.appendChild(style);
    this.shadowRoot.innerHTML += template;
    
    console.log('beforerender');
    this.shadowRoot
      .getElementById("mediumHighlighter")
      .addEventListener("click", () => this.highlightSelection());

      
    console.log('render');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "markerPosition") {
      this.styleElement.textContent = styled(this.markerPosition);
    }
  }

  highlightSelection() {
    console.log('highlightselection')
    var userSelection = window.getSelection();
    
    for (let i = 0; i < userSelection.rangeCount; i++) {
      this.highlightRange(userSelection.getRangeAt(i));
    }
    window.getSelection().empty();
  }

  highlightRange(range) {
        var url = window.location.href;
        console.log("highlightrange")
        console.log(url);
        
        
        const clone =
        this.highlightTemplate.cloneNode(true).content.firstElementChild;
        clone.appendChild(range.extractContents());
        
        chrome.storage.local.get("highlights", results => {
          highlights = results.highlights;
          // var spanElement = document.querySelector('.highlight');
          // spanElement.style.background = highlights[url]["color"];
          highlightColor = highlights[url]["color"];
          clone.style.background = highlightColor;
          
          if(!highlights[url]["high"]){ highlights[url]["high"] = [];  }
          
          // let note = { date: noteDate, title: noteTitle, body: noteBody };
          let note = { };
          highlights[url]["high"].push( [ clone.innerText , note]) ;
          // highlights[url]["high"].push({ html:clone, rang:range });
          console.log(highlights[url]["high"]);
          
          // console.log(highlights[url]["high"][0].html);
          // console.log(highlights[url]["high"][0].rang);
          // highlights[url]["high"] =  [clone, range ] ;

          
          console.log("color"); console.log(highlights[url]["color"]);
          chrome.storage.local.set({ highlights }, () => {});
          console.log(range); console.log(typeof(range));  console.log(clone); console.log(typeof(clone));
          
        });
        var rr; var cll;
        chrome.storage.local.get("highlights", results => {
          
          highlights = results.highlights;
          
          // console.log(String(highlights[url]["high"])); console.log(typeof(highlights[url]["high"]));
          // console.log(highlights[url]["high"][1]); console.log(typeof(highlights[url]["high"][1]));
          // highlights[url]["high"][1].insertNode(highlights[url]["high"][0]);

          //  rr =  JSON.parse(highlights[url]["high"][1]); 
          //  cll = highlights[url]["high"][0];
          // console.log(highlights[url]);
          //  console.log(rr); console.log(cll);
          // rr.insertNode(cll);
        });
    // rr.insertNode(cll);
    range.insertNode(clone);

  }
}

window.customElements.define('medium-highlighter', MediumHighlighter);
  
// window.customElements.define("medium-highlighter", MediumHighlighter);