function BlockList() {
	this.blockListEl = $("#blocksList");
}

BlockList.prototype = {
	addBlock: function (blockInfo) {
		$.get("/static/partials/admin/blockItem_list.html", $.proxy(function (template) {

			var blockDOM = $(Mustache.render(template, blockInfo));
			blockDOM.draggable({ helper: "clone" })
			        .data("blockInfo", blockInfo);
			this.blockListEl.append(blockDOM);

			// so when we drag the drag helper has the same with
			blockDOM.width(blockDOM.width())

		}, this));
	}
};

(function init() {
	var blockList = new BlockList();

	$.ajax({
		url: "/api/v1/getBlocks",
		dataType: "json",
		success: function (blocks) {
			for (var f = 0; f < blocks.length; f++) {
				blockList.addBlock({name: blocks[f]});
			}
		}
	});

})();
