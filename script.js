(function($, window, document, undefined) {
	"use strict";

	const pluginName = "glitchImage";

	const defaults = {
		imageUrl: null,
		frequency: 50
	};

	const controls = {
		play: function(id) {
			Plugin.prototype.play(id);
		},
		pause: function(id) {
			Plugin.prototype.pause(id);
		},
		destroy: function() {
			console.log(Plugin.prototype);
		}
	};

	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	$.extend(Plugin.prototype, {
		init: function() {
			this.$element = $(this.element);
			this.glitchId = parseInt(this.$element.data("glitch-id"));

			if (!this.glitchId) {
				this.glitchId = 0;
			}
			if (!this.settings.width) {
				this.settings.width = this.$element.width();
			}
			if (!this.settings.height) {
				this.settings.height = this.$element.height();
			}

			this.canvas = document.createElement("canvas");
			this.canvas.width = this.settings.width;
			this.canvas.height = this.settings.height;
			//append the canvas to the selected el
			this.$element.append(this.canvas);
			this.context = this.canvas.getContext("2d");

			if (!Array.isArray($.fn[pluginName].paused)) {
				$.fn[pluginName].paused = [];
			}
			if (this.settings.imageUrl === null) {
				this.backgroundImageUrl = this.$element
					.css("background-image")
					.slice(5, -2);
			} else {
				this.backgroundImageUrl = settings.imageUrl;
			}
			this.img = new Image();
			this.img.src = this.backgroundImageUrl;
			this.img.width = this.settings.width;
			this.img.height = this.settings.height;
			this.draw();
		},
		getRandInt: function(a, b) {
			return ~~(Math.random() * (b - a) + a);
		},
		draw: function() {
			let _this = this;
			this.glitchInterval = setInterval(function() {
				if ($.fn[pluginName].paused.indexOf(_this.glitchId) === -1) {
					setTimeout(function() {
						for (var i = 0; i < _this.getRandInt(1, 13); i++) {
							let x = Math.random() * _this.settings.width,
								y = Math.random() * _this.settings.height,
								spliceWidth = _this.settings.width - x,
								spliceHeight = _this.getRandInt(5, _this.settings.height / 3);
							_this.context.drawImage(
								_this.img,
								0,
								y,
								spliceWidth,
								spliceHeight,
								x,
								y,
								spliceWidth,
								spliceHeight
							);
							_this.context.drawImage(
								_this.img,
								spliceWidth,
								y,
								x,
								spliceHeight,
								0,
								y,
								x,
								spliceHeight
							);
						}
					}, _this.getRandInt(250, 1000));
				}
			}, _this.settings.frequency);
		},
		clear: function() {
			this.context.clearRect(0, 0, settings.width, settings.height);
		},
		play: function(id) {
			let indexOfPaused = $.fn[pluginName].paused.indexOf(id);
			if (indexOfPaused >= 0) {
				$.fn[pluginName].paused.splice(indexOfPaused, 1);
			}
		},
		pause: function(id) {
			if ($.fn[pluginName].paused.length === 0) {
				$.fn[pluginName].paused = [id];
			} else {
				if ($.fn[pluginName].paused.indexOf(id) === -1) {
					$.fn[pluginName].paused.push(id);
				}
			}
		},
		stop: function() {},
		destroy: function() {}
	});

	$.fn[pluginName] = function(options) {
		if (typeof arguments[0] === "string") {
			let args = [$(this).data("glitch-id")];
			controls[arguments[0]].apply(this, args);
			return this;
		} else {
			return this.each(function() {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin(this, options));
				}
			});
		}
	};
})(jQuery, window, document);

$(document).ready(function() {
	const glitch1 = $(".js-gliched-img-1").glitchImage();
	const glitch2 = $(".js-gliched-img-2").glitchImage();
	const glitchImg1 = $(".js-gliched-img-1");
	const glitchImg2 = $(".js-gliched-img-2");
	const canvas = $("canvas");
	const text = $(".js-text");
	const replayBtn = $(".js-play");
	const lineThrough = $(".line-through");
	glitch1.glitchImage("pause");
	glitch2.glitchImage("pause");

	TweenMax.set([glitchImg1, glitchImg2, text], {
		autoAlpha: 0
	});

	tl = new TimelineMax({
		delay: 0.5
	});

	tl
		.set([glitchImg1, glitchImg2, text], {
			autoAlpha: 0
		})
		.set(glitchImg1, {
			autoAlpha: 1,
			onComplete: () => {
				glitch1.glitchImage("play");
			}
		})
		.to(
			glitchImg1,
			0.01,
			{
				autoAlpha: 0
			},
			"+=1"
		)
		.to(
			glitchImg2,
			0.01,
			{
				autoAlpha: 1,
				onComplete: () => {
					glitch2.glitchImage("play");
				}
			},
			"-=0.5"
		)
		.set(
			canvas,
			{
				autoAlpha: 0
			},
			"+=1"
		)
		.to(glitchImg2, 1.2, {
			scale: 1.02
		})
		.to(glitchImg2, 0.2, {
			autoAlpha: 0
		})
		.set(
			[glitchImg2, glitchImg1],
			{
				autoAlpha: 0
			},
			"+=0.1"
		)
		.set(text, {
			autoAlpha: 1,
			onComplete: () => {
				lineThrough.addClass("go");
			}
		});

	replayBtn.on("click", function() {
		tl.restart();
		lineThrough.removeClass("go");
	});
});