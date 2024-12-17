# Giới Thiệu Chung
- Đây là ứng dụng giám sát nhân viên, điều khiển máy tính nhân viên từ xa
repo này là dự án phía nhân viên chưa bao gồm server và phía ứng dụng của admin
# Công Nghệ chính sử dụng
- WEbRTC
- WEbsocket
- fetchAPI
- robotJS
# Mô hình tổ chức dự án
- Nhân viên đăng nhập vào hệ thống, ứng dụng phía nhân viên thiết lập kết nối theo
mô hình client-server kết nối thông qua websocket với server.
- sau khi server ghi nhận đăng nhập: 
    + máy client gửi thông tin máy đang sử dụng về server
    + sau chu kì thời gian nhất định gửi gói tin bao gồm
    cửa sổ ứng dụng đang sử dụng, đỉa chỉ URL của cửa sổ trình duyệt đang sử dụng về
    phía server sử lý
-  máy nhân viênnhận thông báo về phiên làm việc, báo cáo vi phạm,  thông báo chung của công ty
    qua websocket
- Ngoài ra ứng dụng còn có thể được điều kiển hay giám sát màn hình từ xa bởi admin thông qua
WebRTC kết hợp với robotJS. Mô hình tổ chức như sau:
    1. admin gửi thông điệp start-share-screen tới server với ID phòng ban tương ứng.
    2. server gửi mutilcast tới các máy nhân viên trong phòng ban đó.
    3. chương trình phía nhân viên và admin trao đổi thông điệp để thiết lập kết nối WEBRTC  (theo mô hình client server).
    server làm cầu nối trung gian và gửi thông điệp qua websocket.
    4. WEBRTC thiết lập thành công. lúc này chương trình phía nhân viên và admin hoạt động với nhau thông qua mô hình P2P
    trong cùng mạng, để tiếng hành giám sát màn hình và điều khiển máy tính thông qua WEBRTC.

# role-trong dự án
    - Admin
    - Employee

# chức Năng Chính
- giám sát máy tính từ xa
- điều khiển máy tính từ xa
- phân tích và thông báo lỗi khi nhân viên vào app
 hay URL không được công ty cho phép.
- quản lý phòng ban, nhân viên
# Server
- java spring boot
# Client
- electron
- WEBRTC
- FetchAPI
- HTML, Css, JavaScript
- RobotJS

# Cấu hình dự án
- B1: clone và pull dự án về máy
- B2: "npm i" vào terminal để cài thư viện cần thiết vào dự án.
- B3: cấu hình lại dự án tại file ".env"
- B4: "npm start" vào terminal để khởi chạy dự án.

# DEMO
![Video](../Code/remote%20desktop%202024-12-17%2017-29-40.mp4)