import axios from 'axios';

const BASE_URL = 'https://ya-praktikum.tech/api/v2';
const TIMEOUT = 20000;

export const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
})
