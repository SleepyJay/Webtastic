
Application = {
	Classes: {},
	Dragging: undefined,

	load: function(e) {
		console.log("LOaDED");
		this.bigbox = document.getElementById('bigbox');
		this.blank = document.getElementById('blank');

		this.greeny = new this.Classes.DragBox();
		this.yellow = new this.Classes.DragBox('yellow');
	},
};

Application.Dragging = new (class Dragging {
	dragStart(ev) {
		let box_width = parseInt(ev.target.offsetWidth/2) + "px";
		let box_height = parseInt(ev.target.offsetHeight/2) + "px";

		ev.dataTransfer.effectAllowed = 'move';
		ev.dataTransfer.setDragImage(Application.blank, box_width, box_height);
	}

	dragEnd(ev) { /* EMPTY */ }

	drag(ev) {
		let dragbox = ev.target;
		let posX = (ev.x - Application.bigbox.offsetWidth/2);
		let posY = (ev.y - dragbox.offsetHeight/2);
		let pos = this.correctForCollisions(dragbox, posX, posY);

		dragbox.Object.setPostition(pos.posX, pos.posY, pos.locX, pos.locY);
	}

	correctForCollisions(dragbox, posX, posY) {
		let bigbox = Application.bigbox;
		let cor = {};

		// allow overlapping borders
		if(posX <= dragbox.Object.minX) {
			cor.posX = dragbox.Object.minX;
		}
		else if(posX >= dragbox.Object.maxX) {
			cor.posX = dragbox.Object.maxX;
		}
		else {
			cor.posX = posX;
		}

		if(posY <= dragbox.Object.minY) {
			cor.posY = dragbox.Object.minY;
		}
		else if(posY >= dragbox.Object.maxY) {
			cor.posY = dragbox.Object.maxY;
		}
		else {
			cor.posY = posY;
		}

		cor.locX = cor.posX - bigbox.offsetWidth/2 + dragbox.offsetWidth/2;
		cor.locY = cor.posY - bigbox.offsetHeight/2 + dragbox.offsetHeight/2;

		return cor;
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
		let bigbox = Application.bigbox;

		let el = document.createElement("SPAN");
		el.className = 'dragbox';
		el.setAttribute("draggable", "true");
		el.setAttribute("ondragstart", "Application.Dragging.dragStart(event)");
		el.setAttribute("ondrag", "Application.Dragging.drag(event)");
		el.setAttribute("ondragend", "Application.Dragging.dragEnd(event)");
		el.style.backgroundColor = color;

		bigbox.appendChild(el);
		this.element = el;

		let go_left = bigbox.offsetWidth/2 - el.offsetWidth/2;
		let go_top  = bigbox.offsetHeight/2 - el.offsetHeight/2;

		let compStyle = getComputedStyle(el);
		this.border_size = parseInt(compStyle.borderWidth);

		this.setPostition(go_left, go_top, 0, 0);
		this.setMinMax();

		el.Object = this;
		return this.element;
	}

	setPostition(px, py, lx=px, ly=py) {
		this.element.style.left = px +'px';
		this.element.style.top = py +'px';
		this.element.innerHTML = lx + ", " + ly;
	}

	setMinMax() {
		this.minX =  -this.border_size;
		this.maxX =  Application.bigbox.offsetWidth  - this.element.offsetWidth - this.border_size;

		this.minY = -this.border_size;
		this.maxY =  Application.bigbox.offsetHeight - this.element.offsetHeight - this.border_size;



		// if(posX <= -borderSize) {
		// 	cor.posX = -borderSize;
		// }
		// else if(posX >= bigbox.offsetWidth - dragbox.offsetWidth - borderSize) {
		// 	cor.posX = bigbox.offsetWidth - dragbox.offsetWidth - borderSize;
		// }
		// else {
		// 	cor.posX = posX;
		// }

		// if(posY <= -borderSize) {
		// 	cor.posY = -borderSize;
		// }
		// else if(posY >= bigbox.offsetHeight - dragbox.offsetHeight - borderSize) {
		// 	cor.posY = bigbox.offsetHeight - dragbox.offsetHeight - borderSize;
		// }
		// else {
		// 	cor.posY = posY;
		// }
	}
}

addEventListener('load', Application.load());

