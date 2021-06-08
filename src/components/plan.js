import React, {useRef, useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";
import * as html2canvas from 'html2canvas';
import axios from "axios";
import Select from 'react-select';
import coded from "../images/coded.png"
import { Radio } from "semantic-ui-react";



const gort = [
    {label: "G", value: "G" },
    {label: "T", value: "T" }
]
const nums = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 }
];


function send(json,val,valfloor){
  // let formData = new FormData();
        // formData.append('image' , img);
        if(val===null)
        val={label:"1",value:"1"}
        if(valfloor===null)
          valfloor={label:"G",value:"G"}
        axios.post("http://localhost:5000/maskImage", val.value+valfloor.value+json, {
          headers: {
    // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
      }).then((res) =>
      {
      var a=res.request.response.slice(10,res.request.response.length-3)
      // console.log("a")
      var image = new Image();
      image.height = 384;
      image.width = 384;
      image.src = 'data:image/png;base64,'+a
      // console.log(image.src);
      if(document.getElementById("output").childNodes.length===0){
      document.getElementById("output").appendChild(image);
      }
      else{
        document.getElementById("output").replaceChild(image,document.getElementById("output").childNodes[0])
      }

    }
       )
        .catch(err => console.log(err,"upload error"));
  };

const generator = rough.generator();



const useHistory = initialState => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action, overwrite = false) => {
    const newState = typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex(prevState => prevState + 1);
    }
  };
  const undo = () => index > 0 && setIndex(prevState => prevState - 1);
  const redo = () => index < history.length - 1 && setIndex(prevState => prevState + 1);

  return [history[index], setState, undo, redo];
};

