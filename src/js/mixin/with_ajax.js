module.exports = function withAjax() {

  this.attributes({
    baseUrl: null,
  });

  this.request = function(options) {
    var url = options.xhr.path || '';
    var method = options.xhr.method || 'GET';
    var xhr = new XMLHttpRequest();
    var data = options.xhr.data ? JSON.stringify(options.xhr.data) : null;

    xhr.responseType = 'json';
    xhr.addEventListener('readystatechange', readystatechangeHandler.bind(this), false);
    xhr.upload.addEventListener('progress', progressHandler.bind(this), false);

    xhr.open(method, this.attr.baseUrl + url, true);
    console.log(data)
    xhr.send(data);

    function readystatechangeHandler(response) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.response);
        triggerEvent.call(this, 'done');
      }
      else if (xhr.readyState == 4 && xhr.status != 200) {
        triggerEvent.call(this, 'fail');
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
  };

}
