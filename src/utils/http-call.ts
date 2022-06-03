import axios, { AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';

class HttpCall {
  constructor() {
    axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
  }

  async post(props: { data?: any; headers?: any; url: string; timeout?: number; options?: any }): Promise<AxiosResponse<any>> {
    const { url, data = null, headers, timeout = 10000, options = null } = props;
    return await axios.post(url, data, { headers, timeout, ...options });
  }
  async get(props: { headers?: any; url?: string; timeout?: number; options?: any; data?: string }): Promise<AxiosResponse<any>> {
    const { url, headers, timeout = 10000, options = null, data = null } = props;
    return await axios.get(url, { headers, timeout: 30000, ...options, data });
  }
  async put(props: { data?: any; headers?: any; url: string; timeout?: number }): Promise<AxiosResponse<any>> {
    const { url, data = null, headers, timeout = 10000 } = props;
    return await axios.put(url, data, { headers, timeout });
  }
}

export { HttpCall, AxiosResponse as HttpCallResponse };
