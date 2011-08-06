// ==UserScript==
// @name           vk-music-mole
// @namespace      http://files-search.com/userscripts/vk.com
// @include        http://vkontakte.ru/audio?act=edit*
// @require		   
// ==/UserScript==

var	songs = new Array();
var albums = new Array();
var tags = new Array();

var artists = {};
var audio_edit_page_text = "";
var folders = {};

window.addEventListener("load", function() { addButton(); }, false);

function addButton () {
	var side_panel = document.getElementById("side_panel");
	var audio_sort = document.createElement('div');

	audio_sort.setAttribute('id', 'audio_sort_album');
	audio_sort.setAttribute('class','button_blue button_wide');
	
	var button = document.createElement('button');
	button.textContent = "Generate albums";
	button.addEventListener('click', getSongs, true);
	
	audio_sort.appendChild(button);
	
	side_panel.insertBefore(audio_sort, document.getElementById("audio_create_album"));
}



function getSongs() {
	songs = new Array();
	albums = new Array();
	tags = new Array();
	artists = {};
		
	GM_xmlhttpRequest({
		'method': 'GET',
		'url': "http://vkontakte.ru/audio.php?act=edit",
		'onload' : function (result) {
			audio_edit_page_text = result.responseText;
			
			// get songs			
			var regex = /performer(\d+)\">(.*)<\/b>/gi;
			var i = 0
			while (regex.test(audio_edit_page_text) && i < 3) {
				var song_id = RegExp.$1;
				songs.push(song_id);
				artists[song_id] = RegExp.$2;
				i++;
			}
			
			// get albums			
			regex = /album(\d+)\"/gi;
			while (regex.test(audio_edit_page_text)) {
				var album_id = RegExp.$1;
				if (album_id != 0) {
					albums.push(RegExp.$1);	
				}
			}
			
			// remove albums
			/*albums.forEach(function (album_id) {
				deleteAlbum(album_id);
				alert("album id: " + album_id + "deleted");
			});*/
			
			// get tags
			songs.forEach(function (song_id) {
				alert("song id: " + song_id + ", art: " + artists[song_id]);
				getAudioTag(song_id);
			});
			
			saveAlbums();
		}
	});
}

function saveAlbums() {
	tags.forEach(function (tag) {
		
		saveAlbum(tag, folders[tag].join(','));
	});
	location.assign("javascript:window.location.reload();void(0)");
}


function contains(a, obj) {
	for(var i = 0; i < a.length; i++) {
		if(a[i] === obj){
			return true;
		}
	}
	return false;
};

function getAudioTag(song_id) {
	GM_xmlhttpRequest({
		'method': 'GET',
		'url': "http://ws.audioscrobbler.com/2.0/?artist=" + artists[song_id] + "&autocorrect=1&method=artist.getTopTags&api_key=92e516231d0d7a0aa55790b8c2039830&format=json",
		'onload' : function (json) {
			var result = eval("(" + json.responseText + ')');			
			var tag = result.toptags.tag[0].name;
			
			if (!contains(tags, tag)) {
				tags.push(tag);
				folders[tag] = new Array();
				alert("New Tag: " + tag);
			}
			
			folders[tag].push(song_id);			
		}
	});
}

function deleteAlbum(album_id) {
	location.assign("javascript:ajax.post('/audio',{act:'delete_album', album_id:" + album_id +
	", hash:cur.hashes.delete_album_hash, gid:cur.gid}, " +
	"{ onFail:function(){alert('fail');}, onDone:function(){} });void(0)");
}

function saveAlbum(tag, songs) {

	alert("Save tag: " + tag + ", songs " + songs);
	
	location.assign("javascript:ajax.post('/audio',{act:'save_album', audios:\"" + songs +
	"\",hash:cur.hashes.save_album_hash, gid:cur.gid, name: " + tag + " }, " + 
	"{ onFail:function(){alert('fail');}, onDone:function(){allert('DONE!')} });void(0)");
	alert("trace");
}

//addButton();

// delete this

