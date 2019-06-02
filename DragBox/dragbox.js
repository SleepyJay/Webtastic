
Application = {
	Classes: {},
	Dragging: undefined,

	greeny: undefined,

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

	dragEnd(ev) {
		// Empty
	}

	drag(ev) {
		let dragbox = ev.target;
		let posX = (ev.x - dragbox.offsetWidth/2);
		let posY = (ev.y - dragbox.offsetHeight/2);

		let cor = this.correctForCollisions(ev);
		posX = cor.posX || posX;
		posY = cor.posY || posY;
		let locX = cor.locX;
		let locY = cor.locY;

		dragbox.style.position = "absolute";
		dragbox.style.left = posX +'px';
		dragbox.style.top = posY +'px';
		dragbox.innerHTML = locX + ", " + locY;
	}

	correctForCollisions(ev) {
		let bigbox = Application.bigbox;
		let dragbox = ev.target;

		let cor = {};

		let offCenterPosX = ev.x - bigbox.offsetLeft - bigbox.offsetWidth/2;
		let offCenterPosY = ev.y - bigbox.offsetTop - bigbox.offsetHeight/2;

		if(offCenterPosX > dragbox.Object.maxX) {
			cor.posX = bigbox.offsetLeft + bigbox.offsetWidth - dragbox.offsetWidth;
			cor.locX = dragbox.Object.maxX;
		}
		else if(offCenterPosX < dragbox.Object.minX) {
			cor.posX = bigbox.offsetLeft;
			cor.locX = dragbox.Object.minX;
		}
		else {
			cor.locX = offCenterPosX;
		}

		if(offCenterPosY > dragbox.Object.maxY) {
			cor.posY = bigbox.offsetTop + bigbox.offsetHeight - dragbox.offsetHeight;
			cor.locY = dragbox.Object.maxY;
		}
		else if(offCenterPosY < dragbox.Object.minY) {
			cor.posY = bigbox.offsetTop;
			cor.locY = -dragbox.Object.maxY;
		}
		else {
			cor.locY = offCenterPosY;
		}

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

		let compStyle = getComputedStyle(el);


		el.style.left = bigbox.offsetLeft + bigbox.offsetWidth/2 - el.offsetWidth/2 + "px";
		el.style.top =  bigbox.offsetTop + bigbox.offsetHeight/2 - el.offsetHeight/2 + "px";
		// el.style.position = "relative";




		let locX = 0; //ev.x - bigbox.offsetLeft - bigbox.offsetWidth/2;
		let locY = 0; //ev.y - bigbox.offsetTop - bigbox.offsetHeight/2;
		el.innerHTML = locX + ", " + locY;

		this.maxX =  bigbox.offsetWidth/2 - el.offsetWidth/2;
		this.minX = -bigbox.offsetWidth/2 + el.offsetWidth/2;
		this.maxY =  bigbox.offsetHeight/2 - el.offsetHeight/2;
		this.minY = -bigbox.offsetHeight/2 + el.offsetHeight/2;

		this.border_left = parseInt(compStyle.getPropertyValue('border-left-width'));
		this.border_right = parseInt(compStyle.getPropertyValue('border-right-width'));

		el.Object = this;
		this.element = el;
		return this.element;
	}
}

addEventListener('load', Application.load());

