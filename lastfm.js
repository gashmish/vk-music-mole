/* LastFM testing */

var mole_holes = [];
mole_holes[0] = {};
mole_holes[0].artists = ['Green Day', 'Simple Plan', 'Korn', 'Pendulum'];
mole_holes[0].name = 'stuff';
mole_holes[0].tags = [];

var new_track = {
	artist: 'Paramore'
};

function getPreferedMoleHole(new_track, cb)
{
	var hole_mole_tags = [];
	var new_track_tag = '';
	//var tag = '';
	
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
		
		//mole_holes[i].tags.push(tag);
		//console.log(tag);
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

getPreferedMoleHole(new_track, function(new_hole) { console.log("New hole is", new_hole.name); });