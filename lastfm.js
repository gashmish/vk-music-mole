/* LastFM testing */
VK.Widgets.Auth("vk_auth", {
    width: "200px",
    onAuth: function(data) {
    }
});

var mole_holes = [];
var user_id = 160777;
var timeout = 500;
var albums_data = [];
var unsorted_tracks = [];
var isFinished = 0;
var artist_index_number = 0;
var albums_with_mole_holes_collected = 1;
var stop_mole_holes = 0;
var tags_for_mole_holes_collected = 1; //at the end it should be mole_holes*artists_in_mole_hole
/* Create a cache object */
var cache = new LastFMCache();

/* Create a LastFM object */
var lastfm = new LastFM({
	apiKey    : '92e516231d0d7a0aa55790b8c2039830',
	apiSecret : 'c5661bb7c32ebea64395bd74fc41c795',
	cache     : cache
});

sortAudio();

function getAlbumsCallback(albums)
{
	console.log("Starting get albums");
	if (albums.error) {
		//console.log("audio.getAlbums error: " + albums.error.error_msg);
		return;
	}
	
	albums_data = albums.response;
	var album_index = 1;
	
	//console.log(albums_data);
	
	var t = setInterval(function() {
	
		if (albums_data[album_index] === undefined) {
			if (albums_with_mole_holes_collected == album_index) {
				console.log("Albums were collected");
				console.log(mole_holes);
				clearInterval(t);
				
				//Continue...
				console.log("Continue");
				console.log("Getting unsorted audios");
				
				VK.Api.call('audio.get', {
				uid: user_id,
				test_mode: 1
				}, function(fb) {
					if (fb.error) {
						//console.log("audio.getAlbums(all) error: " + fb.error.error_msg);
						return;
					}

					var audios = fb.response;
					var audio_index = 0;
					var i = setInterval(function() {	
						if (audios[audio_index] === undefined) {
							console.log("Unsorted audios were found");
							console.log(unsorted_tracks);
							clearInterval(i);
							getMoleHolesTags();
							console.log("Finish");
							return;
							// console.log('Getting mole holes');

							// /* Looking for mole holes tags. */
								
							// var mole_hole_index = 0;
							// stop_mole_holes = 0;
							// var r = setInterval(function() {
								// if (mole_holes[mole_hole_index] === undefined) {
									// stop_mole_holes = 1;
									// console.log("mole_hole_index " + mole_hole_index);
									// console.log("mole_hole_index*artist_index_number " + artist_index_number*mole_hole_index);
									// console.log("tags_for_mole_holes_collected " + tags_for_mole_holes_collected);
									// clearInterval(r);
									// if (mole_hole_index*artist_index_number == tags_for_mole_holes_collected)
									// {
										// console.log('Mole holes tags were found');
										// console.log(mole_holes);
										// return;
									// }
									
									// //var unsorted_track_index = 0;
					
									// //var k = setInterval(function() {
									
									// //isFinished = 0;
										
									// //if (unsorted_tracks[unsorted_track_index] === undefined) {
									// //	console.log("Tracks were sorted");
									// //	clearInterval(k);
										// //return;
									// //}
									// //var new_album_id = 0;
									// //console.log('Looking for PreferedMoleHole');
									// //getPreferedMoleHole(unsorted_tracks[unsorted_track_index], function(new_hole) {
									// //console.log("New hole is", new_hole.name); new_album_id = new_hole.id; 
									// //console.log("New album is", new_album_id); isFinished = 1;});
									// //putNewTrackToAlbum(unsorted_tracks[unsorted_track_index].aid, new_album_id);
													
									// //if (isFinished == 1)
									// //	unsorted_track_index++;		
									// //}, timeout);
									// //return;
										
								// }
								// if (stop_mole_holes == 0)
								// {
									// getMoleHoleTags(mole_holes[mole_hole_index]);
									// mole_hole_index++;
								// }
							// }, timeout);
							//return;
						}
					
						if (audios[audio_index].album === undefined) {
							var unsorted_track = {};
							unsorted_track.artist = audios[audio_index].artist;
							unsorted_track.aid = audios[audio_index].aid;
							unsorted_tracks.push(unsorted_track);
						}
						audio_index++;
					}, timeout);		
				});
				//return;
			}
			return;
		}
		
		var new_mole_hole = {};
		new_mole_hole.tags = [];
		new_mole_hole.name = albums_data[album_index].title;
		new_mole_hole.id = albums_data[album_index].album_id;
		
		mole_holes.push(new_mole_hole);
		
			VK.Api.call('audio.get', {
				uid: user_id,
				album_id: albums_data[album_index].album_id,
				test_mode: 1
		}, getAudioCallback);
			
		
		album_index++;
	}, timeout);
	
	//console.log(mole_holes);
}

function getMoleHolesTags()
{
	console.log('Getting mole holes');

	/* Looking for mole holes tags. */
		
	var mole_hole_index = 0;
	stop_mole_holes = 0;
	var r = setInterval(function() {
		if (mole_holes[mole_hole_index] === undefined) {
			stop_mole_holes = 1;
			console.log("mole_hole_index " + mole_hole_index);
			console.log("mole_hole_index*artist_index_number " + artist_index_number*mole_hole_index);
			console.log("tags_for_mole_holes_collected " + tags_for_mole_holes_collected);
			clearInterval(r);
			if (mole_hole_index*artist_index_number == tags_for_mole_holes_collected)
			{
				console.log('Mole holes tags were found');
				console.log(mole_holes);
				return;
			}
			
			//var unsorted_track_index = 0;

			//var k = setInterval(function() {
			
			//isFinished = 0;
				
			//if (unsorted_tracks[unsorted_track_index] === undefined) {
			//	console.log("Tracks were sorted");
			//	clearInterval(k);
				//return;
			//}
			//var new_album_id = 0;
			//console.log('Looking for PreferedMoleHole');
			//getPreferedMoleHole(unsorted_tracks[unsorted_track_index], function(new_hole) {
			//console.log("New hole is", new_hole.name); new_album_id = new_hole.id; 
			//console.log("New album is", new_album_id); isFinished = 1;});
			//putNewTrackToAlbum(unsorted_tracks[unsorted_track_index].aid, new_album_id);
							
			//if (isFinished == 1)
			//	unsorted_track_index++;		
			//}, timeout);
			//return;
				
		}
		//if (stop_mole_holes == 0)
		//{
			getMoleHoleTags(mole_holes[mole_hole_index]);
		//}
		mole_hole_index++;
	}, timeout);
}

