<pre><?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

$path = __DIR__ . '/../library';
$base = 'http://www.conwaylife.com';

scrapeCategory('http://www.conwaylife.com/wiki/Category:Still_lifes');

function scrapeCategory($url) {
	global $path;
	global $base;
	$catName = preg_replace('/^.+Category\:(.+?)(&.+|$)/', '$1', $url);
	$html = file_get_contents($url);
	if (preg_match_all('/<li><a href="([^"]+)" title="([^"]+)"/', $html, $matches, PREG_SET_ORDER)) {
		foreach ($matches as $match) {
			list(, $link, $name) = $match;
			echo "scraping $base$link<br />";
			scrapeDetail("$path/$catName/$name", "$base$link");
		}
	}
}

function scrapeDetail($toDir, $url) {
	global $path;
	global $base;
	if (!is_dir($toDir)) {
		mkdir($toDir, 0777);
	}
	$html = file_get_contents($url);
	$html = preg_replace('/^.+class="infobox"(.+)/s', '$1', $html);
	if (preg_match('~src="([^"]+/([^/]+\.png))"~', $html, $match)) {
		list (, $url, $name) = $match;
		copy("$base$url", "$toDir/$name");
		echo "copied $path$url<br />";
	}
	if (preg_match('~href="([^"]+/([^/]+\.rle))"~', $html, $match)) {
		list (, $url, $name) = $match;
		copy($url, "$toDir/$name");
		echo "copied $url<br />";
	}
}
