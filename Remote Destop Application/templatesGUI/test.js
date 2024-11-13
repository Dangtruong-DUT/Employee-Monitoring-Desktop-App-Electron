// Hàm tính toán số ngày giữa hai ngày
function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
}

// Hàm lọc thông báo theo số ngày cho phép
function filterNotifications(notifications, allowedDays) {
    const currentDate = new Date();
    return notifications.filter(notification => {
        const notificationDate = new Date(notification.date);
        return daysBetween(notificationDate, currentDate) <= allowedDays;
    });
}

// Mảng thông báo ban đầu
const notifications = [
  { title: 'thông báo hủy họp', content: 'Họp đã bị hủy bởi Admin', time: '12:00 AM', author: 'Admin', id: '5360', date: '2024-11-05' },
  { title: 'thông báo định hướng nghề nghiệp', content: 'Thông báo đã định hướng nghề nghiệp cho bạn', time: '12:30 AM', author: 'Admin', id: '0e30', date: '2024-11-07' },
  // Các thông báo khác...
];

// Gọi hàm lọc với giới hạn là 3 ngày
const filteredNotifications = filterNotifications(notifications, 4);
console.log("Filtered notifications:", filteredNotifications);

function addDateToDepartments(departments) {
    const currentDate = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại, chỉ lấy phần 'YYYY-MM-DD'
  
    departments.forEach(department => {
      department.date = currentDate; // Thêm thuộc tính "date" vào mỗi phần tử
    });
  
    return departments;
  }
  