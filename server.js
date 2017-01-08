var url = require("url"),
	request = require("request"),
	ejs = require("ejs");
	app = require("express")();
app.listen(8080);

app.set("views", __dirname);
app.set("view engine", "ejs");

const MY_IP = "91.246.112.232";

app.get("/google/feeds/for/:search", (req, response) => {
	var search = req.params.search,
	options = {
		protocol: "http",
		host: "ajax.googleapis.com",
		pathname: "/ajax/services/feed/find",
		query: {
			v: "1.0",
			userip: MY_IP,
			q: search
		}
	};
	var searchURL = url.format(options);

	request(searchURL, (err, res, body) => {
		var feeds = JSON.parse(body);
		response.render("google-search", {
			keyword: search,
			feeds: feeds.responseData
		})
	});
});

app.get("/yandex/:count/news/for/:search", (req, response) => {
	var categories = {
		"auto": "Автомобили",
		"world": "В мире",
		"internet": "Интернет",
		"sport": "Спрот",
		"index" : "Главные новости"
	};

	var count = req.params.count,
	search = req.params.search,
	name = categories[search];

	if(!(search in categories)) search = "index";

	var options = {
		protocol: "http",
		host: "ajax.googleapis.com",
		pathname: "/ajax/services/feed/load",
		query: {
			v: "1.0",
			userip: MY_IP,
			num: count,
			q: "http://news.yandex.ru/" + search + ".rss"
		}
	};

	var searchUrl = url.format(options);

	request(searchUrl, (err, res, body) => {
		var news = JSON.parse(body);
		response.render("yandex-news", {
			news: news.responseData.feed,
			count: count,
			category: name
		})
	});
});