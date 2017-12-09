/**
 * HFR.js
 * 
 * compléments Javascript pour HFR. 
 * 
 * Auteurs : breizhodrome, roger21
 */
 
Array.prototype.item = function (index) {
	if (index < 0 || index >= this.length)
		return null;
	return this[index];
};

Array.prototype.indexOfItem = function (item, callback) {
	for (var i = 0; i < this.length; i++) {
		var res = false;
		if (typeof (callback) === "function") {
			res = callback (this[i], item);
			if (typeof (res) !== "boolean")
				res = false;
		}
		else
			res = (this[i] == item);
		if (res)
			return i;
	}
	return -1;
};

Array.prototype.contains = function (item, callback) {
	return this.indexOfItem (item, callback) >= 0;
};

Array.prototype.removeAt = function (index) {
	var res = this.splice (index, 1);
	if (res != null && res.length > 0)
		return res.item (0);
	return null;
}

Array.prototype.remove = function (item, callback) {
	var index = this.indexOfItem (item, callback);
	if (index < 0)
		return false;
	this.splice (index, 1);
	return true;
};
 
Array.prototype.removeAll = function (item, callback) {
	while (this.contains (item, callback)) {
		if (!this.remove (item, callback))
			return false;
	}
	return true;
} 

Element.prototype.getElementsByName = function (name) {
	var inputs = this.getElementsByTagName("input");
	var result = [];
	for (var i = 0; i < inputs.length; i++)
		if (inputs.item(i).getAttribute("name") == name)
			result.push (inputs.item(i));
	return result;
};

DataTransfer.prototype.getDataAsHTML = function() {
	return new DOMParser().parseFromString (this.getData ("text/html"), "text/html");
}

function insert_text_at_cursor (textarea, text) {
	var start = textarea.selectionStart;
	var end = textarea.selectionEnd;
	textarea.value = textarea.value.substr (0, start) + text + textarea.value.substr (end);
	textarea.setSelectionRange (start + text.length, start + text.length);
}

function dataURItoBlob(dataURI, callback) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab], { type : mimeString });
    return bb;
}

function HfrThrobber() {
	var throbber = null;
	var throbber_img = null;
	
	this.hide = function() {
		throbber_img.style.opacity = "0";
		throbber.style.opacity = "0";
	}
	
	this.display = function() {
		if(document.querySelector("div#apercu_reponse"))
			document.querySelector("div#apercu_reponse").classList.add("hfr_apercu_nope");
		throbber_img.style.display = "block";
		throbber.style.display = "block";
		throbber.style.width = document.documentElement.scrollWidth + "px";
		throbber.style.height = document.documentElement.scrollHeight + "px";
		throbber_img.style.opacity = "1";
		throbber.style.opacity = "0.8";
	}
	
	var count = 0;
	while (document.querySelector("#hfr_" + count + "_throbber") != null)
		count++;
	/*
	GM_addStyle("#hfr_" + count + "_throbber{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
			  "display:none;opacity:0;transition:opacity 0.7s ease 0s;}");
	GM_addStyle("#hfr_" + count + "_throbber_img{position:fixed;left:calc(50% - 64px);top:calc(50% - 64px);width:128px;height:128px;z-index:1002;" +
			  "display:none;opacity:0;transition:opacity 0.7s ease 0s;border:0;padding:0;}");
	GM_addStyle(".hfr_apercu_nope{display:none !important;}");
	*/
	
	var style = document.createElement ("style");
	style.textContent = "#hfr_" + count + "_throbber{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
			  "display:none;opacity:0;transition:opacity 0.7s ease 0s;}" +
			  "#hfr_" + count + "_throbber_img{position:fixed;left:calc(50% - 64px);top:calc(50% - 64px);width:128px;height:128px;z-index:1002;" +
			  "display:none;opacity:0;transition:opacity 0.7s ease 0s;border:0;padding:0;}" +
			  ".hfr_apercu_nope{display:none !important;}";
	document.head.appendChild (style);
	
	var throbber_image_url = "https://reho.st/self/30271dc1b7cac925aeabb89fa70e1e17cf5e1840.png";
	throbber_img = new Image();
	throbber_img.src = throbber_image_url;
	throbber_img.setAttribute("id", "hfr_" + count + "_throbber_img");
	throbber = document.createElement("div");
	throbber.setAttribute("id", "hfr_" + count + "_throbber");
	throbber.appendChild(throbber_img);
	throbber.addEventListener("transitionend", function() {
		if(throbber.style.opacity === "0") {
			throbber_img.style.display = "none";
			throbber.style.display = "none";
			if(document.querySelector("div#apercu_reponse"))
				document.querySelector("div#apercu_reponse").classList.remove("hfr_apercu_nope");
		}
	}, false);
	document.body.appendChild(throbber);
}

