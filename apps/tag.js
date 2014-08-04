/**
 * tag app
 */
var tagModel = require('./tag/tagmodel')
  , constants = require('../core/constants')
  , common = require('./common/commonmodel')
 , types = require('../node_modules/tqtopicmap/lib/types');


exports.plugin = function(app, environment, ppt, isPrivatePortal) {
	var topicMapEnvironment = environment.getTopicMapEnvironment();
	var Dataprovider = topicMapEnvironment.getDataProvider();
	var CommonModel = environment.getCommonModel();

	function isPrivate(req,res,next) {
		if (isPrivatePortal) {
			if (req.isAuthenticated()) {return next();}
			res.redirect('/login');
		} else {
			{return next();}
		}
	}
	function isLoggedIn(req, res, next) {
		// if user is authenticated in the session, carry on 
		console.log('ISLOGGED IN '+req.isAuthenticated());
		if (req.isAuthenticated()) {return next();}
		// if they aren't redirect them to the home page
		// really should issue an error message
		if (isPrivatePortal) {
			return res.redirect('/login');
		}
		res.redirect('/');
	}
	/////////////////
	// Menu
	/////////////////
	environment.addApplicationToMenu("/tag","Tag");

	/////////////////
	// Routes
	/////////////////
	app.get('/tag', isPrivate,function(req,res) {
		res.render('tagindex',environment.getCoreUIData(req));
	});
		
	app.get('/tag/:id', isPrivate,function(req,res) {
		var q = req.params.id;
		console.log('TAGrout '+q);
		var credentials = []; 
		if (req.user) {credentials = req.user.credentials;}
		Dataprovider.getNodeByLocator(q, credentials, function(err,result) {
			console.log('TAGrout-1 '+err+" "+result);
			var title = result.getLabel(constants.ENGLISH);
			var details = result.getDetails(constants.ENGLISH);
			var userid = result.getCreatorId();
			// paint docs
			var docs = result.listRelationsByRelationType(types.TAG_DOCUMENT_RELATION_TYPE);
	//		console.log("Tags.XXX "+JSON.stringify(docs));
			// paint users
			var users = result.listRelationsByRelationType(types.TAG_CREATOR_RELATION_TYPE);
			var date = result.editedAt;
			var data = environment.getCoreUIData(req);
			data.title = title;
			data.body = details;
			data.docs = docs;
			data.users = users;
			data.date = date;
			data.source = result.toJSON();
			data.image = "/images/tag.png";
		  	  data.myLocator = q;

			//TODO paint provenance creator Id setup to point to user
			console.log('TAGrout-2 '+JSON.stringify(data));
			res.render('topic', data);
		});
	});

	app.get('/tag/ajaxtopicnode/:id', function(req, res) {
		    var q = req.params.id;
		    console.log('AJAXTOPICNODE '+q);
		    var credentials = [];
		    if (req.user) { credentials = req.user.credentials;}
		    //get all parents
		   CommonModel.fillConversationTable(false, true,q,"",credentials,function(err,result) {
		        try {
		            res.set('Content-type', 'text/json');
		          }  catch (e) { }
		          res.json(result);

		   });
	});

	app.get('/tag/ajaxptopicnode/:id', function(req, res) {
		    var q = req.params.id;
		    console.log('AJAXTOPICNODE '+q);
		    var credentials = [];
		    if (req.user) { credentials = req.user.credentials;}
		    //get just my children
		    CommonModel.fillConversationTable(false, false,q,q,credentials,function(err,result) {
		        try {
		            res.set('Content-type', 'text/json');
		          }  catch (e) { }
		          res.json(result);

		    });
	});

};