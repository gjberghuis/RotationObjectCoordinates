var ctx = null;

var gameArea = (function() {

    var interval;

    var initInterval = function() {
        interval = setInterval(updateGameArea, 20);
    }

    var updateGameArea = function() {
        canvas.update();
    }

    return {
        init: function() {		
            canvas.init();
            initInterval();
        }
    };
}());

var canvas = (function() {
	var ctx;
    var canvasObject;
    var angle = 0;

	var init = function() {
        canvasObject = document.getElementById("rotation");
        canvasObject.width = 400;
        canvasObject.height = 400;
        ctx = canvasObject.getContext('2d');

		drawRect();
	}

	var drawRect = function () {
        ctx.clearRect(0, 0, canvasObject.width,canvasObject.height);
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, canvasObject.width, canvasObject.height);
        ctx.fillStyle = '#f00';
        ctx.strokeStyle = '#aaa';

        /// variables
        var rectWidth = 100;
        var rectHeight = 200;
        // translate to pivot points
        var x = (canvasObject.width / 2) - (rectWidth / 2);
        var y = (canvasObject.height / 2) - (rectHeight / 2);
        rect = [ x, y, rectWidth, rectHeight];
        var mx = canvasObject.width * 0.5,      /// middle of canvas
            my = canvasObject.height * 0.5,
            ar = angle * Math.PI / 180, /// angle in radians
            
            /// for our calculations
            x, y, dist, diffX, diffY, ca, na;

        /// draw the rotated rectangle using translation
        ctx.translate(mx, my);
        ctx.rotate(ar);
        ctx.strokeRect(rect[0] - mx, rect[1] - my, rect[2], rect[3]);
        ctx.fillStyle = "orange";
        ctx.fillRect(rect[0] - mx, rect[1] - my, rect[2], rect[3]);
        ctx.fillStyle = "red";
        ctx.fillRect(rect[0] - mx, rect[1] - my, rect[2], rect[3] * 0.3);
        ctx.fillStyle = "yellow";
        ctx.fillText("FRONT", rect[0] - mx + (rect[2] * 0.3), rect[1] - my + (rect[3] * 0.3 / 2))
        ctx.rotate(-ar);
        ctx.translate(-mx, -my);
        ctx.fillStyle = "yellow";
        /// find distance from pivot to corner with pythagoras
        //      * \
        //      |   \
        //      |     \   C
        //   A  |       \
        //      |         \
        //      |___________\ *
        //           B   
        //
        //
        //  The corner in the top left (top left of the rectangle) and the pivot point in the bottom right (this is in the center of the rectangle)
        //  Squareroot of (A * A + B * B) is the longest side (C) of the triangle

        sideA = rectHeight / 2;
        sideB = rectWidth / 2;
        sideC = Math.sqrt(sideA * sideA + sideB * sideB);
        console.log ('Side a: ' + sideA);
        console.log ('Side b: ' + sideB);
        console.log ('Side c: ' + sideC);

        /// find angle from pivot to corner
        // calculate the angle from the pivot to the corner, we know the aanliggende zijde en de overstaande zijde so we need to do a tan calculation
        ca = Math.atan2(sideA, sideB) * 180 / Math.PI;
    
        console.log('Angle current: ' + Math.atan2(sideB, sideA)); 

        /// get new angle based on old + current delta angle
        na = ((ca + angle) % 360) * Math.PI / 180;

        document.getElementById("currentAngle").innerHTML = angle;
        /// get new x and y and round it off to integer
        x = (mx - sideC * Math.cos(na) + 0.5)|0;
        y = (my - sideC * Math.sin(na) + 0.5)|0;

        /// draw dots at the calculated points 
        /// it's correct and synced to internal rotation
        document.getElementById("infoLeftTop").innerHTML = 'X =' + (x) + ' Y = ' + (y);
        
        ctx.fillText("   x: " + x + " y: " + y,x,y)
        ctx.beginPath();
        ctx.moveTo(x, y);   /// corner
        ctx.lineTo(mx, my); /// pivot
        ctx.stroke();
        ctx.fillRect(x - 2.5, y - 2.5, 5, 5);

        rtca = 180 - ca; 

        rtna = ((rtca + angle) % 360) * Math.PI / 180;
        x = (mx - sideC * Math.cos(rtna) + 0.5)|0;
        y = (my - sideC * Math.sin(rtna) + 0.5)|0;

        document.getElementById("infoRightTop").innerHTML = 'X =' + (x) + ' Y = ' + (y);
        
        ctx.fillText("   x: " + x + " y: " + y,x,y)
        ctx.beginPath();
        ctx.moveTo(x, y);   /// corner
        ctx.lineTo(mx, my); /// pivot
        ctx.stroke();
        ctx.fillRect(x - 2.5, y - 2.5, 5, 5);

        lbta = 180 + ca; 

        lbna = ((lbta + angle) % 360) * Math.PI / 180;
        x = (mx - sideC * Math.cos(lbna) + 0.5)|0;
        y = (my - sideC * Math.sin(lbna) + 0.5)|0;

        document.getElementById("infoLeftBottom").innerHTML = 'X =' + (x) + ' Y = ' + (y);

        ctx.fillText("   x: " + x + " y: " + y,x,y)
        ctx.beginPath();
        ctx.moveTo(x, y);   /// corner
        ctx.lineTo(mx, my); /// pivot
        ctx.stroke();
        ctx.fillRect(x - 2.5, y - 2.5, 5, 5);

        rbca = 360 - ca; 

        rbna = ((rbca + angle) % 360) * Math.PI / 180;    
        x = (mx - sideC * Math.cos(rbna) + 0.5)|0;
        y = (my - sideC * Math.sin(rbna) + 0.5)|0;

        document.getElementById("infoRightBottom").innerHTML = 'X =' + (x) + ' Y = ' + (y);

        ctx.fillText("   x: " + x + " y: " + y,x,y)
        ctx.beginPath();
        ctx.moveTo(x, y );   /// corner
        ctx.lineTo(mx, my); /// pivot
        ctx.stroke();
        ctx.fillRect(x - 2.5, y - 2.5, 5, 5);   
    }

    var updateDirection = function() {
		/*
		* 37 = left
		* 38 = up
		* 39 = right
		* 40 = down
		*/

		// Left
		if (gameArea.keys && gameArea.keys[37]) { 
			// and backward
			if(gameArea.keys && gameArea.keys[40]) {
				angle += 2;
			} else {
				angle -= 2;
			}
		}

		// Right
		if (gameArea.keys && gameArea.keys[39]) {
			// and backward
			if(gameArea.keys && gameArea.keys[40]) {
				angle -= 2;
			} else {
				angle += 2;
			}
		}
	};	

    var update = function() {
		drawRect();
	};

	return {
        init: function() {
			init();
		},
		update: function() {
			updateDirection();
			update();
        }
	}
})();

var controls = (function(){
	var bindEvents = function() {
		window.addEventListener('keydown', function(event) {
			gameArea.keys = (gameArea.keys || []);
            gameArea.keys[event.keyCode] = true;
		});

		window.addEventListener('keyup', function(event) {
			gameArea.keys[event.keyCode] = false;
		});
	}

	return {
		init: function() {
			bindEvents();
		}
	}
})();


$(function() {
    gameArea.init();
    controls.init();
});