function getMoleHoleTags(an_mole_hole)
{
	var artist_index = 0;
	var hole_artist_index_number = 1;
	var halt = 0;
	var m = setInterval(function() {
	if (an_mole_hole.artists[artist_index] === undefined) {
		halt = 1;
		clearInterval(m);
		//console.log("hole_artist_index_number " + hole_artist_index_number);
		if (hole_artist_index_number == artist_index)
		{
			console.log(artist_index);
			console.log("Tags were found for mole " + an_mole_hole.name);
			return;
		}
	}
		current_mole = an_mole_hole;
		console.log(current_mole);
		lastfm.artist.getTopTags({
				artist: an_mole_hole.artists[artist_index],
				autocorrect: 1
				}, {
				success: function(data) {						
					// If exists
					var temp_tag = '';
					if(data.toptags.tag === undefined)
					{
						console.log("No tag on lastfm ");
						if (current_mole.tags.indexOf('Unsorted music') == -1)
						{
							temp_tag = 'Unsorted music';
							current_mole.tags.push(temp_tag);
							tags_for_mole_holes_collected++;
						}
						hole_artist_index_number++;
					}
					else
					{
						if(data.toptags.tag[0] === undefined)
						{
							console.log("No toptag on lastfm ");
							if (current_mole.tags.indexOf('Unsorted music') == -1)
							{
								temp_tag = 'Unsorted music';
								current_mole.tags.push(temp_tag);
								tags_for_mole_holes_collected++;
							}
							hole_artist_index_number++;
						}
						else
						{
							if (current_mole.tags.indexOf(data.toptags.tag[0].name) == -1)
							{
								console.log(data.toptags.tag[0].name);
								current_mole.tags.push(data.toptags.tag[0].name);
								tags_for_mole_holes_collected++;
							}
							hole_artist_index_number++;
						}
					}				
				}, 
				error: function(code, message) {
					//console.log("Error");
				}
			});
		artist_index++;
		artist_index_number++;
	
	}, timeout);
}

function getAudioCallback(audio)
{
	if (audio.error) {
        console.log("audio.get error: " + audio.error.error_msg);
        return;
    }
	
	var mole_hole_last = mole_holes.pop();
	mole_hole_last.artists = [];
	mole_hole_last.ids = [];
	var album_audios = audio.response;
	
	var album_audio_index = 0;
	var x = setInterval(function() {
		if (album_audios[album_audio_index] === undefined) {
			clearInterval(x);
			mole_holes.push(mole_hole_last);
			albums_with_mole_holes_collected++;
			//console.log(mole_holes);
			return;
		}
		if (mole_hole_last.artists.indexOf(album_audios[album_audio_index].artist) == -1)
			mole_hole_last.artists.push(album_audios[album_audio_index].artist);
		if (mole_hole_last.ids.indexOf(album_audios[album_audio_index].aid) == -1)	
			mole_hole_last.ids.push(album_audios[album_audio_index].aid);
		
	album_audio_index++;
	}, timeout);	
}

function getPreferedMoleHole(new_track, cb)
{
	console.log('Getting prefered mole hole');
	var new_track_tag = '';
	
	/* Looking for new_track tags. */
	lastfm.artist.getTopTags({
		artist: new_track.artist,
		autocorrect: 1
	}, {
		success: function(data) {
			if(!(data.toptags.tag === undefined))
				new_track_tag = data.toptags.tag[0].name;
			else
				new_track_tag = 'Unsorted music';

			//console.log("Tag is", new_track_tag, "for", new_track.artist);
			
			var hole_matched_count = 0;
			var hole_matched = {};

			/* Looking for new_track prefered mole hole. */
			mole_holes.forEach(function(mole_hole) {
				if (mole_hole.tags.indexOf(new_track_tag) != -1) {
					//console.log("Tag matched " + mole_hole.name);
					hole_matched = mole_hole;
					hole_matched_count++;
				}
			});
			
			if (hole_matched_count > 1) {
				// Catch it
			} else if (hole_matched_count == 1) {
				cb(hole_matched);
			} else if (hole_matched_count == 0) {
				// TODO:
			}
		}, 
		error: function(code, message) {
			//console.log("Error");
		}
	});
}

function sortAudio()
{
	setTimeout(function() {
		console.log('Starting...');
		VK.Api.call('audio.getAlbums', {
			uid: user_id,
			test_mode: 1
		}, getAlbumsCallback);
	}, timeout); 
}

function putNewTrackToAlbum(new_song, new_album_id)
{
	VK.Api.call('audio.moveToAlbum', {
    aids: new_song,
	album_id: new_album_id,
	test_mode: 1
	}, function(err) {
		if (err.error) {
			//console.log("audio.moveToAlbum error: " + err.error.error_msg);
			return;
		}
		console.log(err.response);
	});
}