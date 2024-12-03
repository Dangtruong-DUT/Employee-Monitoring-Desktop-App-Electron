import { Message } from "./clientSocketUtil.js";

class WebRTCUtil {
    constructor(socketHandler, robot) {
        this.socketHandler = socketHandler;
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
        this.listenEventControll();
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

        try {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            const message = new Message("offer",{offer: offer}); 
            this.socketHandler.socket.send(message.toJSON());
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
        const dataChannel = this.peerConnection.createDataChannel("eventChannel");
        dataChannel.onopen = () => console.log("DataChannel đã mở");
        dataChannel.onclose = () => console.log("DataChannel đã đóng");
      
        dataChannel.onmessage = (event) => {
            console.log("Đã nhận được event");
            const {type, data} = JSON.parse(event.data);
            
            switch (type) {
                case "mousemove":
                case "dblclick":
                case "mouse-left-click":
                case "mouse-middle-click":
                case "mouse-right-click":
                case "drag-start":
                case "mouse-drag":
                case "dragend":
                case "wheel":
                case "keyup":
                case "keydown":
                    window.API.sendMessage("robot-event", { type, data });
                    break;
                default:
                    console.warn("Loại event không xác định:", type);
                    break;
            }
        }
    }
}

export { WebRTCUtil };
