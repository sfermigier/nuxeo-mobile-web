<!DOCTYPE html>
<html>
	<head>
	<title>${title}</title>

	<link rel="stylesheet" href="/jqm/jquery.mobile.min.css" />
	<script src="/jqm/jquery.min.js"></script>
	<script src="/jqm/jquery.mobile.min.js"></script>
</head>

<body>
<div data-role="page" id="main">
	<div data-role="header">
		<h1>Nuxeo Mobile Browser</h1>
	</div>

	<div data-role="content">
        <ul data-role="listview" data-theme="g">
        <#list children as child>
        <li>
            <a href="${child.name}" <#if !child.isfolder>rel="external"</#if>>${child.title}</a>
            <#if child.isfolder><span class="ui-li-count">${child.childcount}</span></#if>
        </li>
        </#list>
        </ul>
	</div>
</div>


</body>
</html>