var temp = 12;  //temp: # of lines
var time = 12;  // time:# of colums
var tempHigh = 30; //  tempHigh: highest temp

/*DrawFrame: temp: # of lines, time:# of colums, tempHigh: highest temp */
function drawFrame(temp,time,tempHigh){
	/*Relative value for diff resolution*/
	var canvas = document.getElementById("myCanvas");
	var chart = canvas.getContext("2d");
	
	len = Math.ceil($("#myCanvas").width() * 0.9); 
	hei = Math.ceil($("#myCanvas").height() * 0.8);
	
	/*Draw frame*/
	chart.fillStyle="#138f96";
        chart.fillRect(42, 40, len+10, hei+10); 
        chart.fill();

	chart.fillStyle="#ffffff";
	chart.fillRect(47,45,len,hei);
	chart.fill();

	/*Draw Ver line*/
	chart.strokeStyle="#a3d4d6";
	chart.lineWidth=2;
	chart.beginPath();
	for(i = 1; i < time; i++){
		chart.moveTo(i*len/time+47-1,45);
		chart.lineTo(i*len/time+47-1,45+hei);
	}
	chart.stroke();

	//Draw Hor line
	chart.strokeStyle="#d7d7d7";
	chart.lineWidth=1;
	chart.beginPath();
	for(i = 1; i < temp; i++){
		chart.moveTo(47,i*(hei)/temp+45-1);
		chart.lineTo(47+len,i*(hei)/temp+45-1);
	}
	chart.stroke();

	//Draw the text
	chart.beginPath();
	chart.font = "10px Calibri";
	chart.fillStyle ="#373838"; 
	chart.fillText("Celsius: C",22,20);
	for(i = 0; i < temp+1; i++){
		txt=tempHigh-i*5;
		chart.fillText(txt,22,i*hei/temp+48);
	}	
}

/*drawTag draw a tag, at position(x,y) with a label of text*/
function drawTag(x,y,text){
	var canvas = document.getElementById("myCanvas");
	var chart = canvas.getContext("2d");
	chart.globalAlpha=0.8;
	/*Draw the point*/
	chart.fillStyle = "#138f96";
	chart.beginPath();
	chart.arc(x, y, 2, 0, 2 * Math.PI);
	chart.fill();	

	/*Draw the tag*/
	chart.beginPath();
	chart.moveTo(x+4,y-4);
	chart.lineTo(x+10,y-8);
	chart.lineTo(x+10,y+8);
	chart.lineTo(x+4, y+4);
	chart.closePath();
	chart.fill();	
        chart.fillRect(x+10, y-8, 35, 16); 
        chart.fill();

	//Draw the text
	chart.beginPath();
	chart.font = "12px Calibri";
	chart.fillStyle ="#ffffff"; 
	chart.fillText(text,x+10,y+4);
}

/*drawLine(temp1,temp2,rgb) temp1,temp2: points; rgb: rgb color, X:point2 time line */
function drawLine(temp1,temp2,X,rgb){
	var canvas = document.getElementById("myCanvas");
	var chart = canvas.getContext("2d");
	len = Math.ceil($("#myCanvas").width() * 0.9); 
	hei = Math.ceil($("#myCanvas").height() * 0.8);
	if (temp1 == -274 && temp2 != -274){
		var x1 = Math.ceil((X-1.5)*len/time+46) ; //x1 is the time line position
		var y1 = (tempHigh - temp1)*(hei/temp/5)+44; //y1 is the temp1 line position
		chart.fillStyle = rgb;
		/*Draw point1*/
		chart.beginPath();
		chart.arc(x1, y1, 3, 0, 2 * Math.PI);
		chart.fill();

	}
	else{
		var x1 = Math.ceil((X-1.5)*len/time+46) ; //x1 is the time line position
		var x2 = Math.ceil((X-0.5)*len/time+46) ; //x2 is the time line position
		var y1 = (tempHigh - temp1)*(hei/temp/5)+44; //y1 is the temp1 line position
		var y2 = (tempHigh - temp2)*(hei/temp/5)+44; //y2 is the temp1 line position
		chart.fillStyle = rgb;

		/*Draw Line*/
		chart.strokeStyle = rgb;
		chart.beginPath();
		chart.moveTo(x1,y1);
		chart.lineTo(x2,y2);
		chart.stroke();

		/*Draw point1*/
		chart.beginPath();
		chart.arc(x1, y1, 3, 0, 2 * Math.PI);
		chart.fill();

		/*Draw point2*/
		chart.beginPath();
		chart.arc(x2, y2, 3, 0, 2 * Math.PI);
		chart.fill();

	}
}
	

$( document ).ready(function() {
	//$("#myCanvas").width(Math.ceil($(window).width()*0.95 /100)*100).height(Math.ceil($(window).height()*0.7/ 100)*100);

	drawFrame(temp,time,tempHigh);
	drawTag(365,345,"26 C");
	drawLine(-274,25,1,"rgba(204,0,0,0.6)");//3 means the third value
	drawLine(25,33.3,3,"rgba(204,0,0,0.6)");//3 means the third value
	drawLine(33.3,28.5,4,"rgba(204,0,0,0.6)");
	drawLine(28.65,28.65,5,"rgba(204,0,0,1)");//3 means the third value
	drawLine(28.65,28.5,6,"rgba(204,0,0,1)");
	drawLine(28.5,23.2,7,"rgba(204,0,0,1)");//3 means the third value
	drawLine(23.2,18.5,8,"rgba(204,0,0,0.6)");
	drawLine(18.5,10,9,"rgba(204,0,0,0.6)");
	drawLine(10,2,10,"rgba(204,0,0,0.6)");
	drawLine(2,-8,11,"rgba(204,0,0,0.6)");
});

//Author: Hao Hu, Boston University
