import { Message } from "./clientSocketUtil.js";
import RobotHandler from "./robotUtil.js";

class WebRTCUtil {
    constructor(socket, robot) {
        this.socket = socket;
        this.peerConnection = null;
        this.localStream = null;
        this.configuration = {
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        };
        this.robot = robot;
    }

    async initializeStream() {
        console.log(this.navigator);
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: { mandatory: { chromeMediaSource: 'desktop' } }
            });
            console.log("local stream da duoc khoi tao.");
        } catch (error) {
            console.error("loi khi tao local stream:", error);
            throw error;
        }
    }

    createPeerConnection() {
        this.peerConnection = new RTCPeerConnection(this.configuration);


        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                const message = new Message("ice-candidate",{candidate: event.candidate}); 
                this.socket.send(message.toJSON());
            }
        };

        this.peerConnection.onconnectionstatechange = () => {
            console.log("Trang Thai ket noi:", this.peerConnection.connectionState);
        };

        this.peerConnection.ontrack = (event) => {
            console.log("track tu xa nhan duoc:", event.streams[0]);
        };

        if (this.localStream) {
            this.localStream.getTracks().forEach((track) =>
                this.peerConnection.addTrack(track, this.localStream)
            );
        }
    }

    async startStreaming() {
        if (!this.localStream) await this.initializeStream();

        //this.createPeerConnection();

        try {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            const message = new Message("offer",{offer: offer}); 
            this.socket.send(message.toJSON());
            console.log("Offer da duoc gui:", offer);
        } catch (error) {
            console.error("loi khi bat dau streaming:", error);
            throw error;
        }
    }

    async handleAnswer(answer) {
        try {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            console.log("Answer da duoc nhan va remote description:", answer);
        } catch (error) {
            console.error("Loi khi xu ly answer:", error);
        }
    }

    async handleIceCandidate(candidate) {
        try {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            console.log("ICE candidate da được them:", candidate);
        } catch (error) {
            console.error("Loi khi thêm ICE candidate:", error);
        }
    }

    stopStreaming() {
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => track.stop());
            this.localStream = null;
        }

        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        console.log("da dung streaming.");
    }

    unregisterSocketEvents() {
        this.socket.off('ice-candidate');
        this.socket.off('offer');
        this.socket.off('answer');
        console.log("da kuy dang ky su kien socket.");
    }
    listenEventControll() {
        dataChannel = this.peerConnection.createDataChannel("eventChannel");

        dataChannel.onopen = () => console.log("DataChannel đã mở");
        dataChannel.onclose = () => console.log("DataChannel đã đóng");
      
        dataChannel.onmessage = (event) => {
            console.log("Đã nhận được event");
            const {type, data} = JSON.parse(event.data);
            
            const robot = new RobotHandler();
            switch (type) {
                case "mousemove":
                    robot.handleMouseMove(data);
                    break;
        
                case "dblclick":
                    robot.handleMouseClick(data);
                    break;
        
                case "mouse-left-click":
                    robot.handleMouseClick(data);
                    break;
        
                case "mouse-middle-click":
                    robot.handleMouseClick(data);
                    break;
        
                case "mouse-right-click":
                    robot.handleMouseClick(data);
                    break;
        
                case "drag-start":
                    robot.handleDragStart();
                    break;
        
                case "mouse-drag":
                    robot.handleMouseDrag(data);
                    break;
        
                case "dragend":
                    robot.handleDragEnd();
                    break;
        
                case "wheel":
                    robot.handleWheel(data);
                    break;
        
                case "keyup":
                    robot.handleKeyUp(data);
                    break;
        
                case "keydown":
                    robot.handleKeyDown(data);
                    break;
        
                default:
                    console.warn("Loại event không xác định:", mouseData.type);
                    break;
            }
        }
    }
}

export { WebRTCUtil };
