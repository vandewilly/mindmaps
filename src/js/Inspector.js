/**
 * Creates a new InspectorView.
 * 
 * @constructor
 */
mindmaps.InspectorView = function() {
	var self = this;
	var $content = $("#template-inspector").tmpl();
	var $sizeDecreaseButton = $("#inspector-button-font-size-decrease",
			$content);
	var $sizeIncreaseButton = $("#inspector-button-font-size-increase",
			$content);
	var $boldCheckbox = $("#inspector-checkbox-font-bold", $content);
	var $italicCheckbox = $("#inspector-checkbox-font-italic", $content);
	var $underlineCheckbox = $("#inspector-checkbox-font-underline", $content);
	var $applyToAllButton = $("#inspector-button-apply-all", $content);
	var branchColorPicker = $("#inspector-branch-color-picker", $content);
	var fontColorPicker = $("#inspector-font-color-picker", $content);
	var $allButtons = [ $sizeDecreaseButton, $sizeIncreaseButton,
			$boldCheckbox, $italicCheckbox, $underlineCheckbox,
			$applyToAllButton ];
	var $allColorpickers = [ branchColorPicker, fontColorPicker ];

	/**
	 * Returns a jquery object.
	 * 
	 * @returns {jQuery}
	 */
	this.getContent = function() {
		return $content;
	};

	/**
	 * Sets the enabled state of all controls.
	 * 
	 * @param {Boolean} enabled
	 */
	this.setControlsEnabled = function(enabled) {
		var state = enabled ? "enable" : "disable";
		$allButtons.forEach(function($button) {
			$button.button(state);
		});

		$allColorpickers.forEach(function($colorpicker) {
			$colorpicker.miniColors("disabled", !enabled);
		});
	};

	/**
	 * Sets the checked state of the bold font option.
	 * 
	 * @param {Boolean} checked
	 */
	this.setBoldCheckboxState = function(checked) {
		$boldCheckbox.prop("checked", checked).button("refresh");
	};

	/**
	 * Sets the checked state of the italic font option.
	 * 
	 * @param {Boolean} checked
	 */
	this.setItalicCheckboxState = function(checked) {
		$italicCheckbox.prop("checked", checked).button("refresh");
	};

	/**
	 * Sets the checked state of the underline font option.
	 * 
	 * @param {Boolean} checked
	 */
	this.setUnderlineCheckboxState = function(checked) {
		$underlineCheckbox.prop("checked", checked).button("refresh");
	};

	/**
	 * Sets the color of the branch color picker.
	 * 
	 * @param {String} color
	 */
	this.setBranchColorPickerColor = function(color) {
		branchColorPicker.miniColors("value", color);
	};

	/**
	 * Sets the color of the font color picker.
	 * 
	 * @param {String} color
	 */
	this.setFontColorPickerColor = function(color) {
		fontColorPicker.miniColors("value", color);
	};

	/**
	 * Initialise
	 */
	this.init = function() {
		$(".buttonset", $content).buttonset();
		$applyToAllButton.button();

		$sizeDecreaseButton.click(function() {
			if (self.fontSizeDecreaseButtonClicked) {
				self.fontSizeDecreaseButtonClicked();
			}
		});

		$sizeIncreaseButton.click(function() {
			if (self.fontSizeIncreaseButtonClicked) {
				self.fontSizeIncreaseButtonClicked();
			}
		});

		$boldCheckbox.click(function() {
			if (self.fontBoldCheckboxClicked) {
				var checked = $(this).prop("checked");
				self.fontBoldCheckboxClicked(checked);
			}
		});

		$italicCheckbox.click(function() {
			if (self.fontItalicCheckboxClicked) {
				var checked = $(this).prop("checked");
				self.fontItalicCheckboxClicked(checked);
			}
		});

		$underlineCheckbox.click(function() {
			if (self.fontUnderlineCheckboxClicked) {
				var checked = $(this).prop("checked");
				self.fontUnderlineCheckboxClicked(checked);
			}
		});

		branchColorPicker.miniColors({
			hide : function(hex) {
				// dont emit event if picker was hidden due to disable
				if (this.attr('disabled')) {
					return;
				}

				console.log("branch", hex);
				if (self.branchColorPicked) {
					self.branchColorPicked(hex);
				}
			}
		});

		fontColorPicker.miniColors({
			hide : function(hex) {
				// dont emit event if picker was hidden due to disable
				if (this.attr('disabled')) {
					return;
				}
				console.log("font", hex);
				if (self.fontColorPicked) {
					self.fontColorPicked(hex);
				}
			}
		});

		$applyToAllButton.click(function() {
			if (self.applyStylesToChildrenButtonClicked) {
				self.applyStylesToChildrenButtonClicked();
			}
		});
	};
};

