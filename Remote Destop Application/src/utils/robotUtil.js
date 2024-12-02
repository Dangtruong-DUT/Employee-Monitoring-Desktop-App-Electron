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
            } catch (error) {
                console.error("Lỗi khi xử lý di chuyển chuột:", error);
            }
        } else {
            console.warn("Dữ liệu không hợp lệ cho handleMouseMove:", data);
        }
    }

    handleMouseClick(data) {
        if (this.isClosed) return;
        const { button = 'left', double = false } = data || {};
        if (['left', 'right', 'middle'].includes(button)) {
            try {
                robot.mouseClick(button, double);
            } catch (error) {
                console.error("Lỗi khi xử lý click chuột:", error);
            }
        } else {
            console.warn("Dữ liệu không hợp lệ cho handleMouseClick:", data);
        }
    }

    handleMouseScroll(data) {
        if (this.isClosed) return;
        const { x = 0, y = 0 } = data || {};
        if (this.isValidNumber(x) && this.isValidNumber(y)) {
            try {
                robot.scrollMouse(x, y);
            } catch (error) {
                console.error("Lỗi khi xử lý cuộn chuột:", error);
            }
        } else {
            console.warn("Dữ liệu không hợp lệ cho handleMouseScroll:", data);
        }
    }

    handleMouseDown(data) {
        if (this.isClosed) return;
        const { button = 'left' } = data || {};
        if (['left', 'right', 'middle'].includes(button)) {
            try {
                robot.mouseToggle('down', button);
                if (button === 'left') this.isDragging = true;
            } catch (error) {
                console.error("Lỗi khi xử lý nhấn giữ chuột:", error);
            }
        } else {
            console.warn("Dữ liệu không hợp lệ cho handleMouseDown:", data);
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
                console.error("Lỗi khi xử lý thả chuột:", error);
            }
        } else {
            console.warn("Dữ liệu không hợp lệ cho handleMouseUp:", data);
        }
    }

    handleTyping(data) {
        if (this.isClosed) return;
        const { key } = data || {};
        if (typeof key === 'string' && key.trim()) {
            try {
                robot.keyTap(key);
            } catch (error) {
                console.error("Lỗi khi xử lý gõ phím:", error);
            }
        } else {
            console.warn("Phím không hợp lệ:", key);
        }
    }

    handleKeyDown(data) {
        if (this.isClosed) return;
        const { key } = data || {};
        if (typeof key === 'string' && key.trim()) {
            try {
                robot.keyToggle(key, 'down');
            } catch (error) {
                console.error("Lỗi khi xử lý nhấn phím:", error);
            }
        } else {
            console.warn("Phím không hợp lệ:", key);
        }
    }

    handleKeyUp(data) {
        if (this.isClosed) return;
        const { key } = data || {};
        if (typeof key === 'string' && key.trim()) {
            try {
                robot.keyToggle(key, 'up');
            } catch (error) {
                console.error("Lỗi khi xử lý nhả phím:", error);
            }
        } else {
            console.warn("Phím không hợp lệ:", key);
        }
    }

    handleDragStart(data) {
        if (this.isClosed) return;
        try {
            this.isDragging = true;
            this.handleMouseDown({ button: 'left' });
        } catch (error) {
            console.error("Lỗi khi xử lý bắt đầu kéo:", error);
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
            console.error("Lỗi khi xử lý kết thúc kéo:", error);
        }
    }

    handleWheel(data) {
        if (this.isClosed) return;
        this.handleMouseScroll(data);
    }
}
export default RobotHandler;
