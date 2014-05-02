var remove_derp = function (arr) {
    var i, j, cur, found;
    for (i = arr.length - 1; i >= 0; i--) {
        cur = arr[i];
        found = false;
        for (j = i - 1; !found && j >= 0; j--) {
            if (cur === arr[j]) {
                if (i !== j) {
                    arr.splice(i, 1);
                }
                found = true;
            }
        }
    }
    return arr;
};

var url = "";
var webm_list;

function DoThing()
{
	request({
			method: "GET",
			uri: url,
		},
		function (error, response, body) {
			if(!error && response.statusCode == 404)
			{
				console.log("404");

				request({
						method: "GET",
						url: "https://a.4cdn.org/jp/catalog.json",
					    headers: {
					        'User-Agent': 'request'
					    }
					},
					function (error, response, body) {
						if(!error)
						{
							var base = JSON.parse(body);
							for(var i = 0; i < 11; i++)
							{
								var threads = base[i]["threads"];
								for(var j = 0; j < threads.length; j++)
								{
									thread = threads[j];
									if(thread["sub"])
									{
										var patt = /(AKB|akb).*(G|g)eneral/g;

										if(patt.test(thread["sub"]))
										{
											url = "http://boards.4chan.org/jp/res/" + thread["no"];
											console.log(url);
										}
									}
								}
							}
						}
					}
				);
			}
			else if(!error)
			{
				var html = body;
				var pattern = /\/\/i.4cdn.org\/jp\/src\/\d*.webm/g;
				var links = html.match(pattern);
				remove_derp(links);

				if(!webm_list)
				{
					console.log("webm_list was empty, setting to links");
					webm_list = links;
				}
				else
				{
					console.log("webm_list has shit");
					if(webm_list == links)
					{
						console.log("no change");
					}
					else
					{
						var diff = links.length - webm_list.length;
						for(var x = webm_list.length; x < webm_list.length + diff; x++)
						{
							// put kit saying shit here with links[x] 
							// but have to put "http:" before the of it because
							// links are has "//derp.derp.derp/e3189382etc" 
						}
						webm_list = links;
					}
				}	
			}
			else
			{
				console.log(error);
			}
	});
}

setInterval(DoThing, 10000);