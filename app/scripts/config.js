/**
 * # config
 *
 * Some settings
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

module.exports = {

	/**
	 * @type {String}
	 */
	storage: 'STITCHES',

	/**
	 * @type {Object}
	 */
	settings: {
		// default stylesheet class prefix
		prefix: 'sprite',

		// default padding around sprites in pixels
		padding: 5,

		// whether or not to include the data-uri image (quite large)
		uri: false,

		// either css or less at the moment
		stylesheet: 'css',

		// initial canvas dimensions
		canvas: {
			layout: 'compact',
			width: 100,
			height: 100
		},

		// max passes for sprite placement
		tries: 5
	},

	/**
	 * @type {Object}
	 */
	events: {
		// open the about palette
		about: 'ABOUT',

		// open the downloads palette
		downloads: 'DOWNLOADS',

		// open the properties palette
		properties: 'PROPERTIES',

		// open the settings palette
		settings: 'SETTINGS',

		// close a palette or all palettes
		close: 'CLOSE',

		// show the overlay
		busy: 'BUSY',

		// hide the overlay
		idle: 'IDLE',

		// display progress percentage
		progress: 'PROGRESS',

		// process submitted files into sprites
		process: 'PROCESS',

		// place sprites onto sprite sheet
		stitch: 'STITCH',

		// generate final products
		generate: 'GENERATE',

		// any kind of error
		error: 'ERROR'
	}

};