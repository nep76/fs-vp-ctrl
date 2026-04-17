// fb-vp-ctrl.js

let g_video = undefined;
let g_autoplay = false;

window.addEventListener( "keydown", ( e ) => {
    if( e.key == "ArrowRight" || e.key == "ArrowLeft" ){
        // Shiftキーを押していたら、FileBrowser本来の挙動（次/前）を許す
        if( ! g_video || ! g_video.isConnected || ! g_video.dataset.fbvpctrlIsApply || e.shiftKey ) return;

        // FileBrowserをだまらせる
        e.preventDefault();
        e.stopImmediatePropagation();

        g_video.currentTime += ( e.key == "ArrowRight" ? 5 : -5 );
    }

    if(
        ( e.key == " " || e.key == "Spacebar" ) ||
        ( e.key == "Process" && ( e.code == "Space" || e.keyCode == 32 ) )
    ) {
        if( ! g_video || ! g_video.isConnected ) return;

        e.preventDefault();
        e.stopImmediatePropagation();
        
        if( g_video.paused ) {
            g_video.play();
        } else{
            g_video.pause();
        }
    }
}, true);


new MutationObserver ( () => {
    g_video = document.querySelector( "video" );
    if( g_video && ! g_video.dataset.fbvpctrlIsApply ){
        g_video.dataset.fbvpctrlIsApply = "true";
        g_video.addEventListener( "loadedmetadata", async function(){
            const user_volume = localStorage.getItem( "LastVolume" ) || "1.0";
            this.volume = parseFloat( user_volume );

            if( g_autoplay ){
                await this.play();
                g_autoplay = false;
            }
        } );

        g_video.addEventListener( "volumechange", function(){
            localStorage.setItem( "LastVolume", this.volume );
        } );
        
        g_video.addEventListener("ended", function() {
            g_autoplay = true;
            window.dispatchEvent( new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                keyCode: 39,
                bubbles: true,
                cancelable: true,
                shiftKey: true
            }) );
        } );
    }
} ).observe( document.body, { childList: true, subtree: true } );
