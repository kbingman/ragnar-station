require('es6-promise').polyfill();

module.exports = function withAjax() {

  this.attributes({
    baseUrl: null,
  });

  this.request = function(options) {
    var url = this.attr.baseUrl + options.xhr.path || '';
    var method = options.xhr.method || 'GET';
    var data = options.xhr.data ? JSON.stringify(options.xhr.data) : undefined;

    function request(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('readystatechange', readystatechangeHandler.bind(this), false);
      xhr.upload.addEventListener('progress', progressHandler.bind(this), false);

      xhr.open(method, url, true);
      xhr.send(data);

      function readystatechangeHandler(response) {
        if (xhr.readyState == 4 && xhr.status == 200) {
          triggerEvent.call(this, 'done');
          resolve(xhr.response);
        }
        else if (xhr.readyState == 4 && xhr.status != 200) {
          triggerEvent.call(this, 'fail');
          reject(xhr.response);
        }
      };

      function progressHandler(response) {
        triggerEvent.call(this, 'progress');
      };

      function triggerEvent(e) {
        var event = options.events[e];
        if (event) {
          this.trigger(event, xhr.response);
        }
      };

    }

    return new Promise(request.bind(this));

  };

}
