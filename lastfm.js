/* LastFM testing */
VK.Widgets.Auth("vk_auth", {
    width: "200px",
    onAuth: function(data) {
    }
});

var my_mole_holes = [];
var mole_holes = [];
var user_id = 160777;
var timeout = 300;
var albums_data = [];
var unsorted_tracks = {};
var new_track = {
	artist: 'Paramore',
	id: 555
};

setTimeout(function() {
	VK.Api.call('audio.getAlbums', {
		uid: user_id,
		test_mode: 1
	}, getAlbumsCallback);
}, timeout);
	
function getAlbumsCallback(albums)
{
	if (albums.error) {
		console.log("audio.getAlbums error: " + albums.error.error_msg);
		return;
	}
	albums_data = albums.response;
	albums_data.forEach(function(user_album) {
		if(typeof(user_album.album_id) !== 'undefined'){
			var new_mole_hole = {};
			new_mole_hole.tags = [];
			new_mole_hole.name = user_album.title;
			new_mole_hole.id = user_album.album_id;
			mole_holes.push(new_mole_hole);
			setTimeout(function() {
				VK.Api.call('audio.get', {
					uid: user_id,
					album_id: user_album.album_id,
					test_mode: 1
				}, getAudioCallback);
			}, timeout);
		}
	});
	console.log(mole_holes);
}

function getAudioCallback(audio)
{
	if (audio.error) {
        console.log("audio.get error: " + audio.error.error_msg);
        return;
    }
	var mole_hole_last = mole_holes.pop();
	var album_audios = audio.response;
	album_audios.forEach(function(album_audio) {
		mole_hole_last.artists = [];
		mole_hole_last.ids = [];
		mole_hole_last.artists.push(album_audio.artist);
		mole_hole_last.ids.push(album_audio.aid);
	});
	mole_holes.push(mole_hole_last);
	
}

function getPreferedMoleHole(new_track, cb)
{
	var hole_mole_tags = [];
	var new_track_tag = '';
	
	console.log('Starting...');
/* Create a cache object */
	var cache = new LastFMCache();

	/* Create a LastFM object */
	var lastfm = new LastFM({
		apiKey    : '92e516231d0d7a0aa55790b8c2039830',
		apiSecret : 'c5661bb7c32ebea64395bd74fc41c795',
		cache     : cache
	});

	/* Looking for mole holes tags. */
	for (var i = 0; i < mole_holes.length; i++) {
		console.log(mole_holes[i].name);
		
		mole_holes[i].artists.forEach(function(artist) {
			current_mole = mole_holes[i];
			lastfm.artist.getTopTags({
					artist: artist,
					autocorrect: 1
			}, {
				success: function(data) {					
					
					// If exists
					if (current_mole.tags.indexOf(data.toptags.tag[0].name) != -1) {
						return;
					}
					
					current_mole.tags.push(data.toptags.tag[0].name);
				}, 
				error: function(code, message) {
					console.log("Error");
				}
			});
		});

	}
	
	/* Looking for new_track tags. */
	lastfm.artist.getTopTags({
		artist: new_track.artist,
		autocorrect: 1
	}, {
		success: function(data) {
			new_track_tag = data.toptags.tag[0].name;
			
			console.log("Tag is", new_track_tag, "for", new_track.artist);
			
			var hole_matched_count = 0;
			var hole_matched = {};

			/* Looking for new_track prefered mole hole. */
			mole_holes.forEach(function(mole_hole) {
				if (mole_hole.tags.indexOf(new_track_tag) != -1) {
					console.log("Tag matched " + mole_hole.name);
					hole_matched = mole_hole;
					hole_matched_count++;
				}
			});
			
			if (hole_matched_count > 1) {
				// Catch it
			} else if (hole_matched_count == 1) {
				cb(hole_matched);
			}
		}, 
		error: function(code, message) {
			console.log("Error");
		}
	});
}

function putNewTrackToAlbum(new_song, new_album_id)
{
	VK.Api.call('audio.moveToAlbum', {
    aids: new_song,
	album_id: new_album_id,
	test_mode: 1

	}, function(err) {
		if (err.error) {
			console.log("audio.getAlbums error: " + err.error.error_msg);
			return;
		}
		console.log(err.response);
});
}

function getSongsNotInAlbums()
{
	VK.Api.call('audio.get', {
		uid: user_id,
		test_mode: 1
		}, function(fb) {
			if (fb.error) {
				console.log("audio.getAlbums(all) error: " + fb.error.error_msg);
				return;
			}

			var album_audios = fb.response;
			console.log(album_audios);
			album_audios.forEach(function(album_audio) {
				VK.Api.call('audio.getById', {
					audios: user_id + '_' + album_audio.aid,
					test_mode: 1

				}, function(resp) {
					if (resp.error) {
						console.log("audio.getAlbums error: " + r.error.error_msg);
						return;
					}

					var audio_full_info = resp.response;
					console.log(audio_full_info);
					if(typeof(audio_full_info.album) === 'undefined'){ //возможно, album_id
						var unsorted_track = {};
						unsorted_track.artist = album_audio.artist;
						unsorted_track.aid = album_audio.aid;
						unsorted_tracks.push(unsorted_track);
					}
					
				});

			});
				
		});
}
//getMoleHoles();
//getPreferedMoleHole(new_track, function(new_hole) { console.log("New hole is", new_hole.name); });