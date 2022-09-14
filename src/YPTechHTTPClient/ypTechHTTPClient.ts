import axios from 'axios';

import { AXIOS_REQUEST_TO_YP_TECH_CONFIG } from '@/config/index';

export const ypTechHTTPClient = axios.create(AXIOS_REQUEST_TO_YP_TECH_CONFIG);
