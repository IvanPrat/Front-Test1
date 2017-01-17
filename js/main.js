// Note from the author:
// There are several ways to code down here, that aren't probably the best ways to achieve certain objectives,
// such as the loadTableRowProduct(), which tries to simulate a template engine...
// If I'd have to do something similar in "real", I would do it with Handlebars,
// storing the default values into an array, so then the template would be different, probably.

// Please, understand this is a long test and cannot be perfect in about 4-5 hours

// From: http://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places
function round(value)
{
  return Math.round(value * 100) / 100;
}

function loadTableRowProduct(id, name, price, default_quantity)
{
  var output = '';

  output = output + '<div class="table-row js-table-row" data-id-row="' + id + '">';
  output = output + '  <div class="table-cell">';
  output = output +     name;
  output = output + '  </div>';
  output = output + '  <div class="table-cell">';
  output = output + '    &pound;' + price;
  output = output + '  </div>';
  output = output + '  <div class="table-cell">';
  output = output + '    <div class="input-quantity js-quantity">';
  output = output + '      <div class="input">';
  output = output + '        <input type="text" name="quantity[]" value="' + default_quantity + '" readonly/>';
  output = output + '      </div>';
  output = output + '      <div class="input-quantity-buttons">';
  output = output + '        <button class="input-quantity-button js-increase-value">+</button>';
  output = output + '        <button class="input-quantity-button js-decrease-value">-</button>';
  output = output + '      </div>';
  output = output + '    </div>';
  output = output + '  </div>';
  output = output + '  <div class="table-cell">';
  output = output + '    &pound;<span class="js-cost">' + price * default_quantity + '</span>';
  output = output + '  </div>';
  output = output + '  <div class="table-cell">';
  output = output + '    <a href="#" class="icon icon-trash js-remove-product"></a>';
  output = output + '  </div>';
  output = output + '</div>';

  return output;
}

function outputTotalResults(arr)
{
  $("#subtotal").text(arr['subtotal']);
  $("#vat").text(arr['vat']);
  $("#total").text(arr['total']);
}

function updateValue($obj, decrease)
{
  var $field_input_quantity     = $obj.closest(".js-quantity").find("input[name='quantity[]']");

  var $row                      = $obj.closest(".js-table-row");
  var id_row                    = $row.data("id-row");
  var value                     = 0;

  if(decrease)
    value = basket.decreaseValue(id_row, $field_input_quantity.val());
  else
    value = basket.increaseValue(id_row, $field_input_quantity.val());

  if(value)
  {
    $row.find(".js-cost").html(round(items[id_row]['price'] * value));
    $field_input_quantity.val(value);
  }
}

$(function(){
  // Load all the Products to the DOM
  // Note from the author: I'd rather use template engine such as Handlebars... not like this.
  $.each(items, function(key, value){
    $(".js-table-products").append(loadTableRowProduct(key, value['name'], value['price'], value['quantity']));
  });

  // Update the results in order to get the total(s)
  outputTotalResults(basket.updateResults());

  $("body").on("click", ".js-increase-value", function(){
    updateValue($(this), false);
  });

  $("body").on("click", ".js-decrease-value", function(){
    updateValue($(this), true);
  });

  $("body").on("click", ".js-remove-product", function(){
    var $product_row    = $(this).closest(".js-table-row");
    var product_id      = $product_row.data("id-row");

    if(basket.removeProduct(product_id))
      $product_row.remove();

    if(!$(".js-table-row").length)
      $("#buy-now").attr("disabled", true);
  });

  $("#buy-now").click(function(){
    basket.buyProduct(items, "");
  });

});
