import React from 'react';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import Tooltip from 'component/common/tooltip';
import { stopContextMenu } from 'util/context-menu';
import butterchurn from 'butterchurn';
import detectButterchurnSupport from 'butterchurn/lib/isSupported.min';
import butterchurnPresets from 'butterchurn-presets';
import jsmediatags from 'jsmediatags/dist/jsmediatags';
import WaveSurfer from 'wavesurfer.js';

import styles from './audioViewer.module.scss';

const isButterchurnSupported = detectButterchurnSupport();

const EQ_BANDS_SIMPLE = [55, 150, 250, 400, 500, 1000, 2000, 4000, 8000, 16000];
/*
const EQ_LOWSHELF = EQ_BANDS_SIMPLE.shift();
const EQ_HIGHSHELF = EQ_BANDS_SIMPLE.pop();

const eqFilters = EQ.map(function(band) {
            var filter = wavesurfer.backend.ac.createBiquadFilter();
            filter.type = 'peaking';
            filter.gain.value = 0;
            filter.Q.value = 1;
            filter.frequency.value = band.f;
            return filter;
        });
*/

// type Props = {
//   source: {
//     downloadPath: string,
//     fileName: string,
//   },
//   contentType: string,
//   poster?: string,
//   claim: StreamClaim,
// };

const presets = [
  require('butterchurn-presets/presets/converted/Flexi - when monopolies were the future [simple warp + non-reactive moebius].json'),
  require('butterchurn-presets/presets/converted/Rovastar & Loadus - FractalDrop (Active Sparks Mix).json'),
  require('butterchurn-presets/presets/converted/shifter - tumbling cubes (ripples).json'),
  require('butterchurn-presets/presets/converted/ORB - Blue Emotion.json'),
  require('butterchurn-presets/presets/converted/shifter - urchin mod.json'),
  require('butterchurn-presets/presets/converted/Stahlregen & fishbrain + flexi + geiss - The Machine that conquered the Aether.json'),
  require('butterchurn-presets/presets/converted/Zylot - Crosshair Dimension (Light of Ages).json'),
];

class AudioVideoViewer extends React.PureComponent {
  // audioNode: ?HTMLAudioElement;
  // player: ?{ dispose: () => void };

  state = {
    playing: false,
    enableMilkdrop: isButterchurnSupported,
    showEqualizer: false,
    showSongDetails: true,
    enableArt: true,
    artLoaded: false,
    artist: null,
    title: null,
    album: null,
  };

