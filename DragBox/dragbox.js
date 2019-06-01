
Application = {
	Classes: {},
	Dragging: undefined,

	BOX_SIZE: 24,
	greeny: undefined,

	load: function(e) {
		console.log("LOaDED");
		this.bigbox = document.getElementById('bigbox');
		this.blank = document.getElementById('blank');
	},
};

Application.Dragging = new (class Dragging {
	dragStart(ev) {
		let box_width = parseInt(ev.target.offsetWidth/2) + "px";
		let box_height = parseInt(ev.target.offsetHeight/2) + "px";

		ev.dataTransfer.effectAllowed='move';
		ev.dataTransfer.setDragImage(Application.blank, box_width, box_height);
	}

	dragEnd(ev) {
		// Empty
	}

	drag(ev) {
		let bigbox = Application.bigbox;
		let BOX_SIZE = Application.BOX_SIZE;

		var dragbox = ev.target;
		var posX = (ev.x - BOX_SIZE);
		var posY = (ev.y - BOX_SIZE);

		var offCenterPosX = ev.x - bigbox.offsetLeft - bigbox.offsetWidth/2;
		var offCenterPosY = ev.y - bigbox.offsetTop - bigbox.offsetHeight/2;

		var maxX = bigbox.offsetWidth/2 - dragbox.offsetWidth/2;
		var minX = -bigbox.offsetWidth/2 + dragbox.offsetWidth/2;
		var maxY = bigbox.offsetHeight/2 - dragbox.offsetHeight/2;
		var minY = -bigbox.offsetHeight/2 + dragbox.offsetHeight/2;

		if(offCenterPosX > maxX) {
			let border_right = getComputedStyle(dragbox).getPropertyValue('border-right-width');
			posX = bigbox.offsetLeft + bigbox.offsetWidth - BOX_SIZE * 2 - parseInt(border_right);
		} else if(offCenterPosX < minX) {
			posX = bigbox.offsetLeft;
		}

		if(offCenterPosY > maxY) {
			let border_left = getComputedStyle(dragbox).getPropertyValue('border-left-width');
			posY = bigbox.offsetTop + bigbox.offsetHeight - BOX_SIZE * 2 - parseInt(border_left);
		} else if(offCenterPosY < minY) {
			posY = bigbox.offsetTop;
		}

		dragbox.style.position = "absolute";
		dragbox.style.left = posX+'px';
		dragbox.style.top = posY+'px';

		ev.target.innerHTML = offCenterPosX + ", " + offCenterPosY;
	}

	correctForCollisions(ev) {
		let bigbox = Application.bigbox;

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

// Application.Classes.DragBox = class DragBox {
// 	constructor() {
// 		this.foo = 88;

// 		let el = document.createElement("DIV");
// 		console.log(el);

// 		return el;
// 	}
// }


addEventListener('load', Application.load());


