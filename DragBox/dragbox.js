
Application = {
	Classes: {},
	Dragging: undefined,
	dragboxes: [],

	load: function(e) {
		console.log("LOaDED");
		this.bigbox = document.getElementById('bigbox');
		this.blank = document.getElementById('blank');

		this.middleX = this.bigbox.offsetWidth/2;
		this.middleY = this.bigbox.offsetHeight/2;

		this.greeny = new this.Classes.DragBox();
		this.yellow = new this.Classes.DragBox(this.middleX, this.middleY, 'yellow');

		this.dragboxes = [this.greeny, this.yellow];
	},
};

Application.Dragging = new (class Dragging {
	dragStart(ev) {
		ev.dataTransfer.effectAllowed = 'move';
		ev.dataTransfer.setDragImage(Application.blank, 0, 0);
		ev.target.Object.startX = ev.clientX;
		ev.target.Object.startY = ev.clientY;
	}

	dragEnd(ev) {
		ev.target.Object.finalizeMove(ev);
	}

	drag(ev) {
		ev.target.Object.resolveMove(ev);
	}

	dragOver(ev) {
		ev.preventDefault();
		return true;
	}


	dragDrop(ev) {
		ev.stopPropagation();
		return false;
	}
})();

Application.Classes.DragBox = class DragBox {
	constructor(posX=0, posY=0, color="green", ) {
		let el = document.createElement("SPAN");
		el.className = 'dragbox';
		el.setAttribute("draggable", "true");
		el.setAttribute("ondragstart", "Application.Dragging.dragStart(event)");
		el.setAttribute("ondrag", "Application.Dragging.drag(event)");
		el.setAttribute("ondragend", "Application.Dragging.dragEnd(event)");
		el.style.backgroundColor = color;

		Application.bigbox.appendChild(el);
		this.element = el;
		this.border_LR = parseInt(getComputedStyle(el).borderWidth);
		this.border_TB = parseInt(getComputedStyle(el).borderWidth);

		this.offsetX = this.element.offsetWidth/2;
		this.offsetY = this.element.offsetHeight/2;
		this.bigboxOffsetX = Application.bigbox.offsetWidth/2 - this.offsetX*2;


		let cor = this.correctForCollisions(posX -  this.offsetX, posY - this.offsetY);
		this.setPostition(cor.left, cor.top);
		this.left = cor.left;
		this.top = cor.top;
		this.setMinMax();

		el.Object = this;
		return this.element;
	}

	// Put box to this (left,top) position; make corrections before passing here
	setPostition(left, top) {
		let lx = left; // -this.middleX();
		let ly = top; // -this.middleY();
		this.element.style.left = left +'px';
		this.element.style.top = top +'px';
		this.element.innerHTML = lx + ", " + ly;
	}

	finalizeMove(ev) {
		this.left   += (ev.clientX - this.startX);
		this.right  += this.element.offsetWidth;
		this.top    += (ev.clientY - this.startY);
		this.bottom += this.element.offsetHeight;
		console.log([this.left, this.right, this.top, this.bottom])
	}

	resolveMove(ev) {
		let newLeft = this.left + ev.clientX - this.startX;
		let newTop  = this.top + ev.clientY - this.startY;
		let cor = this.correctForCollisions(newLeft, newTop);
		this.setPostition(cor.left, cor.top);
	}

	setMinMax() {
		// allow overlapping borders
		this.minX =  -this.border_size;
		this.maxX =  Application.bigbox.offsetWidth  - this.element.offsetWidth - this.border_LR;

		this.minY = -this.border_size;
		this.maxY =  Application.bigbox.offsetHeight - this.element.offsetHeight - this.border_TB;
	}

	// ideally, whatever "better" way of handing these can also handle big-box boundaries, too
	correctForCollisions(posX, posY) {
		let center = {
			left: posX  ,
			top: posY ,
		};
		return center;

		if(posX <= this.minX) {
			center.x = this.minX;
		}
		else if(posX >= this.maxX) {
			center.x = this.maxX;
		}

		if(posY <= this.minY) {
			center.y = this.minY;
		}
		else if(posY >= this.maxY) {
			center.y = this.maxY;
		}

		center = this.checkAgainstOtherBoxes(center);

		return center;
	}

	checkAgainstOtherBoxes(center) {
		Application.dragboxes.forEach(function(dragbox){
			if (dragbox.Object !== this) {
				let other = dragbox.Object;
				let collide_right = false;
				let collide_top = true;

				if(collide_top && this.right >= other.left && this.left <= other.right ) {
					if(this.top <= other.bottom && this.bottom >= other.boxMiddleY()) {
						// console.log("south");
						center.y = this.top + this.element.offsetHeight/2;
					}
					else if(this.bottom >= other.top && this.top <= other.boxMiddleY()) {
						// console.log("north");
						center.y = this.top + this.element.offsetHeight/2;
					}
				}

				if(collide_right && this.bottom >= other.top && this.top <= other.bottom ) {
					if(this.right >= other.left && this.right <= other.boxMiddleX()) {
						// console.log("west");
						center.x = this.left + this.element.offsetWidth/2;
					}
					else if(this.left <= other.right && this.left >= other.boxMiddleX()) {
						// console.log("east");
						center.x = this.left + this.element.offsetWidth/2;
					}
				}



				// // if(this.right >= other.left && this.right <= other.boxMiddleX()) {
				// 	if(this.bottom >= other.top && this.bottom <= other.boxMiddleY()) {
				// 		center.y = this.bottom - this.element.offsetHeight;
				// 	}
				// 	else if(this.top <= other.bottom && this.top >= other.boxMiddleY()) {
				// 		center.y = this.top + this.element.offsetHeight;
				// 	}
				// // }




					// this.left <= other.right &&

				   // ) {

				// }
			}
		}.bind(this));

		return center;
	}

	getSideLocations() {
		return {
			left:   this.left,
			top:    this.top,
			right:  this.right,
			bottom: this.bottom,
		};

		// let corners = [
		// 	{x: 0, y: 0},
		// 	{x: 0, y: 0},
		// 	{x: 0, y: 0},
		// 	{x: 0, y: 0},
		// ];




	}

	boxMiddleX() {
		return this.left + this.element.offsetWidth/2;
	}

	boxMiddleY() {
		return this.top + this.element.offsetHeight/2;
	}
}

addEventListener('load', Application.load());

