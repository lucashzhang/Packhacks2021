function drawCheck() {
	$(".email-verification-notification").css({"transform" : "translateY(-50%)", "opacity" : "1", "display" : "block"});
	$(".signup-container").css("opacity", 0);

	var start = 100;
	var mid = 145;
	var end = 250;
	var width = 22;
	var leftX = start;
	var leftY = start;
	var rightX = mid + 2;
	var rightY = mid - 3;
	var animationSpeed = 10;

	var ctx = document.getElementById('check-canvas').getContext('2d');
	ctx.lineWidth = width;
	ctx.strokeStyle = 'rgba(150, 150, 150, 1)';

	for (i = start; i < mid; i++) {
	    var drawLeft = window.setTimeout(function () {
	        ctx.beginPath();
	        ctx.moveTo(start, start);
	        ctx.lineTo(leftX, leftY);
	        ctx.lineCap = 'round';
	        ctx.stroke();
	        leftX++;
	        leftY++;
	    }, 1 + (i * animationSpeed) / 3);
	}

	for (i = mid; i < end; i++) {
	    var drawRight = window.setTimeout(function () {
	        ctx.beginPath();
	        ctx.moveTo(leftX + 2, leftY - 3);
	        ctx.lineTo(rightX, rightY);
	        ctx.stroke();
	        rightX++;
	        rightY--;
	    }, 1 + (i * animationSpeed) / 3);
	}
}
