function BuildArea() {
	this.buildAreaEl = $("#buildArea");
	this.canvas = document.getElementById("canvas");

	paper.install(window);
	paper.setup(this.canvas);

	this.buildAreaEl.droppable({
		drop: $.proxy(function (event, ui) {
			var blockInfo = $(ui.draggable).data("blockInfo");
			if (blockInfo) {
				this.addBlock(blockInfo, ui.position);
			}
		}, this)
	});

	$(document).on("click", ".outputs .ioport", $.proxy(function (event) {
		var buildAreaPosition = this.buildAreaEl.offset();
		var portPosition = $(event.target).offset();

		var startXPosition = portPosition.left - buildAreaPosition.left + 3;
		var startYPosition = portPosition.top - buildAreaPosition.top + 3;

		this.startLine(startXPosition, startYPosition);

	}, this));
}

BuildArea.prototype = {


	addLine: function (startx, starty, endx, endy) {
		var path = new Path();
		path.strokeColor = '#fff';
		path.strokeWidth = 1;
		var start = new Segment(new Point([startx, starty]), null, new Point(0, 100));
		var end = new Segment(new Point([endx, endy]), new Point(0, -100), null);
		path.add(start, end);
		// path.fullySelected = true;
		this.draw();
		return path;
	},

	startLine: function (x, y) {
		var path = this.addLine(x, y, x, y);
		var tool = new Tool();

		tool.onMouseMove = $.proxy(function (event) {
			path.segments[1].point = event.point;
			this.draw();
		}, this);
	},

	addBlock: function (blockInfo, position) {
		$.get("/static/partials/admin/blockItem_builder.html", $.proxy(function (template) {

			var blockDOM = $(Mustache.render(template, blockInfo));
			blockDOM.draggable({
				containment: "parent"
			});

			blockDOM.css({
				"position": "absolute",
				"left": position.left,
				"top": position.top,
			});

			this.buildAreaEl.append(blockDOM);

		}, this));

	},

	draw: function () {
		view.draw();
	},

	resizeCanvas: function () {
		view.setViewSize(this.buildAreaEl.width(), this.buildAreaEl.height());
	}
}

var buildArea = new BuildArea();

buildArea.resizeCanvas();
window.addEventListener('resize', $.proxy(buildArea.resizeCanvas, buildArea), false);
