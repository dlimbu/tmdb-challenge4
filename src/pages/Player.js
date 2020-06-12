// @todo: import MediaPlayer from SDK
import {Lightning, Utils, MediaPlayer} from "wpe-lightning-sdk";

export default class Player extends Lightning.Component {
    static _template() {
        return {
            /**
             * @todo:
             * - Add MediaPlayer component (that you've imported via SDK)
             * - Add a rectangle overlay with gradient color to the bottom of the screen
             * - Add A Controls:{} Wrapper that hosts the following components:
             *   - PlayPause button image (see static/mediaplayer folder)
             *   - A skip button (see static/mediaplayer folder)
             *   - Progress bar (2 rectangles?)
             *   - add duration label
             *   - add text label for currentTime
             */
            MediaPlayer: {
                type: MediaPlayer
            },
            color: 0xff00ff00,
            rect: true,
            Banner: {
                alpha: 0,
                GradientRight: {
                    rect: true,
                    y: 800,
                    w: 1920,
                    h: 300,
                    colorTop:0xfffffff,
                    colorBottom: 0xff000000,    
                },
                Controls: {
                    x: 100,
                    y: 1000,
                    rect: true,
                    PlayPause: {
                        y: -10,
                        src:  Utils.asset('/mediaPlayer/play.png'),
                    },
                    Skip: {
                        x: 50,
                        y: -10,
                        src: Utils.asset('/mediaPlayer/skip.png'),
                    },
                    ProgressBar: {
                        rect: true,
                        x: 120,
                        h: 10,
                        w: 1500,
                        Bar: {
                            PlayTime: {
                                y: -40,
                                text: {text: '', fontSize: 24, fontFace: "SourceSansPro-Regular"}
                            },
                            PlayDuration: {
                                y: -40,
                                x: 1420,
                                text: {text: '', fontSize: 24, fontFace: "SourceSansPro-Regular"}
                            },
                            rect: true,
                            color: 0xff0384fc,
                            h: 10,
                            w: 0,
                        },
              
                    }
                }
            }
        };
    }

    _init() {
        /**
         * @todo:
         * tag MediaPlayer component and set correct consumer
         */
    }

    _firstActive() {
        this.mediaPlayer = this.tag('MediaPlayer');
        this.mediaPlayer.updateSettings({consumer: this});
        this.mediaPlayer.open(this._item.streamUrl);
        this.mediaPlayer.loop = true;
        this._setState('Playing');
    }
    /**
     *@todo:
     * add focus and unfocus handlers
     * focus => show controls
     * unfocus => hide controls
     */


     _focus() {
        this.tag('Banner').setSmooth('alpha', 1, {duration: 0.3});
     }

     _unfocus() {
        this.tag('Banner').setSmooth('alpha', 0, {duration: 0.5});
     }

    /**
     * @todo:
     * When your App is in Main state, call this method
     * and play the video loop (also looped)
     * @param src
     * @param loop
     */
    play(src, loop) {
        console.log('Play called ')
        this.mediaPlayer.play();
    }

    stop() {
        console.log('Endedd')
    }

    set item(v){
        this._item = v;
    }

    /**
     * @todo:
     * - add _handleEnter() method and make sure the video Pauses
     */
    _handleEnter() {
       
    }

    _handleExit() {
        this.tag('Banner').setSmooth('alpha', 0, {duration: 0.5});
    }

    $mediaplayerLoadedData() {

    }

    $mediaplayerProgress(playTime) {
        // currentTime: 5.213712, duration: 10}
        let ratio = playTime.currentTime / playTime.duration;

        let single = (n) => {
            return parseInt(n/10, 10) == 0;
        }

        let hhmmss = (timeSec) => {
            let h = Math.floor(timeSec/3600)%24;
            let m = Math.floor(timeSec/60)%60;
            let s = Math.floor(timeSec%60);
    
            if (single(h)) {
                h = '0' + h;
            }
            if (single(m)){
                m = '0'+ m;
            } 
            if (single(s)) {
                s = '0'+ s;
            }

            return `${h} : ${m} : ${s}`;
        }

        this.tag('PlayTime').patch({
            text: {
                text: hhmmss(playTime.currentTime),
            }
        })

        this.tag('PlayDuration').patch({
            text: {
                text: hhmmss(playTime.duration),
            }
        })

        let barW = Math.min(Math.round(1500 * ratio), 1500);
        this.tag('Bar').setSmooth('w', barW, {duration: 0.005});
    }

    // this will be invoked when the video starts playing
    $mediaplayerPlay() {
        this.emit('Player:Playing');
        this.application.emit('playback:started');
        console.log('playing calledback')
        
    }

    $mediaPlayerError() {
        console.log('error ')
    }

    /**
     * This will be automatically called when the mediaplayer pause event is triggerd
     * @todo:
     * - Add this Component in a Paused state
     */
    $mediaplayerPause() {
        console.log('pause called');
    }

    $mediaplayerEnded() {
        console.log('ended called');
    }

    static _states(){
        return [
            /**
             * @todo:
             * - Add paused state
             * - on enter change the play to pause button (see static/mediaplayer folder)
             * - on _handleEnter() play the asset again
             * - reset state on play
             */
            class Paused extends this{
                $enter(){
                    this.tag("PlayPause").src = Utils.asset("mediaplayer/pause.png");
                }
                _handleEnter(){
                    this.tag("MediaPlayer").playPause();
                    this._setState('Playing');
                }
            },

            class Playing extends this{
                $enter(){
                    this.tag("PlayPause").src = Utils.asset("mediaplayer/play.png");
                }
                _handleEnter(){
                    this.tag("MediaPlayer").playPause();
                    this._setState('Paused');
                }
            }
        ]
    }
}