  componentDidMount() {
    const me = this;
    const { contentType, poster, claim } = me.props;

    const path = `https://api.lbry.tv/content/claims/${claim.name}/${claim.claim_id}/stream.mp4`;
    const sources = [
      {
        src: path,
        type: contentType,
      },
    ];

    const audioNode = this.audioNode;

    audioNode.crossOrigin = 'anonymous';

    const canvasHeight = me.canvasNode.offsetHeight;
    const canvasWidth = me.canvasNode.offsetWidth;

    // Required for canvas, nuance of rendering
    me.canvasNode.height = canvasHeight;
    me.canvasNode.width = canvasWidth;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    const audioSource = audioContext.createMediaElementSource(audioNode);
    audioSource.connect(audioContext.destination);

    if (isButterchurnSupported) {
      const visualizer = (me.visualizer = butterchurn.createVisualizer(
        audioContext,
        me.canvasNode,
        {
          height: canvasHeight,
          width: canvasWidth,
          pixelRatio: window.devicePixelRatio || 1,
          textureRatio: 1,
        }
      ));

      visualizer.connectAudio(audioSource);
      visualizer.loadPreset(presets[Math.floor(Math.random() * presets.length)], 2.0);

      me._frameCycle = () => {
        requestAnimationFrame(me._frameCycle);

        if (me.state.enableMilkdrop === true) {
          visualizer.render();
        }
      };
      me._frameCycle();
    }

    const wavesurfer = WaveSurfer.create({
      barWidth: 3,
      container: this.waveNode,
      waveColor: '#000',
      progressColor: '#fff',
      mediaControls: true,
      responsive: true,
      normalize: true,
      backend: 'MediaElement',
      minPxPerSec: 100,
      height: this.waveNode.offsetHeight,
    });

    wavesurfer.load(audioNode);

    jsmediatags.Config.setDisallowedXhrHeaders(['If-Modified-Since', 'Range']);
    jsmediatags.read(path, {
      onSuccess: function(result) {
        const { album, artist, title, picture } = result.tags;

        if (picture) {
          const byteArray = new Uint8Array(picture.data);
          const blob = new Blob([byteArray], { type: picture.type });
          const albumArtUrl = URL.createObjectURL(blob);
          me.artNode.src = albumArtUrl;

          me.setState({ artLoaded: true });
        }

        me.setState({
          album,
          artist,
          title,
        });
      },
      onError: function(error) {
        console.log(':(', error.type, error.info);
      },
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }

    // Kill the render loop
    this._frameCycle = () => {};
  }

  render() {
    const me = this;
    const { contentType, poster, claim } = me.props;
    const {
      album,
      artist,
      title,
      enableMilkdrop,
      showEqualizer,
      showSongDetails,
      enableArt,
      artLoaded,
      playing,
      userActive,
    } = this.state;

    const renderArt = enableArt && artLoaded;

    const path = `https://api.lbry.tv/content/claims/${claim.name}/${claim.claim_id}/stream.mp4`;

    const playButton = (
      <div
        onClick={() => {
          const audioNode = this.audioNode;
          if (audioNode.paused) {
            audioNode.play();
          } else {
            audioNode.pause();
          }
        }}
        className={playing ? styles.playButtonPause : styles.playButtonPlay}
      />
    );

    return (
      <div
        className={userActive ? styles.userActive : styles.wrapper}
        onMouseEnter={() => me.setState({ userActive: true })}
        onMouseLeave={() => me.setState({ userActive: false })}
        onContextMenu={stopContextMenu}
      >
        <div className={enableMilkdrop ? styles.containerWithMilkdrop : styles.container}>
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            <Tooltip onComponent body={__('Toggle Visualizer')}>
              <Button
                icon={enableMilkdrop ? ICONS.VISUALIZER_ON : ICONS.VISUALIZER_OFF}
                onClick={() => {
                  if (!isButterchurnSupported) {
                    return;
                  }

                  // Get new preset
                  this.visualizer.loadPreset(
                    presets[Math.floor(Math.random() * presets.length)],
                    2.0
                  );

                  this.setState({ enableMilkdrop: !enableMilkdrop });
                }}
              />
            </Tooltip>
            <Tooltip onComponent body={__('Toggle Album Art')}>
              <Button
                icon={enableArt ? ICONS.MUSIC_ART_ON : ICONS.MUSIC_ART_OFF}
                onClick={() => this.setState({ enableArt: !enableArt })}
              />
            </Tooltip>
            <Tooltip onComponent body={__('Toggle Details')}>
              <Button
                icon={showSongDetails ? ICONS.MUSIC_DETAILS_ON : ICONS.MUSIC_DETAILS_OFF}
                onClick={() => this.setState({ showSongDetails: !showSongDetails })}
              />
            </Tooltip>
            <Tooltip onComponent body={__('Equalizer')}>
              <Button
                icon={ICONS.MUSIC_EQUALIZER}
                onClick={() => this.setState({ showEqualizer: !showEqualizer })}
              />
            </Tooltip>
          </div>
          <div ref={node => (this.waveNode = node)} className={styles.wave} />
          <div className={styles.infoContainer}>
            <div className={renderArt ? styles.infoArtContainer : styles.infoArtContainerHidden}>
              <img className={styles.infoArtImage} ref={node => (this.artNode = node)} />
              {renderArt && playButton}
            </div>
            <div
              className={
                showSongDetails
                  ? renderArt
                    ? styles.songDetailsContainer
                    : styles.songDetailsContainerNoArt
                  : styles.songDetailsContainerHidden
              }
            >
              <div className={renderArt ? styles.songDetails : styles.songDetailsNoArt}>
                {artist && (
                  <div className={styles.detailsLineArtist}>
                    <Button icon={ICONS.MUSIC_ARTIST} className={styles.detailsIconArtist} />
                    {artist}
                  </div>
                )}
                {title && (
                  <div className={styles.detailsLineSong}>
                    <Button icon={ICONS.MUSIC_SONG} className={styles.detailsIconSong} />
                    {title}
                  </div>
                )}
                {album && (
                  <div className={styles.detailsLineAlbum}>
                    <Button icon={ICONS.MUSIC_ALBUM} className={styles.detailsIconAlbum} />
                    {album}
                  </div>
                )}
              </div>
            </div>
          </div>
          {!renderArt && <div className={styles.playButtonDetachedContainer}>{playButton}</div>}
        </div>
        <canvas
          ref={node => (this.canvasNode = node)}
          className={enableMilkdrop ? styles.milkdrop : styles.milkdropDisabled}
        />
        <audio
          ref={node => (this.audioNode = node)}
          src={path}
          style={{ position: 'absolute', top: '-100px' }}
          onPlay={() => this.setState({ playing: true })}
          onPause={() => this.setState({ playing: false })}
        />
      </div>
    );
  }
}

export default AudioVideoViewer;
