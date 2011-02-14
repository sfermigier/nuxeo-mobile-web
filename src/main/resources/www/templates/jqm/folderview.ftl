<!DOCTYPE html>
<html>
	<head>
	<title>${title}</title>

    <meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="viewport" content="user-scalable=no, width=device-width" />

	<link rel="stylesheet" href="/jqm/jquery.mobile.min.css" />
	<script src="/jqm/jquery.min.js"></script>
	<script src="/jqm/jquery.mobile.min.js"></script>

<script type="application/x-javascript">
if (navigator.userAgent.indexOf('iPhone') != -1) {
        addEventListener("load", function() {
                setTimeout(hideURLbar, 0);
        }, false);
}

function hideURLbar() {
        window.scrollTo(0, 1);
}
</script>

</head>

<body>
<div data-role="page" id="main">
	<div data-role="header">
		<h1>${title}</h1>
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