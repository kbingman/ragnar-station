module.exports = function withFormUtils() {

  this.attributes({
    'fields': '[name]',
    'errors': '.r-error-message'
  });

  this.serialize = function() {
    // This is a jQuery object, so we call the native in Array#reduce on it
    // for when jQuery goes away,
    return Array.prototype.reduce.call(this.select('fields'), function(memo, el){
      var key = el.getAttribute('name');
      memo[key] = el.value || el.innerHTML;

      return memo;
    }, {});
  };

  this.clearFields = function() {
    // This is a jQuery object, so we call the native in Array#forEach on it
    //  for when jQuery goes away,
    Array.prototype.forEach.call(this.select('fields'), function(el){
      el.parentElement.classList.remove('r-error');
      el.value = '';
      el.nextElementSibling.innerHTML ='';
    });
  };

}
