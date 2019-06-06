//. app.js

var express = require( 'express' ),
//. cloudantlib = require( '@cloudant/cloudant' ),
    cfenv = require( 'cfenv' ),
    bodyParser = require( 'body-parser' ),
    fs = require( 'fs' ),
    ejs = require( 'ejs' ),
    uuidv1 = require( 'uuid/v1' ),
    app = express();
var settings = require( './settings' );

/* for Cloudant datastore
var db = null;
var cloudant = null;
if( settings.db_username && settings.db_password ){
  cloudant = cloudantlib( { account: settings.db_username, password: settings.db_password } );
  if( cloudant ){
    cloudant.db.get( settings.db_name, function( err, body ){
      if( err ){
        if( err.statusCode == 404 ){
          cloudant.db.create( settings.db_name, function( err, body ){
            if( err ){
              db = null;
            }else{
              db = cloudant.db.use( settings.db_name );
            }
          });
        }else{
          db = cloudant.db.use( settings.db_name );
        }
      }else{
        db = cloudant.db.use( settings.db_name );
      }
    });
  }
}
*/

var appEnv = cfenv.getAppEnv();

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( express.Router() );
app.use( express.static( __dirname + '/public' ) );

app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );

app.get( '/', function( req, res ){
  res.render( 'index', { title: settings.title } );
});

var items = [];
app.get( '/items', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var limit = 0;
  if( !req.query.limit ){ limit = parseInt( req.query.limit ); }
  var offset = 0;
  if( !req.query.offset ){ offset = parseInt( req.query.offset ); }

  var _items = JSON.parse( JSON.stringify( items ) );
  if( limit || offset ){
    _items = _items.slice( limit, limit + offset )
  }

  var p = JSON.stringify( { status: true, limit: limit, offset: offset, items: _items }, null, 2 );
  res.write( p );
  res.end();
});

app.post( '/item', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var item = req.body;
  if( item._id ){
    items.forEach( function( _item, idx ){
      if( _item._id == item._id ){
        items.splice( idx, 1 );
      }
    });
  }else{
    item._id = uuidv1();
    item.created = ( new Date() ).getTime();
  }
  item.updated = ( new Date() ).getTime();
  items.push( item );

  var p = JSON.stringify( { status: true, item: item }, null, 2 );
  res.write( p );
  res.end();
});

app.delete( '/item/:id', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var id = req.params.id;
  var b = false;
  if( id ){
    items.forEach( function( item, idx ){
      if( item._id == id ){
        items.splice( idx, 1 );
        b = true;
      }
    });
    if( b ){
      res.write( { status: true } );
      res.end();
    }else{
      res.status( 400 );
      res.write( { status: false, message: 'No item found with id: ' + id } );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( { status: false, message: 'No id specified.' } );
    res.end();
  }
});



app.listen( appEnv.port );
console.log( "server stating on " + appEnv.port + " ..." );
