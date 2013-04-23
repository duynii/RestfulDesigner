<!DOCTYPE HTML>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Demo: Application Controller</title>
		<link rel="stylesheet" href="demo.css" media="screen">
		<link rel="stylesheet" href="style.css" media="screen">
		<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.8.3/dijit/themes/claro/claro.css" media="screen">
	</head>
	<body class="claro">

		<!-- overlay -->
		<div id="loadingOverlay" class="pageOverlay">
			<div class="loadingMessage">Loading...</div>
		</div>

		<div id="appLayout" class="demoLayout" data-dojo-type="dijit/layout/BorderContainer" data-dojo-props="design: 'headline'">
			<div class="centerPanel" id="tabs" data-dojo-type="dijit/layout/TabContainer" data-dojo-props="region: 'center', tabPosition: 'bottom'">
				<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="title: 'About'">

					<h2>Flickr keyword photo search</h2>
					<p>Each search creates a new tab with the results as thumbnails</p>
					<p>Click on any thumbnail to view the larger image</p>

				</div>
			</div>
			<div class="edgePanel" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region: 'top'">
				<div class="searchInputColumn">
					<div class="searchInputColumnInner">
						<input id="searchTerms" placeholder="search terms">
					</div>
				</div>
				<div class="searchButtonColumn">
					<button id="searchBtn">Search</button>
				</div>
			</div>
		</div>
		<!-- provide config via dojoConfig global -->
		<script>
			var dojoConfig = (function(){
				var base = location.href.split("/");
				base.pop();
				base = base.join("/");

				return {
					async: true,
					isDebug: true,
					parseOnLoad: true,
					packages: [{
						name: "demo",
						location: base + "/"
					}],
					flickrRequest: {
						apikey: "8c6803164dbc395fb7131c9d54843627",
						sort:[{
							attribute: "datetaken",
							descending: true
						}]
					}
				};
			})();
		</script>
		<!-- load dojo and provide config via data attribute -->
		<script src="../dojo/dojo.js"></script>
		<script>
			require(["app_demo6/app-step6", "dijit/layout/BorderContainer", "dijit/layout/TabContainer", "dijit/layout/ContentPane", "dojox/data/FlickrRestStore", "dojo/domReady!"], function(demoApp) {
				demoApp.init();
			});
		</script>
	</body>
</html>