/**
 * Creates a new InspectorPresenter. This presenter manages basic node
 * attributes like font settings and branch color.
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.MindMapModel} mindmapModel
 * @param {mindmaps.InspectorView} view
 */
mindmaps.InspectorPresenter = function(eventBus, mindmapModel, view) {
	var self = this;

	/**
	 * View callbacks: React to user input and execute appropiate action.
	 */

	view.fontSizeDecreaseButtonClicked = function() {
		var action = new mindmaps.action.DecreaseNodeFontSizeAction(
				mindmapModel.selectedNode);
		mindmapModel.executeAction(action);
	};

	view.fontSizeIncreaseButtonClicked = function() {
		var action = new mindmaps.action.IncreaseNodeFontSizeAction(
				mindmapModel.selectedNode);
		mindmapModel.executeAction(action);
	};

	view.fontBoldCheckboxClicked = function(checked) {
		var action = new mindmaps.action.SetFontWeightAction(
				mindmapModel.selectedNode, checked);
		mindmapModel.executeAction(action);
	};

	view.fontItalicCheckboxClicked = function(checked) {
		var action = new mindmaps.action.SetFontStyleAction(
				mindmapModel.selectedNode, checked);
		mindmapModel.executeAction(action);
	};

	view.fontUnderlineCheckboxClicked = function(checked) {
		var action = new mindmaps.action.SetFontDecorationAction(
				mindmapModel.selectedNode, checked);
		mindmapModel.executeAction(action);
	};

	view.branchColorPicked = function(color) {
		var action = new mindmaps.action.SetBranchColorAction(
				mindmapModel.selectedNode, color);
		mindmapModel.executeAction(action);
	};

	view.fontColorPicked = function(color) {
		var action = new mindmaps.action.SetFontColorAction(
				mindmapModel.selectedNode, color);
		mindmapModel.executeAction(action);
	};

	/**
	 * Update view on font events.
	 */
	eventBus.subscribe(mindmaps.Event.NODE_FONT_CHANGED, function(node) {
		if (mindmapModel.selectedNode === node) {
			updateView(node);
		}
	});

	eventBus.subscribe(mindmaps.Event.NODE_BRANCH_COLOR_CHANGED,
			function(node) {
				if (mindmapModel.selectedNode === node) {
					updateView(node);
				}
			});

	eventBus.subscribe(mindmaps.Event.NODE_SELECTED, function(node) {
		updateView(node);
	});

	/**
	 * Enable controls when a document has been opened.
	 */
	eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
		view.setControlsEnabled(true);
	});

	/**
	 * Disable controls when document was closed.
	 */
	eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
		view.setControlsEnabled(false);
	});

	/**
	 * Sets the view params to match the node's attributes.
	 * 
	 * @param {mindmaps.Node} node
	 */
	function updateView(node) {
		var font = node.text.font;
		view.setBoldCheckboxState(font.weight === "bold");
		view.setItalicCheckboxState(font.style === "italic");
		view.setUnderlineCheckboxState(font.decoration === "underline");
		view.setFontColorPickerColor(font.color);
		view.setBranchColorPickerColor(node.branchColor);
	}

	this.go = function() {
		view.init();
	};
};