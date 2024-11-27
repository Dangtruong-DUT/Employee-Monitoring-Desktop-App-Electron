const fetch = require('node-fetch');

const ipServer = 'http://10.10.27.11:8088';

async function fetchAPI(endpoint, options) {
    const url = `${ipServer}${endpoint}`;
    let response;
    try {
        response = await fetch(url, options);

    }
    catch (error) {
        throw new Error("Lỗi khi làm việc với server!")
    }

    if (!response.ok) {
        console.log("Error"+response.status)
        let errorMessage = '';
        switch (response.status) {
            case 401:
                errorMessage = 'Lỗi Xác Thực!';
                break;
            case 403:
                errorMessage = 'Bạn không có quyền truy cập!';
                break;
            case 404:
                errorMessage = 'Không tìm thấy thông tin server!';
                break;
            default:
                errorMessage = 'Lỗi khi làm việc với server!';
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
    }

    return response.json();
}
async function login(user) {
    const options = {
        method: "POST",
        headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user.email, password: user.password }),
    };
    return fetchAPI('/rdp/api/v1/authentication/login', options);
}

async function fetchUserInfo(token, userId) {
    const options = {
        method: "GET",
        headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    };
    return fetchAPI(`/rdp/api/v1/users/user/${userId}`, options);
}

async function updateUserInfo(token, userId, userData) {
    const options = {
        method: "PUT",
        headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    };
    return fetchAPI(`/rdp/api/v1/users/user/${userId}`, options);
}

async function exitDepartment(token, idnv, mapb) {
    const options = {
        method: "POST",
        headers: {
            "Cache-Control": "no-cache",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
    return fetchAPI(`/rdp/api/v1/users/user/leave/${idnv}/${mapb}`, options);
}

async function joinDepartment(token, idnv, mapb) {
    const options = {
        method: "POST",
        headers: {
            "Cache-Control": "no-cache",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
    return fetchAPI(`/rdp/api/v1/users/user/join/${idnv}/${mapb}`, options);
}

module.exports = {
    login,
    fetchUserInfo,
    updateUserInfo,
    exitDepartment,
    joinDepartment,
};
