
## DEMO
Bạn có thể xem video demo của dự án tại [Google Drive](https://drive.google.com/file/d/1LFHevCN3izQ0KkZy2pdX2aWAAtcgY-qT/view?usp=drive_link).
# Ứng Dụng Giám Sát Nhân Viên

## Giới Thiệu Chung
Đây là ứng dụng giám sát nhân viên, cho phép điều khiển máy tính nhân viên từ xa. Repo này là dự án phía nhân viên, chưa bao gồm server và ứng dụng phía admin.

## Công Nghệ Chính Sử Dụng
- **WebRTC**: Giao thức truyền tải âm thanh, video và dữ liệu trực tuyến qua mạng.
- **WebSocket**: Giao thức kết nối giữa máy khách và server để truyền tải dữ liệu trong thời gian thực.
- **fetchAPI**: API để gửi và nhận dữ liệu từ server.
- **robotJS**: Thư viện JavaScript cho phép điều khiển máy tính (chuột, bàn phím) từ xa.

## Mô Hình Tổ Chức Dự Án

- Nhân viên đăng nhập vào hệ thống, ứng dụng phía nhân viên thiết lập kết nối theo mô hình client-server thông qua WebSocket.
- Sau khi server ghi nhận đăng nhập:
    + Máy client gửi thông tin về máy tính đang sử dụng về server.
    + Sau một chu kỳ thời gian nhất định, máy client gửi gói tin chứa thông tin cửa sổ ứng dụng đang sử dụng và địa chỉ URL của cửa sổ trình duyệt về server để xử lý.
- Máy nhân viên nhận thông báo về phiên làm việc, báo cáo vi phạm và thông báo chung của công ty qua WebSocket.
- Ngoài ra, ứng dụng có thể được điều khiển và giám sát màn hình từ xa bởi admin thông qua WebRTC kết hợp với RobotJS. Mô hình tổ chức như sau:
    1. Admin gửi thông điệp `start-share-screen` tới server với ID phòng ban tương ứng.
    2. Server gửi multicast tới các máy nhân viên trong phòng ban đó.
    3. Chương trình phía nhân viên và admin trao đổi thông điệp để thiết lập kết nối WebRTC (theo mô hình client-server).
    4. Server làm cầu nối trung gian và gửi thông điệp qua WebSocket.
    5. WebRTC thiết lập thành công, và chương trình phía nhân viên và admin hoạt động với nhau qua mô hình P2P trong cùng mạng, thực hiện giám sát màn hình và điều khiển máy tính thông qua WebRTC.

## Vai Trò Trong Dự Án
- **Admin**: Quản lý, giám sát và điều khiển máy tính nhân viên từ xa.
- **Employee**: Thực hiện công việc và nhận các thông báo từ hệ thống.

## Chức Năng Chính
- Giám sát máy tính từ xa.
- Điều khiển máy tính từ xa.
- Phân tích và thông báo lỗi khi nhân viên vào ứng dụng hoặc truy cập URL không được phép.
- Quản lý phòng ban và nhân viên.

## Cấu Trúc Dự Án

### **Server**
- **Java Spring Boot**: Xử lý các yêu cầu từ client và quản lý kết nối WebSocket.

### **Client**
- **Electron**: Framework xây dựng ứng dụng desktop cho nhân viên.
- **WebRTC**: Giao thức kết nối P2P cho việc giám sát và điều khiển máy tính.
- **FetchAPI**: Gửi yêu cầu API tới server.
- **HTML, CSS, JavaScript**: Giao diện người dùng.
- **RobotJS**: Thư viện điều khiển máy tính.

## Hướng Dẫn Cài Đặt

1. **Clone và pull dự án về máy**:
    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```
2. **Cài đặt các thư viện cần thiết**:
    ```bash
    npm i
    ```
3. **Cấu hình lại dự án tại file `.env`**: Điều chỉnh các thông số cấu hình cần thiết cho môi trường của bạn.
4. **Chạy dự án**:
    ```bash
    npm start
    ```

