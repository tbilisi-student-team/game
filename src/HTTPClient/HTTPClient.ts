import axios from 'axios';

import { AXIOS_REQUEST_CONFIG } from '@/config/index';

export const HTTPClient = axios.create(AXIOS_REQUEST_CONFIG);
