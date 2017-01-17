// Note this is not using ES6 Classes (due some troubles with IE9)

var MyBasket = (function () {
  function MyBasket(products_limit, vat) {
    this._limit = products_limit;
    this._vat = vat;
  }

  MyBasket.prototype.updateResults = function () {
    // Note from the author:
    // This var should be global, but then I would have to change partially the behaviour.
    // So let's do it like this. However, it's not the best way.

    var total_results = {
      'subtotal' : 0,
      'vat' : 0,
      'total' : 0
    };

    $.each(items, function(key, value){
      total_results['subtotal'] += (value['price'] * value['quantity']);
    });

    total_results['subtotal']   = round(total_results['subtotal']);
    total_results['vat']        = round((total_results['subtotal'] / 100) * this._vat);
    total_results['total']      = round(total_results['subtotal'] + total_results['vat']);

    return total_results;
  };

  MyBasket.prototype.removeProduct = function (id) {
    delete items[id];

    outputTotalResults(this.updateResults());

    return true;
  };

  MyBasket.prototype.increaseValue = function (id, current_value) {
    return this._updateValue(id, current_value, true);
  };

  MyBasket.prototype.decreaseValue = function (id, current_value) {
    return this._updateValue(id, current_value, false);
  };

  MyBasket.prototype.buyProduct = function (items, url) {
    $.ajax({
      url: url,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(items),
      success: function(){
        console.log("AJAX Call Done");
      }
    });
  };

  MyBasket.prototype._updateValue = function (id, current_value, increase) {
    var value = this._validateValueLimit(current_value, increase, true);

    if(value)
    {
      items[id]['quantity'] = value;

      outputTotalResults(this.updateResults());

      return value;
    }

    return;
  };

  MyBasket.prototype._validateValueLimit = function (value, increase) {
    value = Number(value);

    if(increase)
      value = value + 1;
    else
      value = value - 1;

    if(value < this._limit)
      return value;

    return;
  };

  return MyBasket;
})();
