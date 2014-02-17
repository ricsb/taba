"use strict";

var MediaLoader = {

  imageA: [],
  soundA: [],
  nMedia: 0,
  nMediaLoaded: 0,
  
  loadListener: function(evt) {
    // 'this' in an event handler will not be MediaLoader
    MediaLoader.nMediaLoaded ++;
  },

  loadImage: function(name,url) {
    var im = new Image();
    im.addEventListener("load",MediaLoader.loadListener,false);
    im.src = url;
    this.nMedia ++;
    return im;
  },
  
  loadSound: function(name,url) {
    var so = new Audio();
    so.addEventListener("canplaythrough",MediaLoader.loadListener,false);
    so.src = url;
    this.nMedia ++;
    return so;
  },
  
  loadingComplete: function() {
    if (this.nMediaLoaded >= this.nMedia)
      return true;
    return false;
  }
};

var Mixer = {

  init : function(n) {
    this.audiochannels = [];
    this.nChannels = n;
    // prepare the channels
    for (var a=0;a<this.nChannels;a++) {	
      this.audiochannels[a] =[];
      this.audiochannels[a]['channel'] = new Audio();	
      // expected end time for this channel	  
      this.audiochannels[a]['finished'] = -1;							
    }
  },
  
  play : function(snd,volume,looping) {
	if (snd.readyState<Audio.HAVE_ENOUGH_DATA)
		return null;
    for (var a=0;a<this.audiochannels.length;a++) {
      var thistime = new Date();
      // is this channel finished?
      if (this.audiochannels[a]['finished'] < thistime.getTime()) {			
        this.audiochannels[a]['finished'] = thistime.getTime() + snd.duration*1000;
        this.audiochannels[a]['channel'].src = snd.src;
        this.audiochannels[a]['channel'].volume = volume;
        if (looping)
          this.audiochannels[a]['channel'].loop = 'loop';
        this.audiochannels[a]['channel'].load();
        this.audiochannels[a]['channel'].play();
        return this.audiochannels[a]['channel']
      }
    }
    return null;
  }
};
  
    