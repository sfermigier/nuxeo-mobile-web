<!DOCTYPE html>
<html>
	<head>
	<title>Timeline</title>

	<meta name="viewport" content="user-scalable=no, width=device-width" />

	<link rel="stylesheet" href="/jqm/jquery.mobile.min.css" />
	<script src="/jqm/jquery.min.js"></script>
	<script src="/jqm/jquery.mobile.min.js"></script>
</head>

<body>
<div data-role="page" id="main">
	<div data-role="header">
		<h1>Timeline</h1>
	</div>

	<div data-role="content">
        <ul data-role="listview" data-theme="g">
	    <li data-role="list-divider">Today</li>
        <#list children as it>
        <li>
            <a href="${ROOT}/m/r${it.path}" <#if !it.isfolder>rel="external"</#if>>${it.title}
            <small>(last modified: ${it.modified})</small>
            <#if it.isfolder><span class="ui-li-count">${it.childcount}</span></#if>
            </a>
        </li>
        </#list>
        </ul>
	</div>

	<div data-role="footer" data-id="foo1" data-position="fixed">
		<div data-role="navbar">
			<ul>
				<li><a href="${ROOT}/m/r/" rel="external">Browse</a></li>
				<li><a href="${ROOT}/m/search" rel="external">Search</a></li>
				<li><a href="${ROOT}/m/timeline" class="ui-btn-active" rel="external">Timeline</a></li>
			</ul>
		</div>
	</div>
</div>


</body>
</html>