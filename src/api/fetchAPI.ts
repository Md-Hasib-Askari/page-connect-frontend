// const API_URL = 'http://localhost:80/api/V1';
const API_URL = 'https://a991-103-65-135-129.ngrok-free.app/api/V1';

/**
 * Fetch User Information
 */
export const verifyUser = async (jwtToken: string) => {
    const response = await fetch(`${API_URL}/verifyUser`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

export const getUser = async (jwtToken: string) => {
    const response = await fetch(`${API_URL}/getUser`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

export const saveAccessToken = async (userID: string, accessToken: string) => {
    const response = await fetch(`${API_URL}/saveAccessToken`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID, accessToken})
    });
    return response.json();
}

/**
 * Fetch Page Information
 */
export const getPages = async (jwtToken: string) => {
    const response = await fetch(`${API_URL}/getPages`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    });
    return response.json();
}

export const savePage = async (jwtToken: string, pageID: string, accessToken: string, name: string) => {
    const response = await fetch(`${API_URL}/savePage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ pageID, accessToken, name})
    });
    return response.json();
}

export const getPage = async (jwtToken: string) => {
    const response = await fetch(`${API_URL}/getPage`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    });
    return response.json();
}

/**
 * Fetch Messages
 */
export const fetchMessages = async (jwtToken: string) => {
    const response = await fetch(`${API_URL}/syncMessages`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    });
    return response.json();
}