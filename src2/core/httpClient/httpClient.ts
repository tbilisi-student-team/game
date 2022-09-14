import axios from 'axios';

//TODO BASE_URL должен быть задан более глобально
//Кроме того, это сейчас не httpClient, а скорее yaPraktikumTechClient
//А в будущем у нас будет собственный бэкенд для форума и т.п.
export const BASE_URL = 'https://ya-praktikum.tech/api/v2';
const TIMEOUT = 20000;

export const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
})
