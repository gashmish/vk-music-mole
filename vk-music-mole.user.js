// ==UserScript==
// @name           vk-music-mole
// @namespace      http://files-search.com/userscripts/vk.com
// @include        http://vkontakte.ru/audio?act=edit*
// @require		   
// ==/UserScript==

//AudioEdit.mole = function () { alert("Mole!"); }

var js = 'Audio.loadAlbum(0, true);'


var audio_edit_page_text = "";
var songs = new Array();
var albums = new Array();

function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up
}

function addButton () {
	var side_panel = document.getElementById("side_panel");
	var audio_sort = document.createElement('div');

	audio_sort.setAttribute('id', 'audio_sort_album');
	audio_sort.setAttribute('class','button_blue button_wide');
	
	var button = document.createElement('button');
	button.textContent = "Generate albums";
	button.addEventListener('click', runActions, true);
	
	audio_sort.appendChild(button);
	
	side_panel.insertBefore(audio_sort, document.getElementById("audio_create_album"));
}

function xpath(query) {
    return document.evaluate(query, document, null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

function runActions() {

	songs = new Array();
	albums = new Array();
	
	//location.assign("javascript:Audio.loadAlbum(0);void(0)");

	var audio_edit_rows = xpath("//div[@class='audio_edit_row']");	
	alert("Snap len:" + audio_edit_rows.snapshotLength);
	for (var i = 0; i < audio_edit_rows.snapshotLength; i++) {
		var audio_edit_row = audio_edit_rows.snapshotItem(i);			
		if (/audio(\d+)/.test(audio_edit_row.id)) {
			songs.push(RegExp.$1);
		}
	}

	location.assign("javascript:ajax.post('/audio',{act:'save_album', audios:\"" + songs.join(',') +
	"\",hash:cur.hashes.save_album_hash, gid:cur.gid, album_id:17261233 }, " +
	"{ onFail:function(){alert('fail');}, onDone:function(){alert('done');} });void(0)");
	
	location.assign("javascript:window.location.reload();void(0)");
	
	//getAudioEditPage();
}

function getAudioEditPage() {
	GM_xmlhttpRequest({
		'method': 'GET',
		'url': "http://vkontakte.ru/audio.php?act=edit",
		'onload' : function (result) {
			audio_edit_page_text = result.responseText;
		
			getSongsList();
			getAlbumsList();
			
			location.assign("javascript:Audio.loadAlbum(0, true);void(0)");

			//Audio.loadAlbum(0, true);
			alert("OK");
		}
	});
}

function getSongsList() {

	
	
	var regex = /showEditAudioBox\((\d+)\)/gi;
	var i = 0;
	while (regex.test(audio_edit_page_text)) {
		songs[i++] = RegExp.$1;			
	}
}

function getAlbumsList() {
	var regex = /loadAlbum\((\d+)\)/gi;
	var i = 0;
	while (regex.test(audio_edit_page_text)) {
		albums[i++] = RegExp.$1;			
	}
	//albums.forEach(function(e) { alert(e); });
	
}

addButton();
