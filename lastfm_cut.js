/* LastFM tagger */
/* //For test
var new_tracks = [];
new_tracks[0] = {
	artist: 'Paramore',
	id: 555,
	tag: ''
};
new_tracks[1] = {
	artist: 'Khuy',
	id: 544,
	tag: ''
};*/

function getTags(tracks)
{
	//console.log('Starting...');
/* Create a cache object */
	var cache = new LastFMCache();

	/* Create a LastFM object */
	var lastfm = new LastFM({
		apiKey    : '92e516231d0d7a0aa55790b8c2039830',
		apiSecret : 'c5661bb7c32ebea64395bd74fc41c795',
		cache     : cache
	});
	tracks.forEach(function(track) {
	/* Looking for tags. */
	lastfm.artist.getTopTags({
		artist: track.artist,
		autocorrect: 1
	}, {
		success: function(data) {
			if(typeof(data.toptags.tag) !== 'undefined')
				track.tag = data.toptags.tag[0].name;
			else
				track.tag = 'Unsorted music';
		}, 
		error: function(code, message) {
			track.tag = 'Unsorted music';
		}
	});
	});
}
//getTags(new_tracks); //For test 
//console.log(new_tracks);