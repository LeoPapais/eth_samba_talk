import axios from 'axios'

export async function get(url: string, headers = {}) {
    const response = await axios(url, {
        method: 'GET',
        headers,
    })

    try {
        const data = await response.data
        return data
    } catch (error: any) {
        throw new Error(error?.message)
    }
}

export async function post(url: string, body = {}, headers = {}) {
    const response = await axios(url, {
        method: 'POST',
        headers,
        data: JSON.stringify(body)
    })

    try {
        const data = await response.data
        return data
    } catch (error: any) {
        throw new Error(error?.message)
    }
}
