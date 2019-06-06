
Application = {
	Classes: {},
	Dragging: undefined,
	dragboxes: [],

	load: function(e) {
		console.log("LOaDED");
		this.bigbox = document.getElementById('bigbox');
		this.blank = document.getElementById('blank');

		this.greeny = new this.Classes.DragBox();
		this.yellow = new this.Classes.DragBox('yellow');

		this.dragboxes = [this.greeny, this.yellow];
	},
};

Application.Dragging = new (class Dragging {
	dragStart(ev) {
		ev.dataTransfer.effectAllowed = 'move';
		ev.dataTransfer.setDragImage(Application.blank, 0, 0);
	}

	dragEnd(ev) { /* EMPTY */ }

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
	constructor(color="green") {
		let el = document.createElement("SPAN");
		el.className = 'dragbox';
		el.setAttribute("draggable", "true");
		el.setAttribute("ondragstart", "Application.Dragging.dragStart(event)");
		el.setAttribute("ondrag", "Application.Dragging.drag(event)");
		el.setAttribute("ondragend", "Application.Dragging.dragEnd(event)");
		el.style.backgroundColor = color;

		Application.bigbox.appendChild(el);
		this.element = el;
		this.border_size = parseInt(getComputedStyle(el).borderWidth);
		this.setPostition(this.middleX(), this.middleY());
		this.setMinMax();

		el.Object = this;
		return this.element;
	}

	setPostition(px, py) {

		let cor = this.correctForCollisions(px, py);

		let lx = px; // -this.middleX();
		let ly = py; // -this.middleY();
		this.element.style.left = cor.x +'px';
		this.element.style.top = cor.y +'px';
		this.element.innerHTML = lx + ", " + ly;

		this.left = cor.x - this.element.offsetWidth/2;
		this.right = cor.x + this.element.offsetWidth/2;
		this.top = cor.y - this.element.offsetHeight/2;
		this.bottom = cor.y + this.element.offsetHeight/2;
	}

	resolveMove(ev) {
		let dragbox = ev.target;
		let posX = (ev.x - dragbox.Object.middleX());
		let posY = (ev.y - dragbox.offsetHeight/2);

		dragbox.Object.setPostition(posX, posY);
	}

	setMinMax() {
		// allow overlapping borders
		this.minX =  -this.border_size;
		this.maxX =  Application.bigbox.offsetWidth  - this.element.offsetWidth - this.border_size;

		this.minY = -this.border_size;
		this.maxY =  Application.bigbox.offsetHeight - this.element.offsetHeight - this.border_size;
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

	middleX() {
		return Application.bigbox.offsetWidth/2 - this.element.offsetWidth/2;
	}

	middleY() {
		return Application.bigbox.offsetHeight/2 - this.element.offsetHeight/2;
	}

	boxMiddleX() {
		return this.left + this.element.offsetWidth/2;
	}

	boxMiddleY() {
		return this.top + this.element.offsetHeight/2;
	}

	// ideally, whatever "better" way of handing these can also handle big-box boundaries, too
	correctForCollisions(posX, posY) {
		let center = {
			x: posX,
			y: posY,
		};

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
}

addEventListener('load', Application.load());

