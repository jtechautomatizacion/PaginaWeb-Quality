(function () {
    var cache = {};

    window.ApiClient = {
        fetch: function (url) {
            if (!cache[url]) {
                cache[url] = fetch(url).then(function (res) { return res.json(); });
                cache[url].catch(function () { delete cache[url]; });
            }
            return cache[url];
        }
    };
})();
