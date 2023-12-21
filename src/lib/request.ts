import axios from "axios";
import { ElMessage } from "element-plus";

// 创建axios实例
const service = axios.create({
  timeout: 60 * 1000, // 请求超时时间
});
const showErrMsg = (msgStr: string) => {
  ElMessage.error(msgStr);
};

// request拦截器
service.interceptors.request.use(
  (config: any) => {
    return config;
  },
  error => {
    showErrMsg(error);
  }
);
// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res?.code) {
      if ([1, 200].includes(res.code)) {
        return res?.data;
      } else {
        let msgStr = res?.msg || "抱歉，系统错误";
        showErrMsg(msgStr);
      }
    } else {
      // 响应体为数据，无code
      return res;
    }
  },
  error => {
    showErrMsg(error);
  }
);

const get = (url: string, params?: any, options: any = {}): any => {
  return service.get(url, {
    params,
    ...options,
  });
};
const post = (url: string, body?: any, headers = {}): any => {
  return service.post(url, body, {
    headers,
  });
};
const remove = (url: string, body?: any) => {
  return service.delete(url, { data: body });
};
const put = (url: string, body: any, headers = {}) => {
  return service.put(url, body, {
    headers,
  });
};

export default { get, post, remove, put };
