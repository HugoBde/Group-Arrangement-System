import $ from "jquery";

$(function() {
  (<any>$("#allFacets, #userFacets")).sortable({
    connectWith: "ul",
    placeholder: "placeholder",
    delay: 150
  })
  .disableSelection()
  .dblclick( function(e){
    var item = e.target;
    if (e.currentTarget.id === 'allFacets') {
      //move from all to user
      $(item).fadeOut('fast', function() {
        $(item).appendTo($('#userFacets')).fadeIn('slow');
      });
    } else {
      //move from user to all
      $(item).fadeOut('fast', function() {
        $(item).appendTo($('#allFacets')).fadeIn('slow');
      });
    }
  });
});