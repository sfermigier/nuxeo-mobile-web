<!DOCTYPE html>
<html>
	<head>
	<title>Recent documents</title>

	<meta name="viewport" content="user-scalable=no, width=device-width" />

	<link rel="stylesheet" href="/jqm/jquery.mobile.min.css" />
	<script src="/jqm/jquery.min.js"></script>
	<script src="/jqm/jquery.mobile.min.js"></script>
</head>

<body>
<div data-role="page" id="main">
	<div data-role="header">
		<h1>Recent documents</h1>
	</div>

	<div data-role="content">
        <ul data-role="listview" data-theme="g">
          <li>First</li>
          <li>Second</li>
          <li>Another one</li>
        </ul>
	</div>

	<div data-role="footer" data-id="foo1" data-position="fixed">
		<div data-role="navbar">
			<ul>
				<li><a href="/m/r/" rel="external">Home</a></li>
				<li><a href="/m/search" rel="external">Search</a></li>
				<li><a href="/m/recent" class="ui-btn-active" rel="external">Recent</a></li>
				<li><a href="/m/timeline" rel="external">Recent</a></li>
			</ul>
		</div>
	</div>
</div>


</body>
</html>