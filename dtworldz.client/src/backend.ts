// export const BACKEND_URL = 'ws://dtworldz-server.onrender.com:10000'
// export const BACKEND_HTTP_URL = 'ws://dtworldz-server.onrender.com:10000'

export const BACKEND_URL = (window.location.href.indexOf("localhost") === -1)
    ? `wss://dtworldz-server.onrender.com:80`
    : "ws://localhost:2594"

export const BACKEND_HTTP_URL = BACKEND_URL.replace("ws", "http").replace("s:/", "http");

export const API_URL = (window.location.href.indexOf("localhost") === -1)
 ? `https://dtworldz-server.onrender.com/api`
    : "http://localhost:2594/api"