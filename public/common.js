//. common.js
var base_url = location.origin + '/';

$(function(){
  init();
});

function init(){
  $('#items_table_tbody').html( '' );
  $.ajax({
    type: 'GET',
    url: '/items',
    success: function( result ){
      if( result && result.status ){
        result.items.forEach( function( item, idx ){
          var tr = '<tr>'
            + '<td>' + item._id + '</td>'
            + '<td>' + item.body + '</td>'
            + '<td>' + timestamp2datetime( item.updated ) + '</td>'
            + '<td><input type="button" class="btn btn-xs btn-warning" value="EDIT" onClick=\'editItem(' + JSON.stringify( item ) + ')\'/>'
            + '<input type="button" class="btn btn-xs btn-danger" value="DELETE" onClick="deleteItem(\'' + item._id + '\')"/></td>'
            + '</tr>';
          $('#items_table_tbody').append( tr );
        });
      }

      var tr = '<tr>'
        + '<td><input type="text" id="edit_id" value="" readonly/></td>'
        + '<td><input type="text" id="edit_body" value=""/></td>'
        + '<td>&nbsp;</td>'
        + '<td><input type="button" class="btn btn-success" value="CREATE" onClick="saveItem()"/>'
        + '</tr>';
      $('#items_table_tbody').append( tr );
    },
    error: function(){
      console.log( 'error' );
    }
  });
}

function saveItem(){
  var data = {
    _id: $('#edit_id').val(),
    body: $('#edit_body').val()
  };
  $.ajax({
    type: 'POST',
    url: '/item',
    data: data,
    success: function( result ){
      window.location.href = base_url;
    },
    error: function(){
      console.log( 'save(): error' );
    }
  });
}

function editItem( item ){
  console.log( 'edit: ' );
  console.log( JSON.stringify( item, null, 2 ) );
  if( item._id ){
    $('#edit_id').val( item._id );
    $('#edit_body').val( item.body );
  }else{
    $('#edit_id').val( '' );
    $('#edit_body').val( '' );
  }
}

function deleteItem( id ){
  console.log( 'delete: ' + id );
}

function timestamp2datetime( ts ){
  if( ts ){
    var dt = new Date( ts );
    var yyyy = dt.getFullYear();
    var mm = dt.getMonth() + 1;
    var dd = dt.getDate();
    var hh = dt.getHours();
    var nn = dt.getMinutes();
    var ss = dt.getSeconds();
    var datetime = yyyy + '-' + ( mm < 10 ? '0' : '' ) + mm + '-' + ( dd < 10 ? '0' : '' ) + dd
      + ' ' + ( hh < 10 ? '0' : '' ) + hh + ':' + ( nn < 10 ? '0' : '' ) + nn + ':' + ( ss < 10 ? '0' : '' ) + ss;
    return datetime;
  }else{
    return "";
  }
}
