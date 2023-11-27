// export const BACKEND_URL = 'ws://dtworldz-server.onrender.com:10000'
// export const BACKEND_HTTP_URL = 'ws://dtworldz-server.onrender.com:10000'

export const BACKEND_URL = (window.location.href.indexOf("localhost") === -1)
    ? `ws://dtworldz-server.onrender.com:10000)}`
    : "ws://localhost:2594"

export const BACKEND_HTTP_URL = BACKEND_URL.replace("ws", "http");