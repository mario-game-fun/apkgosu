function CInterface(iMatrixSize){
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosFullscreen;
    
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oAudioToggle;
    var _oBackground;
    var _oButExit;
    var _oTextActivePl;
    var _oTextHelp;
    var _oAreYouSurePanel;
    
    this._init = function(iMatrixSize){
        _oBackground = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(_oBackground);

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.width/2) -30, y: (oSprite.height/2) + 20};         
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x: oSprite.width/4 + 10,y:(oSprite.height/2) + 10};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit={x:CANVAS_WIDTH - (oSprite.width/2) + 5,y:(oSprite.height/2) + 14};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        var szActivePl = TEXT_ACTIVEPLAYER.pt1 + s_oGame.getActivePlayer() + TEXT_ACTIVEPLAYER.pt2;
        
        _oTextActivePl = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-260, 120, 520, 60, 
                    60, "center", "#fff", PRIMARY_FONT, 1.1,
                    0, 0,
                    szActivePl,
                    true, true, false,
                    false );
                    
        _oTextActivePl.setShadow("#000",2,2,2);
		
        var szTextHelp;
        if(iMatrixSize > 3){
                szTextHelp = TEXT_FOUR_IN_ROW;
        }else{
                szTextHelp = TEXT_THREE_IN_ROW;
        }

        _oTextHelp = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-260, 940, 520, 40, 
                    40, "center", "#fff", PRIMARY_FONT, 1.1,
                    0, 0,
                    szTextHelp,
                    true, true, false,
                    false );
                    
        _oTextHelp.setShadow("#000",2,2,2);
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload();

        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
        _oButExit.setPosition(_pStartPosExit.x - iNewX,_pStartPosExit.y + iNewY);
    };

    this.update = function(){
        var szActivePl = TEXT_ACTIVEPLAYER.pt1 + s_oGame.getActivePlayer() + TEXT_ACTIVEPLAYER.pt2;

        createjs.Tween.get(_oTextActivePl.getText()).
            to({scaleX:0.1,scaleY:1.2,alpha:0.5}, 250, createjs.Ease.cubicOut).
            call(function(){
                _oTextActivePl.refreshText(szActivePl);
                createjs.Tween.get(_oTextActivePl.getText()).
                to({scaleX:1,scaleY:1,alpha:1}, 250, createjs.Ease.cubicIn);
        });
    };

    this.hideActiveText = function(){
        _oTextActivePl.visible = false;
    };

    this._onExit = function(){
        _oAreYouSurePanel = new CAreYouSurePanel(s_oInterface.onConfirmExit);
        _oAreYouSurePanel.changeMessage(TEXT_ARE_SURE);
    };
    
    this.onConfirmExit = function(){
        s_oGame.setPokiStart(false);
        s_oInterface.unload();
        s_oGame.onExit();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setActive(s_bFullscreen);
        }
    };
    
    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
            _fCancelFullScreen.call(window.document);
        }else{
            _fRequestFullScreen.call(window.document.documentElement);
        }
        
        sizeHandler();
    };
    
    s_oInterface = this;
    
    this._init(iMatrixSize);
    
    return this;
}

var s_oInterface = null;