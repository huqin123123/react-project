import Emit from "./Emit";

export default class ServerHandle {
    static ParamsToQuery(params) {
        let query = "";
        Object.keys(params).forEach((p) => {
            if (params[p]) {
                if (query.length === 0) {
                    query += `${p}=${params[p]}`;
                }
                else {
                    query += `&${p}=${params[p]}`;
                }
            }
        })
        return query;
    }

    static Api(params) {
        if (process.env.NODE_ENV !== "development") {
            if (!params.baseURL) {
                params.baseURL = "/apis";
            }
            params.url = params.baseURL + params.url;
        }
        const query = this.ParamsToQuery(params.data);
        if ((params.method === "GET" || params.method === "DELETE") && query !== "") {
            params.url += "?" + query;
        }
        const config = {
            credentials: "include",
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', // 指定提交方式为表单提交
            }),
        };

        if ((params.method === "POST" || params.method === "PUT") && query !== "") {
            config.body = query;
        }
        return new Promise((res) => {
            fetch(params.url, { ...config, method: params.method })
                .then((result) => {
                    console.log(result)
                    if (result.status === 200) {
                        return result.json();
                    }
                    else {
                        return {
                            success: false,
                            message: "网络连接出错"
                        };
                    }
                })
                .then(result => {
                    if (result.code === "10001") {
                        Emit.emit('target', '/');
                        res({
                            success: false,
                            message: "未登录"
                        });
                        return;
                    }
                    res(result);
                })
                .catch(result => {
                    res(false);
                })
        })
    }
    static ResponseHandle(result) {
        if (result.status !== 200) {
            return {
                success: false,
                message: "网络连接出错"
            };
        } else if (result.data.code === '10001') {
            Emit.emit('target', '/');
            // this.props.history.push('/index')
        }
        else {
            return result.data;
        }
    }


    static GET({ url = "", data = {}, ...props }) {
        const config = {
            data,
            method: 'GET',
            url,
            ...props,
        }
        return this.Api(config);
    }

    static POST({ url = "", data = {}, ...props }) {
        const config = {
            data,
            method: 'POST',
            url,
            ...props,
        }
        return this.Api(config);
    }

    static DELETE({ url = "", data = {}, ...props }) {
        const config = {
            data,
            method: 'DELETE',
            url,
            ...props,
        }
        return this.Api(config);
    }

    static PUT({ url = "", data = {}, ...props }) {
        const config = {
            data,
            method: 'PUT',
            url,
            ...props,
        }
        return this.Api(config);
    }

}