var HFR = {
	Tugudu : function (nombre) {
		console.log (nombre);
		this.truc = nombre;
	},
	Uri : function (data) {
		var link = document.createElement ("a");
		link.href = data;
		
		this.scheme = link.protocol;
		this.host = link.hostname;
		this.port = 0;
		if (link.port.length > 0)
			this.port = parseInt(link.port);
		if (this.scheme == "http:"  && this.port == 0)
			this.port = 80;
		if (this.scheme == "https:"  && this.port == 0)
			this.port = 443;
		this.username = link.username;
		this.password = link.password;
		this.path = link.pathname;
		this.parameters = {};
		if (link.search !== null && link.search.length > 0) {
			var q = link.search.substring(1);
			var p = q.split('&');
			for (var i = 0; i < p.length; i++) {
				var k = p[i].split('=')[0];
				if (p[i].indexOf('=') > 0)
					this.parameters[k] = p[i].split('=')[1];
				else
					this.parameters[k] = null;
			}
		}
		if (link.hash !== null)
			this.fragment = link.hash.substring(1);
		
		this.toString = function (b) {
			var result = this.scheme + "//";
			if (this.username != null && this.username.length > 0) {
				result += this.username;
				if (this.password != null && this.password.length > 0)
					result += (":" + this.password);
				result += "@";
			}
			result += this.host;
			if (!(this.scheme == "http:" && this.port == 80 || this.scheme == "https:" && this.port == 443))
				result += (":" + this.port);
			if (this.path != "/")
				result += this.path;
			if (b == false)
				return result;
			var search = [];
			for (var key in this.parameters) {
				search.push (key + "=" + this.parameters[key]);
			}
			if (search.length > 0)
				result += ("?" + search.join ("&"));
			if (this.fragment != null && this.fragment.toString().length > 0)
				result += ("#" + this.fragment);
			return result;
		}
	},
	Exception : function (message, error_type) {
		this.message = message;
		if (typeof (error_type) !== "undefined")
			this.type = error_type;
	},
	Response : function (xhr) {
		this.headers = {};
		var lines = xhr.getAllResponseHeaders().split ("\n");
		for (var i = 0; i < lines.length; i++) {
			var l = lines[i].trim();
			var key = l.substring (0, l.indexOf (": ")).trim();
			var val = l.substring (2 + l.indexOf (": ")).trim();
			if (key.length > 0)
				this.headers[key] = val;
		}
		this.responseText = xhr.responseText;
		if (xhr.responseType == "blob")
			this.responseBlob = xhr.response;
		this.responseHTML = new DOMParser().parseFromString(this.responseText, 'text/html');
		if (xhr.responseXML != null)
			this.responseXML = xhr.responseXML;
		else {
			try {
				this.responseXML = new DOMParser().parseFromString(this.responseText, 'text/xml');
			}
			catch (e) {
			}
		}
	},
	Request : function (method, uri) {
		this.method = method.toUpperCase();
		if (typeof (uri) === "string")
			this.uri = new HFR.Uri (uri);
		else
			this.uri = uri;
		this.xhr = new XMLHttpRequest();
		this.xhr.open (this.method, this.uri.toString (this.method == "GET" ? true : false), true);
		this.headers = {};
		this.setHeader = function (key, val) {
			this.headers[key] = val;
			this.xhr.setRequestHeader (key, val);
		};
		this.setResponseType = function (type) {
			this.xhr.responseType = type;
		};
		this.send = function (handler) {
			this.xhr.onreadystatechange = function (event) {
				if (this.readyState == 4)
					if (this.status == 200)
						handler (new HFR.Response (this));
			};
			
			if (this.method == "POST") {
				var l = document.createElement ("a");
				l.href = this.uri.toString();
				var args = "";
				if (l.search !== null && l.search.length > 0)
					args = l.search.substring (1);
				this.xhr.send (args);
			}
			else
				this.xhr.send (null);
		};
	},
	Message : function (table, cat) {
		this.pseudo = table.querySelector (".s2").textContent.trim();
		this.numreponse = parseInt (table.querySelector ("a[name]").getAttribute ("name").substring (1));
		this.cat = cat;
		this.html = table.querySelector ("#para" + this.numreponse).outerHTML;
		this.getUserProfile = function() {
			return HFR.findProfile (this.pseudo);
		};
		this.toString() = function() {
			return this.html;
		};
		this.getBBCode() = function() {
			var req = new XMLHttpRequest();
			req.open ("GET", "https://forum.hardware.fr/viewbbcode.php?config=hfr.inc&numreponse=" + this.numreponse + "&cat=" + this.cat, false);
			req.send (null);
			var doc = new DOMParser().parseFromString (req.responseText, "text/html");
			return doc.querySelector ("textarea").textContent;
		}
	},
	Page : function (uri) {
		this.uri = new HFR.Uri (uri);
		var req = new XMLHttpRequest();
		req.open ("GET", uri, false);
		req.send (null);
		var doc = new DOMParser().parseFromString (req.responseText, "text/html");
		var hop = doc.querySelector ("form[name='hop']");
		if (hop == null)
			throw new HFR.Exception ("l'url fournie n'est pas une page de messages.");
		this.post = parseInt (hop.querySelector ("[name='post']").getAttribute ("value"));
		this.cat = parseInt (hop.querySelector ("[name='cat']").getAttribute ("value"));
		this.subcat = parseInt (hop.querySelector ("[name='subcat']").getAttribute ("value"));
		this.page = parseInt (hop.querySelector ("[name='page']").getAttribute ("value"));
		this.messages = [];
		for (var i = 0; i < doc.querySelectorAll ("table.messagetable").length; i++)
			this.messages.push (new HFR.Message (doc.querySelectorAll ("table.messagetable").item (i), this.cat));
		
		this.getNextPage = function(){
			var url = "https://forum.hardware.fr/forum2.php?config=hfr.inc&cat=" + this.cat + "&subcat=" + this.subcat + "&post=" + this.post + "&page=" + (this.page + 1) + "&p=1";
			return new HFR.Page (url);
		};
		
		this.getPreviousPage = function(){
			if (this.page == 1)
				return null;
			var url = "https://forum.hardware.fr/forum2.php?config=hfr.inc&cat=" + this.cat + "&subcat=" + this.subcat + "&post=" + this.post + "&page=" + (this.page - 1) + "&p=1";
			return new HFR.Page (url);
		};
	},
	Subject : function (tr) {
		var a = tr.querySelector ("a.cCatTopic");
		this.fixed = tr.classList.contains ("ligne_sticky");
		this.title = a.textContent.trim();
		this.uri = a.getAttribute ("href");
		this.owner = tr.querySelector (".sujetCase6 > a").textContent.trim();
		this.getFirstPage = function() {
			return new HFR.Page (this.uri);
		};
		this.getOwnerProfile = function() {
			return HFR.findProfile (this.owner);
		};
	},
	CategoryPage : function (uri) {
		this.uri = uri;
		var req = new XMLHttpRequest();
		req.open ("GET", uri, false);
		req.send (null);
		var doc = new DOMParser().parseFromString (req.responseText, "text/html");
		this.cat = parseInt (doc.querySelector("input[name='cat']").getAttribute ("value"));
		if (doc.querySelector("input[name='cat']") != null)
			this.subcat = parseInt (doc.querySelector("input[name='cat']").getAttribute ("value"));
		this.page = parseInt (doc.querySelector(".fondForum1PagesHaut > td > .left > b:nth-of-type(2)").textContent.trim());
		this.havePrevious = this.page > 1;
		this.subjects = [];
		for (var i = 0; i < doc.querySelectorAll ("tr.sujet").length; i++) {
			this.subjects.push (new HFR.Subject (doc.querySelectorAll ("tr.sujet").item (i)));
		}
		
		this.getPreviousPage = function() {
			if (!this.havePrevious)
				return null;
			var prev_url = "https://forum.hardware.fr/forum1.php?cat=" + this.cat + "&page=" + (this.page + 1) + "&sondage=0&owntopic=1&subcat=";
			if (typeof (this.subcat) === "number")
				prev_url += this.subcat;
			return new HFR.CategoryPage (prev_url);
		};
		this.getNextPage = function() {
			var next_url = "https://forum.hardware.fr/forum1.php?cat=" + this.cat + "&page=" + (this.page + 1) + "&sondage=0&owntopic=1&subcat=";
			if (typeof (this.subcat) === "number")
				next_url += this.subcat;
			return new HFR.CategoryPage (next_url);
		};
	},
	SubCategory : function (a) {
		this.name = a.textContent.trim();
		this.url = a.getAttribute ("href");
		
		this.getFirstPage = function() {
			return new HFR.CategoryPage (this.url);
		};
	},
	Category : function (tr) {
		this.name = tr.querySelector (".cCatTopic").textContent.trim();
		this.url = tr.querySelector (".cCatTopic").getAttribute ("href");
		this.subcategories = [];
		for (var i = 0; i < tr.querySelectorAll (".Tableau").length; i++)
			this.subcategories.push (new HFR.SubCategory (tr.querySelectorAll (".Tableau").item (i)));
		
		this.getFirstPage = function() {
			return new HFR.CategoryPage (this.url);
		};
	},
	Smiley : function (code, url) {
		this.bb_code = "[:" + code + "]";
		this.code = code;
		this.url = url;
	},
	Profile : function (id, html) {
		this.id = id;
		var doc = null;
		if (typeof (html) !== "undefined")
			doc = new DOMParser().parseFromString (html, "text/html");
		else {
			var req = new XMLHttpRequest();
			req.open ("GET", "https://forum.hardware.fr/hfr/profil-" + id + ".htm", false);
			req.send (null);
			doc = new DOMParser().parseFromString (req.responseText, "text/html");
		}
		
		this.avatar = doc.querySelector (".avatar_center > img").getAttribute ("src");
		var smileys_img = doc.querySelectorAll (".profilCase4[rowspan='5'] > img");
		this.smileys = [];
		for (var i = 0; i < smileys_img.length; i++) {
			var code = "";
			var surl = smileys_img.item (i).getAttribute ("src");
			if (smileys_img.item (i).getAttribute ("title") == null)
				code = this.pseudo.toLowerCase();
			else
				code = smileys_img.item (i).getAttribute ("title");
			this.smileys.push (new HFR.Smiley (code, surl));
		}
		
		for (var i = 0; i < doc.querySelectorAll (".profilCase2").length; i++) {
			var case2 = doc.querySelectorAll (".profilCase2").item (i);
			var c2 = case2.textContent.trim();
			var c3 = case2.nextElementSibling.textContent.trim();
			if (c2.startsWith ("Pseudo") && c3 != "Vous n'avez pas accès à cette information")
				this.pseudo = c3;
			if (c2.startsWith ("Email") && c3 != "Vous n'avez pas accès à cette information")
				this.email = c3;
			if (c2.startsWith ("Date de naissance") && c3 != "Vous n'avez pas accès à cette information") {
				var ymd = c3.split ("à")[0].trim().split ("/")[2] + "/" +
					c3.split ("à")[0].trim().split ("/")[1] + "/" +
					c3.split ("à")[0].trim().split ("/")[0];
				this.birthday = new Date (ymd);
			}
			if (c2.startsWith ("Sexe") && c3 != "Vous n'avez pas accès à cette information")
				this.gender = c3;
			if (c2.startsWith ("Ville") && c3 != "Vous n'avez pas accès à cette information")
				this.town = c3;
			if (c2.startsWith ("Profession") && c3 != "Vous n'avez pas accès à cette information")
				this.job = c3;
			if (c2.startsWith ("Loisirs") && c3 != "Vous n'avez pas accès à cette information")
				this.hobbies = c3;
			if (c2.startsWith ("Statut") && c3 != "Vous n'avez pas accès à cette information")
				this.category = c3;
			if (c2.startsWith ("Nombre de messages") && c3 != "Vous n'avez pas accès à cette information")
				this.messagesCount = parseInt (c3);
			if (c2.startsWith ("Date du dernier message") && c3 != "Vous n'avez pas accès à cette information") {
				var ymd = c3.split ("à")[0].trim().split ("-")[2] + "-" +
					c3.split ("à")[0].trim().split ("-")[1] + "-" +
					c3.split ("à")[0].trim().split ("-")[0];
				var dt = ymd + "T" + c3.split ("à")[1].trim() + ":00";
				this.lastMessageDate = new Date (dt);
			}
			if (c2.startsWith ("Citation personnelle associée au pseudo") && c3 != "Vous n'avez pas accès à cette information")
				this.quote = c3;
			if (c2.startsWith ("Signature des messages") && c3 != "Vous n'avez pas accès à cette information")
				this.signature = c3;
		}
	},
	findProfile : function (pseudo) {
		var req = new XMLHttpRequest();
		req.open ("GET", "https://forum.hardware.fr/profilebdd.php?config=hfr.inc&pseudo=" + encodeURIComponent (pseudo), false);
		req.send (null);
		var url = req.responseURL;
		var id = req.responseURL.split ("https://forum.hardware.fr/hfr/profil-")[1].split (".htm")[0];
		if (id == null || id.length == 0)
			return null;
		return new HFR.Profile (id, req.responseText);
	},
	listCategories : function() {
		var req = new XMLHttpRequest();
		req.open ("GET", "https://forum.hardware.fr/", false);
		req.send (null);
		var array = [];
		var doc = new DOMParser().parseFromString (req.responseText, "text/html");
		for (var i = 0; i < doc.querySelectorAll ("tr.cat").length; i++)
			array.push (new HFR.Category (doc.querySelectorAll ("tr.cat").item (i)));
		return array;
	},
	findSmileys : function (query, callback) {
		var request = new HFR.Request ("GET", "https://forum.hardware.fr/message-smi-mp-aj.php?config=hfr.inc&findsmilies=" + query);
		request.send (function (response) {
			var imgs = response.responseHTML.querySelectorAll ("img");
			var array = [];
			for (var i = 0; i < imgs.length; i++) {
				var url = imgs.item (i).getAttribute ("src");
				var code = "";
				if (imgs.item (i).getAttribute ("title") == null)
					code = this.pseudo.toLowerCase();
				else
					code = imgs.item (i).getAttribute ("title");
				array.push (new HFR.Smiley (code, url));
			}
			callback (array);
		});
	},
	open : function (uri) {
		if (uri.indexOf ("https://forum.hardware.fr/forum1.php") == 0)
			return new HFR.CategoryPage (uri);
		try {
			if (uri.indexOf ("https://forum.hardware.fr/forum2.php") == 0)
				return new HFR.Page (uri);
		}
		catch (e) {
			return null;
		}
		if (uri.indexOf ("https://forum.hardware.fr/forum1f.php") == 0) {
			var req = new XMLHttpRequest();
			req.open ("GET", uri, false);
			req.send (null);
			var doc = new DOMParser().parseFromString (req.responseText, "text/html");
			var array = [];
			var subjects = doc.querySelectorAll ("tr.sujet");
			for (var i = 0; i < subjects.length; i++)
				array.push (new HFR.Subject (subjects.item (i)));
			return array;
		}
		return null;
	}
};
