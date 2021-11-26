import axios from 'axios'
import {authHeader} from "@/service/helpers/auth-header";

export const HTTP = axios.create({
    baseURL: process.env.VUE_APP_URL_SERVEUR,
    headers: {
        ...authHeader(),
        'Content-Type': 'application/json'
    }
})
