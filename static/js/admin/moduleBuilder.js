function BuildArea() {
	paper.install(window);
	this.buildAreaEl = $("#buildArea");
	this.canvas = document.getElementById("canvas");
	paper.setup(this.canvas);
	this.buildAreaEl.droppable({
		drop: $.proxy(function (event, ui) {
			var blockInfo = $(ui.draggable).data("blockInfo");
			if (blockInfo) {
				this.addBlock(blockInfo, ui.position);
			}
		}, this)
	});
}

BuildArea.prototype = {

	addLine: function (start, end) {
		var path = new Path();
		path.strokeColor = '#3b8bbe';
		path.strokeWidth = 3;
		var start = new Segment(new Point(start), null, new Point(0, 100));
		var end = new Segment(new Point(end), new Point(0, -100), null);
		path.add(start, end);
		// path.fullySelected = true;
		this.draw();
	},

	addBlock: function (blockInfo, position) {
		$.get("/static/partials/admin/blockItem_list.html", $.proxy(function (template) {

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
buildArea.addLine([50,50], [100, 100]);
buildArea.addLine([125,50], [200, 200]);
window.addEventListener('resize', $.proxy(buildArea.resizeCanvas, buildArea), false);
