<!DOCTYPE html>
<html>
	<head>
	<title>Search</title>

	<meta name="viewport" content="user-scalable=no, width=device-width" />

	<link rel="stylesheet" href="/jqm/jquery.mobile.min.css" />
	<script src="/jqm/jquery.min.js"></script>
	<script src="/jqm/jquery.mobile.min.js"></script>
</head>

<body>
<div data-role="page" id="main">
	<div data-role="header">
		<h1>Search</h1>
	</div>

	<div data-role="content">
        <form action="search">
          <p>Query:</p>
          <input name="query" type="text" value="${query}"/>

          <input type="submit" value="Search"/>
        </form>

        <p>Results:</p>

        <ul data-role="listview" data-theme="g">
        <#list children as it>
        <li>
            <a href="${ROOT}/m/r${it.path}" rel="external">${it.title}</a>
            <#if it.isfolder><span class="ui-li-count">${it.childcount}</span></#if>
        </li>
        </#list>
        </ul>
	</div>

	<div data-role="footer" data-id="foo1" data-position="fixed">
		<div data-role="navbar">
			<ul>
				<li><a href="${ROOT}/m/r/" rel="external">Browse</a></li>
				<li><a href="${ROOT}/m/search" class="ui-btn-active" rel="external">Search</a></li>
				<li><a href="${ROOT}/m/timeline" rel="external">Timeline</a></li>
			</ul>
		</div>
	</div>
</div>


</body>
</html>