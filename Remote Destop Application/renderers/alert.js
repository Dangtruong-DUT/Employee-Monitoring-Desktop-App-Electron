export default function showAlert(message, option="Success") {
    let alertContainer = document.getElementById('alertContainer');
    
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alertContainer';
        document.body.appendChild(alertContainer);
    }

    let alertElement = null;
    switch (option) {
        case "Success":
            alertElement = document.createElement('div');
            alertElement.role = "alert";
            alertElement.className = "alert alert--success transition--pop";
            alertElement.innerHTML = `
                <svg class="alert__icon alert__icon--success" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
                <p class="alert__text">${message}</p>
            `;
            break;
        case "Info":
            alertElement = document.createElement('div');
            alertElement.role = "alert";
            alertElement.className = "alert alert--info transition--pop";
            alertElement.innerHTML = `
                <svg class="alert__icon alert__icon--info" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
                <p class="alert__text">${message}</p>
            `;
            break;
        case "Warning":
            alertElement = document.createElement('div');
            alertElement.role = "alert";
            alertElement.className = "alert alert--warning transition--pop";
            alertElement.innerHTML = `
                <svg class="alert__icon alert__icon--warning" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
                <p class="alert__text">${message}</p>
            `;
            break;
        case "Error":
            alertElement = document.createElement('div');
            alertElement.role = "alert";
            alertElement.className = "alert alert--error transition--pop";
            alertElement.innerHTML = `
                <svg class="alert__icon alert__icon--error" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
                <p class="alert__text">${message}</p>
            `;
            break;
        default:
            console.error("Invalid option");
            return;
    }

    alertContainer.appendChild(alertElement);

    // Gọi hiệu ứng sau khi thẻ đã được thêm vào
    setTimeout(() => {
        alertElement.style.zIndex = `${alertContainer.childElementCount}`;

        // Kích hoạt hiệu ứng xuất hiện
        setTimeout(() => alertElement.classList.add('alert--visible'), 100);

        // Xóa thẻ sau 3 giây
        setTimeout(() => {
            alertElement.classList.remove('alert--visible');
            alertElement.addEventListener('transitionend', () => alertElement.remove());
        }, 3000);
    }, 10);
}
