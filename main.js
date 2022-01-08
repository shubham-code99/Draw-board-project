let body=document.querySelector("body");
let displayTools=document.querySelector(".toolbar-display");
let pencilToolCont= document.querySelector(".pencil-tool");
let eraserToolCont= document.querySelector(".eraser-tool");
let pencil= document.querySelector(".fa-pencil-alt");
let eraser= document.querySelector(".fa-eraser");
let toolCont=document.querySelector(".tools");
let redColor = document.querySelector(".red");
let greenColor = document.querySelector(".green");
let blueColor = document.querySelector(".blue");
let pencilWidth=document.querySelector(".pencil-width");
let eraserWidth=document.querySelector(".eraser-width");
let download=document.querySelector(".fa-download")
let undo=document.querySelector(".fa-undo");
let redo=document.querySelector(".fa-redo");
let canvasboard=document.querySelector("canvas");
let tool = canvasboard.getContext("2d");

canvasboard.height = window.innerHeight;
canvasboard.width = window.innerWidth;
let boardTop = canvasboard.getBoundingClientRect().top; 
let boardleft = canvasboard.getBoundingClientRect().left;

let showToolBar=true;
let showPencilTools=false;
let showEraserTools=false;
let sx,
    sy,
    ex,
    ey,
    draw = false;
let ctool = "pencilTool";
let undoRedoTracker =[];
let track=0;

displayTools.addEventListener("click",(e) =>{
    showToolBar=!showToolBar;
    if(showToolBar==true) openTools();
    else closeTools();

})

pencil.addEventListener("click",(e)=>{
    if(showPencilTools)
        pencilToolCont.style.display= "none";
    else 
        pencilToolCont.style.display= "block";
    showPencilTools=!showPencilTools;
    ctool="pencilTool";

    tool.strokeStyle = "black";
    
})

redColor.addEventListener("click", function () {
    tool.strokeStyle = "red";
});
greenColor.addEventListener("click", function () {
    tool.strokeStyle = "green";
});
blueColor.addEventListener("click", function () {
    tool.strokeStyle = "blue";
    
});

eraser.addEventListener("click",(e)=>{
    if(showEraserTools)
    eraserToolCont.style.display= "none";
    else 
    eraserToolCont.style.display= "flex";
    showEraserTools=!showEraserTools;
    ctool="eraserTool";
    
})


body.addEventListener("mousedown",function(e){
    if(ctool=="pencilTool")
        draw = true;
    sx = e.clientX - boardleft;
    sy = e.clientY - boardTop;
    

    if(ctool=="eraserTool"){
        draw=true;
        let b_color= getComputedStyle(body);
        tool.strokeStyle= b_color.backgroundColor;
    }
    
})


body.addEventListener("mousemove", function (e) {
    if(draw==false) return;
    
    tool.beginPath();
    tool.moveTo(sx, sy);
    tool.lineTo(e.clientX-boardleft, e.clientY - boardTop);
    tool.stroke();
    sx = e.clientX - boardleft;
    sy = e.clientY - boardTop;
});

body.addEventListener("mouseup", function (e) {
    
    draw= false;
    
    // let url= canvasboard.toDataURL();
    // undoRedoTracker.push(url);
    // console.log(undoRedoTracker);
    // track=undoRedoTracker.length-1;    
    
});

canvasboard.addEventListener("mouseup",function(e){
    let url= canvasboard.toDataURL();
    undoRedoTracker.push(url);
    console.log(undoRedoTracker);
    track=undoRedoTracker.length-1;
})

function openTools(){
    let icon=displayTools.children[0];
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
    toolCont.style.display= "flex";
    
}

function closeTools(){
    let icon=displayTools.children[0];
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");
    toolCont.style.display= "none";
    pencilToolCont.style.display= "none";
    eraserToolCont.style.display= "none";
}

pencilWidth.addEventListener("change",(e)=>{
    let pwidth=pencilWidth.value;
    tool.lineWidth= pwidth;
})

eraserWidth.addEventListener("change",(e)=>{
    let ewidth=eraserWidth.value;
    tool.lineWidth= ewidth;
})

download.addEventListener("click",(e)=>{
    let url=canvasboard.toDataURL();
    let a=document.createElement("a");
    a.href= url;
    a.download= "board.jpg";
    a.click();
})

undo.addEventListener("click", (e)=>{
    if(track > 0)   
    {
        track--;
        // else return;
        let trackobj={
            trackValue: track,
            undoRedoTracker
        }
        undoredoDisplay(trackobj);
    }
})

redo.addEventListener("click", (e)=>{
    if(track < undoRedoTracker.length-1)
    {
        track++;
        // else return;
        let trackobj={
            trackValue: track,
            undoRedoTracker
        }
        undoredoDisplay(trackobj);
    }
    
})

function undoredoDisplay(trackobj){
    track= trackobj.trackValue;
    undoRedoTracker= trackobj.undoRedoTracker;

    let url=undoRedoTracker[track];
    let img=new Image();
    img.src= url;
    img.onload  = (e) => {
        tool.drawImage(img,0,0);
    }
}