const Plan = () => {
  const canvas = useRef(null);

  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("rectangle");
  const [color, setColor] = useState("black");
  const [selectedElement, setSelectedElement] = useState(null);

  const [selectednumOption, setSelectednumOption] = useState(null);
  const [selectedfloorOption, setSelectedfloorOption] = useState(null);
  // handle onChange event of the dropdown
  const handlenumChange = e => {
    setSelectednumOption(e);
  }
  const checkselectednumOption = () => {
    return selectednumOption;
  }  
  const handlefloorChange = e => {
    setSelectedfloorOption(e);
  }
  const checkselectedfloorOption = () => {
    return selectedfloorOption;
  }
  

  const createElement = (id, x1, y1, x2, y2, type) => {
    const roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, {fill: color==='black'?'black':'white', fillStyle: 'solid'});
      // type === "line"
      //   ? generator.line(x1, y1, x2, y2)
      //   :
    return { id, x1, y1, x2, y2, type, roughElement };
  };
  
  const nearPoint = (x, y, x1, y1, name) => {
    return Math.abs(x - x1) < 1 && Math.abs(y - y1) < 1 ? name : null;
  };
  
  const positionWithinElement = (x, y, element) => {
    const { type, x1, x2, y1, y2 } = element;
    if (type === "rectangle") {
      const topLeft = nearPoint(x, y, x1, y1, "tl");
      const topRight = nearPoint(x, y, x2, y1, "tr");
      const bottomLeft = nearPoint(x, y, x1, y2, "bl");
      const bottomRight = nearPoint(x, y, x2, y2, "br");
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    }
    //  else {
    //   const a = { x: x1, y: y1 };
    //   const b = { x: x2, y: y2 };
    //   const c = { x, y };
    //   const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    //   const start = nearPoint(x, y, x1, y1, "start");
    //   const end = nearPoint(x, y, x2, y2, "end");
    //   const inside = Math.abs(offset) < 1 ? "inside" : null;
    //   return start || end || inside;
    // }
  };
  
  const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  
  const getElementAtPosition = (x, y, elements) => {
    return elements
      .map(element => ({ ...element, position: positionWithinElement(x, y, element) }))
      .find(element => element.position !== null);
  };
  
  
  
  const cursorForPosition = position => {
    switch (position) {
      case "tl":
      case "br":
      case "start":
      case "end":
        return "nwse-resize";
      case "tr":
      case "bl":
        return "nesw-resize";
      default:
        return "move";
    }
  };
  
  const resizedCoordinates = (clientX, clientY, position, coordinates) => {
    const { x1, y1, x2, y2 } = coordinates;
    switch (position) {
      case "tl":
      case "start":
        return { x1: clientX, y1: clientY, x2, y2 };
      case "tr":
        return { x1, y1: clientY, x2: clientX, y2 };
      case "bl":
        return { x1: clientX, y1, x2, y2: clientY };
      case "br":
      case "end":
        return { x1, y1, x2: clientX, y2: clientY };
      default:
        return null; //should not really get here...
    }
  };


  function captureScreenshot(rootElem) {
  //console.log(rootElem);
  var val = checkselectednumOption();
  var valfloor = checkselectedfloorOption();
  html2canvas(rootElem).then(canvas => {
  var img = canvas.toDataURL("image/png")
  // const json = JSON.stringify(img);
  send(img,val,valfloor);
  });
  }
  // useEffect(() => {
	//   // dynamically assign the width and height to canvas
	//   const canvasEle = canvas.current;
	//   canvasEle.width = canvasEle.clientWidth;
	//   canvasEle.height = canvasEle.clientHeight;
	// }, []);
  
  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  // const drawFillRect = (info, style = {}) => {
  // const { x, y, w, h } = info;
  // const { backgroundColor = 'black' } = style; 
  // ctx.beginPath();
  // ctx.fillStyle = backgroundColor;
  // ctx.fillRect(x, y, w, h);
  // }

  const adjustElementCoordinates = element => {
    const { type, x1, y1, x2, y2 } = element;
    if (type === "rectangle") {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
      // return drawFillRect(minX, minY, maxX-minX, maxY-minY);
    } else {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    }
  };

  const screens = () => {
		const elements = canvas.current;
		captureScreenshot(elements);
	};
  useEffect(() => {
    const undoRedoFunction = event => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  const updateElement = (id, x1, y1, x2, y2, type) => {
    const updatedElement = createElement(id, x1, y1, x2, y2, type);
    console.log(id,x1,x2,y1,y2);
    const elementsCopy = [...elements];
    elementsCopy[id] = updatedElement;
    setElements(elementsCopy, true);
  };

  const handleMouseDown = event => {
    const { clientX, clientY } = event;
    var rect = canvas.current.getBoundingClientRect();
    console.log(clientX, clientY);
    if (tool === "selection") {
      const element = getElementAtPosition(clientX-rect.left, clientY-rect.top, elements);
      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        console.log(clientX,clientY,element.x1,element.y1);
        setSelectedElement({ ...element, offsetX, offsetY });
        setElements(prevState => prevState);
        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      const id = elements.length;
      const element = createElement(id, clientX, clientY, clientX, clientY, tool);
      setElements(prevState => [...prevState, element]);
      setSelectedElement(element);

      setAction("drawing");
    }
  };

  const handleMouseMove = event => {
    const { clientX, clientY } = event;

    if (tool === "selection") {
      const offsetX = document.getElementById("canvas").offsetLeft;
      const offsetY = document.getElementById("canvas").offsetTop;
      // console.log(clientX-offsetX, clientY-offsetY);
      const element = getElementAtPosition(clientX-offsetX, clientY-offsetY, elements);
      event.target.style.cursor = element ? cursorForPosition(element.position) : "default";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      const offsetX = document.getElementById("canvas").offsetLeft;
      const offsetY = document.getElementById("canvas").offsetTop;
      // console.log(index, x1, y1, clientX-offsetX, clientY-offsetY, tool);
      updateElement(index, x1, y1, clientX-offsetX, clientY-offsetY, tool);
    } else if (action === "moving") {
      const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const newX1 = clientX - offsetX;
      const newY1 = clientY - offsetY;
      // const offsX = document.getElementById("canvas").offsetLeft;
      // const offsY = document.getElementById("canvas").offsetTop;
      updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type);
    } else if (action === "resizing") {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position, coordinates);
      updateElement(id, x1, y1, x2, y2, type);
    }
  };

  const handleMouseUp = () => {
    if (selectedElement) {
      const index = selectedElement.id;
      const { id, type } = elements[index];
      if (action === "drawing" || action === "resizing") {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type);
      }
    }
    setAction("none");
    setSelectedElement(null);
  };



  return (
    <div>
       {/* style={{ position: "fixed" }} */}
       <div className="holder">
      <div className="toolselector">
        {/* <input type="radio" id="line" checked={tool === "line"} onChange={() => setTool("line")} />
        <label htmlFor="line">Line</label> */}
        <input
          type="radio"
          id="rectangle"
          name="tools"
          checked={tool === "rectangle"}
          onChange={() => setTool("rectangle")}
        />
        <label htmlFor="rectangle">Rectangle &nbsp; &nbsp;</label>
        <input
          type="radio"
          id="selection"
          name="tools"
          checked={tool === "selection"}
          onChange={() => setTool("selection")}
        />
        <label htmlFor="selection">Selection</label>
      </div>
      <div className="blankk"></div>
      <div className="colorselector">
        {/* <input type="radio" id="line" checked={tool === "line"} onChange={() => setTool("line")} />
        <label htmlFor="line">Line</label> */}
        <input
          type="radio"
          id="rectangle"
          name="color"
          checked={color === "black"}
          onChange={() => setColor("black")}
        />
        <label htmlFor="black">Black &nbsp; &nbsp;</label>
        <input
          type="radio"
          id="selection"
          name="color"
          checked={color === "white"}
          onChange={() => setColor("white")}
        />
        <label htmlFor="grey">Stairs</label>
      </div>
      </div>
      {/* style={{ position: "fixed", bottom: 0, padding: 10 }} */}
      <br/>
      
      <div className="Plan">
      <canvas
        id="canvas" ref={canvas}
        width={384}
        height={384}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
      </canvas>
      <button className="process" onClick={screens}>Process</button>
      <div id="output" className="output"></div>
      <img className="coded" src={coded} style={{width:200+'px'}}></img>
      </div>
      <div>
        <button className="urdo" onClick={undo}>Undo</button>
        <button className="urdo" onClick={redo}>Redo</button>
      </div>
      <div className="selection" style={{margin:10+'px',marginLeft:30+'px'}}>
        No.of Rooms :&nbsp; &nbsp;
        <div className="select">
      <Select 
      // defaultInputValue={nums[0].value}
        value={selectednumOption} // set selected value
        options={nums} // set list of the data
        onChange={handlenumChange}
        styles={{bottom:100+'%'}}
        menuPlacement="auto"
        /></div>
        <br/>
      </div>
        <div className="selection" style={{margin:10+'px',marginLeft:30+'px'}}>
          Ground Floor or Top Floor :&nbsp; &nbsp;
      <div className="select">
      <Select 
      // defaultInputValue={gort[0].value}
        value={selectedfloorOption} // set selected value
        options={gort} // set list of the data
        onChange={handlefloorChange}
        styles={{bottom:100+'%'}}
        menuPlacement="auto"
        /></div>
      </div>
      
    </div>
  );
};

export default Plan;
