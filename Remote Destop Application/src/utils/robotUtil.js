const robot = require('robotjs');

class RobotHandler {
    constructor() {
        this.isClosed = false;
        this.isDragging = false;
    }

    setClosed(status) {
        this.isClosed = status;
    }

    isValidNumber(value) {
        return typeof value === 'number' && !isNaN(value);
    }

    handleMouseMove(data) {
        if (this.isClosed) return;
        const { x, y } = data || {};
        if (this.isValidNumber(x) && this.isValidNumber(y)) {
            try {
                robot.moveMouse(x, y);
                setTimeout(() => {

                }, 50);
            } catch (error) {
                console.error("loi xu ly di chuyen chuot:", error);
            }
        } else {
            console.warn("du lieu khong hop le cho handleMouseMove:", data);
        }
    }

    handleMouseClick(data) {
        if (this.isClosed) return;
        const { button = 'left', double = false } = data || {};
        if (['left', 'right', 'middle'].includes(button)) {
            try {
                robot.mouseClick(button, double);
            } catch (error) {
                console.error("loi xu ly click chuot:", error);
            }
        } else {
            console.warn("du lieu khong hop le cho handleMouseClick:", data);
        }
    }

    handleMouseScroll(data) {
        console.log("handleMouseScroll");
        if (this.isClosed) return;
        const { x, y } = data || {};
        robot.scrollMouse(x, y);
        if (this.isValidNumber(x) && this.isValidNumber(y)) {
            try {

            } catch (error) {
                console.error("loi xu ly cuon chuot:", error);
            }
        } else {
            console.warn("du lieu khong hop le cho handleMouseScroll:", data);
        }
    } qqwerwaWE

    handleMouseDown(data) {
        if (this.isClosed) return;
        const { button = 'left' } = data || {};
        if (['left', 'right', 'middle'].includes(button)) {
            try {
                robot.mouseToggle('down', button);
                if (button === 'left') this.isDragging = true;
            } catch (error) {
                console.error("loi xu ly nhan giu chuot:", error);
            }
        } else {
            console.warn("du lieu khong hop le cho handleMouseDown:", data);
        }
    }
    handleMouseUp(data) {
        if (this.isClosed) return;
        const { button = 'left' } = data || {};
        if (['left', 'right', 'middle'].includes(button)) {
            try {
                robot.mouseToggle('up', button);
                if (button === 'left') this.isDragging = false;
            } catch (error) {
                console.error("loi xu ly thả chuột:", error);
            }
        } else {
            console.warn("du lieu khong hop le cho handleMouseUp:", data);
        }
    }

    handleTyping(data) {
        if (this.isClosed) return;
        const { key } = data || {};
        if (typeof key === 'string' && key.trim()) {
            try {
                robot.keyTap(key);
            } catch (error) {
                console.error("loi xu ly go phim:", error);
            }
        } else {
            console.warn("phim khong hop le:", key);
        }
    }

    handleKeyDown(data) {
        if (this.isClosed) return;
        const { key } = data || {};
        console.log(data)
        if (typeof key === 'string' && key.trim() && key != "Unidentified") {
            try {
                robot.keyToggle(key.toLowerCase(), 'down'); // Chuyển về chữ thường
            } catch (error) {
                console.error("loi xu ly nhan phim:", error);
            }
        } else {
            console.warn("phim khong hop le:", key);
        }
    }

    handleKeyUp(data) {
        if (this.isClosed) return;
        const { key } = data || {};
        console.log(data)
        if (typeof key === 'string' && key.trim() && key != "Unidentified") {
            try {
                robot.keyToggle(key.toLowerCase(), 'down'); // Chuyển về chữ thường
            } catch (error) {
                console.error("loi xu ly nhan phim:", error);
            }
        } else {
            console.warn("phim khong hop le:", key);
        }
    }

    handleDragStart(data) {
        if (this.isClosed) return;
        try {
            this.isDragging = true;
            this.handleMouseDown({ button: 'left' });
        } catch (error) {
            console.error("loi xu ly bat dau keo:", error);
        }
    }

    handleMouseDrag(data) {
        if (this.isClosed || !this.isDragging) return;
        this.handleMouseMove(data);
    }

    handleDragEnd(data) {
        if (this.isClosed) return;
        try {
            this.isDragging = false;
            this.handleMouseUp({ button: 'left' });
        } catch (error) {
            console.error("loi xu ly ket thuc keo:", error);
        }
    }

    handleWheel(data) {
        if (this.isClosed) return;
        this.handleMouseScroll(data);
    }
}
module.exports = RobotHandler;
