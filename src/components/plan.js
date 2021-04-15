import React, { useRef, useEffect } from 'react';
import * as html2canvas from 'html2canvas';


function captureScreenshot(rootElem) {
    alert("Now.. Preparing Screenshot");
    console.log(rootElem);

    html2canvas(rootElem).then(canvas => {
		var img = canvas.toDataURL("image/png")
		window.open(img);
    });
}

function Plan() 
{
	const canvas = useRef(null);
	let ctx = null;

   
	// initialize the canvas context
	useEffect(() => {
	  // dynamically assign the width and height to canvas
	  const canvasEle = canvas.current;
	  canvasEle.width = canvasEle.clientWidth;
	  canvasEle.height = canvasEle.clientHeight;
   
	  // get context of the canvas
	  ctx = canvasEle.getContext("2d");
	}, []);
	useEffect(() => {
		const r3Info = { x: 260, y: 80, w: 80, h: 120 };
		drawFillRect(r3Info, { backgroundColor: 'green' });
	 
		const r4Info = { x: 50, y: 160, w: 200, h: 100 };
		drawFillRect(r4Info);
	  }, []);

	  const drawFillRect = (info, style = {}) => {
		const { x, y, w, h } = info;
		const { backgroundColor = 'black' } = style; 
		ctx.beginPath();
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(x, y, w, h);
	  }

	  const onClick = () => {
		const elements = canvas.current;
		captureScreenshot(elements);
	};
	return (
	  <div className="Plan" id="canvas">
		  <br/><br/><br/><br/>
		<canvas ref={canvas}></canvas>
		<br/>
		<button onClick={onClick}>Process</button>
	  </div>
	);
  }
   
  export default Plan;