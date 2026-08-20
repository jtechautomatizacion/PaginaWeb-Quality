if (!window.API_BASE) {
    var hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        window.API_BASE = 'http://localhost:3000';
    } else {
        window.API_BASE = 'https://api.grouptqualityc.com.pe';
    }
}
