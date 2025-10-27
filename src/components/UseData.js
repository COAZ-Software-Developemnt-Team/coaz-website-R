import axios from "axios";
import {useNavigate} from "react-router-dom";

//axios.defaults.baseURL = 'http://localhost:8080/api/';
//axios.defaults.baseURL = 'http://localhost:8080/coaz/api/';
//axios.defaults.baseURL = 'http://192.168.1.53:8080/api/';
//axios.defaults.baseURL = 'https://coaz.org:8085/coaz_test/api/';
axios.defaults.baseURL = 'https://coaz.org:8085/coaz/api/';

export function useData() {
    const navigate = useNavigate();

    const login = async (username,password) => {
        sessionStorage.setItem("access_token",'');
        sessionStorage.setItem("refresh_token",'');
        let responseObject = {};
        await axios.get("login",{params:{username:username,password:password}})
            .then(async (response) => {
                if(response.data['access_token']) {
                    sessionStorage.setItem("access_token",response.data['access_token']);
                    sessionStorage.setItem("refresh_token",response.data['refresh_token']);
                    await request('GET','current',null,null,true)
                        .then(async (currentResponse) => {
                            if(currentResponse.status && currentResponse.status === 'SUCCESSFUL' && currentResponse.content && currentResponse.content.user && currentResponse.content.user.status === 'ACTIVE') {
                                sessionStorage.setItem("user", JSON.stringify(currentResponse.content.user));
                                navigate("/home");
                            } else if(currentResponse.message) {
                                responseObject = {error_message:currentResponse.message};
                            } else if(typeof currentResponse === "string") {
                                responseObject = {error_message:currentResponse};
                            } else {
                                responseObject = {error_message:'Error getting current user'};
                            }
                        })
                        .catch((error) => {
                            responseObject = {error_message:error.message};
                        })
                } else if(response.data.status === 'PENDING_PAYMENT' && response.data.user && response.data.tariff) {
                    window.location.href = `/mobile_payment?userId=${response.data.user.id}&receivableId=${response.data.tariff.receivableId}&criteriaId=${response.data.tariff.criteriaId}&sponsor=${encodeURIComponent('SELF')}`;
                    responseObject = response.data;
                } else if(response.data.status && response.data.status === 'OTP' && response.data.user ) {
                    window.location.href = `/change_password?username=${encodeURIComponent(response.data.user.username)}`;
                    responseObject = response.data
                } else if(response.data.status === 'INCOMPLETE_REGISTRATION' && response.data.user) {
                    window.location.href = `/finish_registration?userId=${response.data.user.id}`;
                    responseObject = response.data
                } else {
                    responseObject = response.data
                }
            })
            .catch((error) => {
                if(error.response && error.response.status === 401) {
                    if (error.response.data['error_message'] && error.response.data['error_message'].toLowerCase().includes('bad credentials')) {
                        responseObject = {error_message:'Incorrect username or password'};
                    }else {
                        responseObject = error.response.data;
                    }
                } else {
                    responseObject = {error_message:error.message};
                }
            })
        return responseObject;
    }

    const logout = () => {
        if (navigate) {
            sessionStorage.setItem("access_token",'');
            sessionStorage.setItem("refresh_token",'');
           navigate('/home');
        } else {
            console.warn('Navigation function not yet available.');
        }
    }
    const request = async (method,url,body,params,authorization,refresh) => {
        let response = null;
        switch(method) {
            case 'POST': {
                await axios.post(url, body,{
                    params:params,
                    headers:authorization?{Authorization:`bearer ${sessionStorage.getItem("access_token")}`}:null
                })
                    .then((postResponse) => {
                        response = postResponse.data;
                    })
                    .catch(async (error) => {
                        response = error;
                    })
                break;
            }
            case 'PUT': {
                await axios.put(url, body,{
                    params: params,
                    headers:authorization?{Authorization:`bearer ${sessionStorage.getItem("access_token")}`}:null
                })
                    .then((putResponse) => {
                        response = putResponse.data;
                    })
                    .catch(async (error) => {
                        response = error;
                    })
                break;
            }
            case 'GET': {
                await axios.get(url,{
                    params: params,
                    headers:authorization?{Authorization:`bearer ${sessionStorage.getItem("access_token")}`}:null
                })
                    .then((getResponse) => {
                        response = getResponse.data;
                    })
                    .catch(async (error) => {
                        response = error;
                    })
                break;
            }
            case 'DELETE': {
                await axios.delete(url,{
                    params: params,
                    headers:authorization?{Authorization:`bearer ${sessionStorage.getItem("access_token")}`}:null
                })
                    .then((postResponse) => {
                        response = postResponse.data;
                    })
                    .catch(async (error) => {
                        response = error;
                    })
                break;
            }
        }
        if(response.status >= 400) {
            if(authorization && response.status === 403 && !refresh) {
                console.log('refreshing')
                await axios.get("token/refresh",{headers: {Authorization: `bearer ${sessionStorage.getItem("refresh_token")}`}})
                    .then(async (refreshResponse) => {
                        if(refreshResponse.status === 200) {
                            sessionStorage.setItem("access_token",refreshResponse.data['access_token']);
                            await request(method,url,body,params,authorization,true)
                                .then((data) => {
                                    response = data;
                                })
                                .catch((error) => {
                                    if(error.response && error.response.data && error.response.data.message) {
                                        response =  error.response.data.message;
                                    } else {
                                        response =  error.message;
                                    }
                                })
                        } else {
                            logout();
                        }
                    })
                    .catch((error) => {
                        logout();
                        if(error.response && error.response.data && error.response.data.message) {
                            response =  error.response.data.message;
                        } else if (error.response && error.response.data && error.response.data.error_message) {
                            response = error.response.data.error_message;
                        }  else if(error.response && error.response.data && error.response.data.trace) {
                            response = error.response.data.trace;
                        } else if(error.response && error.response.data && error.response.data.error) {
                            response = error.response.data.error;
                        } else {
                            response = error.message;
                        }
                    });
            } else if (response.response && response.response.data && response.response.data.message) {
                response = response.response.data.message;
            } else if (response.response && response.response.data && response.response.data.error_message) {
                response = response.response.data.error_message;
            } else if(response.response && response.response.data && response.response.data.trace) {
                response = response.response.data.trace;
            } else if(response.response && response.response.data && response.response.data.error) {
                response = response.response.data.error;
            } else {
                response = response.message;
            }
        }
        return response;
    }

    const download = async (url,params,authorization,refresh) => {
        let response = null;
        await axios.get(url,{
            responseType:'blob',
            params:params,
            headers:authorization?{Authorization:`bearer ${sessionStorage.getItem("access_token")}`}:null
        })
            .then((downloadResponse) => {
                response = downloadResponse.data;
            })
            .catch(async (error) => {
                response = error
            })
        return response;
    }

    return {
        login:login,
        logout:logout,
        request:request,
        download:download
    };
}