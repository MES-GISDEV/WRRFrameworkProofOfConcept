define(['dojo/_base/declare', 'dojo/promise/all', 'jimu/BaseWidget', 'dojo/_base/lang','dojo/on', 'dojo/dom-class', 'esri/toolbars/draw', 'esri/tasks/query', 'esri/tasks/QueryTask'],
  function(declare, all, BaseWidget, lang, on, domClass, Draw, Query, QueryTask) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-sitevisits123',

      //this property is set by the framework when widget is loaded.
      name: 'SiteVisits123',

      //methods to communication with app container:

       postCreate: function() {
           this.inherited(arguments);
           //if (window.appInfo.isRunInMobile) { }

           console.log('postCreate');

       },

       startup: function() {
           this.inherited(arguments);
           this.drawPoint = new Draw(this.map, {

           });
           this.drawPoint.on('draw-end', lang.hitch(this, function (result) {
			   domClass.add(this.siteformBtn, "disactive");
			   this.drawPoint.deactivate();
			   this.runBackgroundQuery(result.geometry);
/*                if (window.appInfo.isRunInMobile) {
                   window.open(this.config.surveyLinkMobile + "&center="+ result.geometry.getLatitude() + "," + result.geometry.getLongitude());
               } else {
                   window.open(this.config.surveyLink + "?center=" + result.geometry.getLatitude() + "," + result.geometry.getLongitude());
               }		 */		   
               console.log(result);
               console.log(window.appInfo.isRunInMobile);
           }));
           on(this.siteformBtn, 'click', lang.hitch(this, function (evt) {
               if (domClass.contains(this.siteformBtn, "disactive")) {
                   domClass.remove(this.siteformBtn, "disactive");
                   this.drawPoint.activate(Draw.POINT);
               } else {
                   domClass.add(this.siteformBtn, "disactive");
                   this.drawPoint.deactivate();
               }
           }));
           console.log('startup');
       },
	   
       runBackgroundQuery: function (location) {
            var today = Date.now();

			
<<<<<<< Updated upstream
            //get and apply the county for where the point was clicked
=======
            //get and apply the county for where the point was clicked (This code block only applies to the old Survey123 form. Not needed for the new Survey123 Form)
>>>>>>> Stashed changes
            var cquery = new Query();
            var cqueryTask = new QueryTask(this.config.county.url);
            cquery.outSpatialReference = {wkid:102100}; 
            cquery.returnGeometry = false;
            cquery.geometry = location;
            cquery.where = today + "=" + today;
            cquery.outFields = [this.config.county.field];
			var counties = cqueryTask.execute(cquery);

<<<<<<< Updated upstream
            //get and apply the watershed to the point that was clicked
=======
            //get and apply the watershed to the point that was clicked (This code block only applies to the old Survey123 form. Not needed for the new Survey123 Form)
>>>>>>> Stashed changes
            var wquery = new Query();
            var wqueryTask = new QueryTask(this.config.watershed.url);
            wquery.outSpatialReference = { wkid: 102100 };
            wquery.returnGeometry = false;
            wquery.where = today + "=" + today;
            wquery.geometry = location;
            wquery.outFields = [this.config.watershed.field];
            var watersheds = wqueryTask.execute(wquery);
			var promises = all([counties, watersheds]);
			promises.then(lang.hitch(this, function(result){
				county = "";
				watershed = "";
				console.log(result);
				

<<<<<<< Updated upstream
				// make sure both queries finished successfully
=======
				// make sure both queries finished successfully (This code block only applies to the old Survey123 form. Not needed for the new Survey123 Form)
>>>>>>> Stashed changes
				if ( ! result[0].hasOwnProperty("features") ) {
					console.log("Counties query failed.");
				}else{
					county = result[0].features[0].attributes[this.config.county.field];
				}
				if ( ! result[1].hasOwnProperty("features") ) {
					console.log("watersheds query failed.");
				}else{
					watershed = result[1].features[0].attributes[this.config.watershed.field];
				}

				//if (window.appInfo.isRunInMobile) {
				//   window.open(this.config.surveyLinkMobile + "&field:field_48=" + watershed + "&field:field_47=" + county + "&center="+ location.getLatitude() + "," + location.getLongitude());
				//} else {
<<<<<<< Updated upstream
				//window.open(this.config.surveyLink);
				 window.open(this.config.surveyLink + "?field:field_48=" + watershed + "&field:field_47=" + county + "&center=" + location.getLatitude() + "," + location.getLongitude());
				//}				   
=======
				//window.open(this.config.surveyLink) + "?HUC12=" + watershed + "&countyname=" + county + "&center=" + location.getLatitude() + "," + location.getLongitude());
				//}
                window.open(this.config.surveyLink);			   
>>>>>>> Stashed changes
			}));

        }
	   

      // onOpen: function(){
      //   console.log('onOpen');
      // },

      // onClose: function(){
      //   console.log('onClose');
      // },

      // onMinimize: function(){
      //   console.log('onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('onMaximize');
      // },

      // onSignIn: function(credential){
      //   /* jshint unused:false*/
      //   console.log('onSignIn');
      // },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      // resize: function(){
      //   console.log('resize');
      // }

      //methods to communication between widgets:

    });
  });