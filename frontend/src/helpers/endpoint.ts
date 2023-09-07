import { getLogger } from "./logger";
import { Service, ServiceLocalPorts } from '../types/enums';

const logger = getLogger("api");

type apiConfig = {
    method: string,
    service: Service,
    path: string,
    body?: {}
}

/**
 * Production: service_api_url/<path>
 * Development: localhost:<service_ports>/<path>
 * @param service 
 * @param path 
 */
export const api = async (config: apiConfig) => {
    let host = 'localhost';

    let servicePort = ':';
    switch (config.service) {
        case Service.QUESTION:
            servicePort += ServiceLocalPorts.QUESTION || '';
            break;
        default:
            servicePort = ''
            break;
    }

    const endpoint = `http://${host}${servicePort}/${config.path}`;

    logger.debug(`${config.method}: [${endpoint}] \n${config.body || ''}`);

    const res = await fetch(endpoint, {
        method: config.method,
        headers: {
            ...(config.body ? { 'Content-Type': 'application/json' } : {}),
          },
        body:JSON.stringify(config.body),
    })

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    
    return  res.json();
}

export default api;