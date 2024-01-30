var localCache = {
	/**
	* timeout for cache in millis
	* @type {number}
	*/
	timeout: 1000*60*60,
	/**
	* @type {{_: number, data: {}}}
	**/
	data: {},
	remove: function (url, dataStore) {
		dataStore.removeItem(url);
	},
	exist: function (url, dataStore) {
		console.log('Existing in cache for url ' + url);
		if ( dataStore.getItem( url ) ) console.log( ( (new Date().getTime() - dataStore.getItem( url )._) < localCache.timeout) );
		return dataStore.getItem( url ); // && ((new Date().getTime() - dataStore.getItem( url )._) < localCache.timeout);
	},
	get: function (url, dataStore) {
		console.log('Getting in cache for url ' + url);
		return JSON.parse( dataStore.getItem( url ) ).data;
	},
	set: function (url, cachedData, dataStore, callback) {
		dataStore.removeItem( url );
		dataStore.setItem( url, JSON.stringify( {
			_: new Date().getTime(),
			data: cachedData
		}));
		if (jQuery.isFunction(callback)) callback(cachedData);
	}
};

jQuery.ajaxPrefilter(function (options, originalOptions, jqXHR, a) {

	if ( ! window.localStorage ) return true;
	if ( options.data === undefined ) return true;
	
	if (
		options.data.indexOf("action=moove_gdpr_get_scripts") === -1 &&
	 	options.data.indexOf("action=moove_gdpr_localize_scripts") === -1 &&
		options.data.indexOf("action=moove_gdpr_remove_php_cookies") === -1
		)
 	return true;

	console.log( 35, options, originalOptions, jqXHR, a );

	var dataStore = window.localStorage;

	if ( options.cache && dataStore ) {
		options.cache = false;
	}

	if ( dataStore ){


		var complete = originalOptions.complete || jQuery.noop,
		url = originalOptions.url;

		//remove jQuery cache as we have our own localCache
		var action;

		if ( options.data.indexOf("action=moove_gdpr_remove_php_cookies") > -1 ){
			console.log( 'reset' );
			dataStore.removeItem('moove_gdpr_get_scripts');
			dataStore.removeItem('moove_gdpr_localize_scripts');
			return true;
		}

		action = options.data.indexOf("action=moove_gdpr_get_scripts") > -1 ? 'moove_gdpr_get_scripts' : 'moove_gdpr_localize_scripts';



		options.beforeSend = function () {
			console.log( 'checking checking', action );
			if (localCache.exist(action,dataStore )) {
				console.log( 'found' );
				complete(localCache.get(action,dataStore));
				return false;
			}
			console.log( 'not found' );
			return true;
		};
		options.complete = function (data, textStatus) {
			console.log( 'setting', action, data, textStatus );
			localCache.set(action, data, dataStore, complete);
		};
	}

});
