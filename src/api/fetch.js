import axios from 'axios'
import { BASE_API } from '../config'
// import { Message } from 'element-ui';
export default function fetch(options) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({
            baseURL: BASE_API,
            timeout: 600000
        });
        instance.interceptors.request.use(
            config => {
                let sid = sessionStorage.getItem('sid');
                if (sid) {
                    config['headers']['X-SID'] = sid
                }
                return config
            }, error => {
                Promise.reject(error)
            }
        );

        instance.interceptors.response.use(
            response => {
                let data;
                const { code, msg } = response.data
                if (code == 6) {
                    sessionStorage.clear()
                    window.location.href = '/'
                }
                if (response.data === undefined) {
                    data = response.request.responseText;
                } else {
                    data = response.data;
                }
                // if (code == 5 && !response.config.hideMes) {
                //     Message({
                //         message: msg,
                //         type: 'error'
                //     })
                // } else if (code == 3) {
                //     if (response.config.showMes) {
                //         Message({
                //             message: msg,
                //             type: 'success'
                //         })
                //     }
                // }
                return data
            },
            err => {
                return Promise.reject(err);
            }
        );

        if (options.method == 'post') {
            // let data = options.data
            // let fd = new FormData()
            // if (data) {
            //     Object.keys(data).forEach((key) => {
            //         fd.append(key, data[key])
            //     })
            // }
            // fd.append('sid', sessionStorage.getItem('sid'))
            // options.data = fd
        } else {
            options.params = {
                ...options.params,
            }
        }
        instance(options)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
}
