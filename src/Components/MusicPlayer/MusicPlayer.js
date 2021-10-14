import React, { Component } from 'react';
import './MusicPlayer.css';

//icons
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import ReplayIcon from '@mui/icons-material/Replay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PauseIcon from '@mui/icons-material/Pause';

// api

import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SliderMui from '../slider/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';

import getMusic from '../../api/getMusic';

// DEV
function secondsToHms(seconds) {
  if (!seconds) return '00m 00s'

  let duration = seconds
  let hours = duration / 3600
  duration = duration % 3600

  let min = parseInt(duration / 60)
  duration = duration % 60

  let sec = parseInt(duration)

  if (sec < 10) {
    sec = `0${sec}`
  }
  if (min < 10) {
    min = `0${min}`
  }

  if (parseInt(hours, 10) > 0) {
    return `${parseInt(hours, 10)}h ${min}m ${sec}s`
  } else if (min == 0) {
    return `00m ${sec}s`
  } else {
    return `${min}m ${sec}s`
  }
}
function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{secondsToHms(props.duration)}</Typography>
      </Box>
    </Box>
  );
}
class MusicPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      musicIndex: 0,
      loadedDataMusic: false,
      play: false,
      audio: new Audio(),
      data: [],
      firstLog: false,
      reload: false,
      duration: 0,
      timePlayed: 0,
      volume: 100,
    }
    this.myRef = React.createRef()
    this.killAudio = this.killAudio.bind(this);
    this.UpIndex = this.UpIndex.bind(this);
    this.DownIndex = this.DownIndex.bind(this);
    this.loop = this.loop.bind(this);
    this.PlayMusic = this.PlayMusic.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.TrackChangeMusic = this.TrackChangeMusic.bind(this);
  }
  componentDidMount() {
    getMusic().then(
      result => this.setState({
        data: result,
        firstLog: true,
      }, () => {
        this.state.audio.setAttribute('src', result[this.state.musicIndex]['mp3'])
        this.state.audio.addEventListener('loadedmetadata', (e) => {
          this.setState({
            duration: e.target.duration
          })
        });
      })
    )
  }
  TrackChangeMusic(e) {
    let x = 0;
    this.state.data.map(
      row => {
        if (row.MusicID === e - 1) {
          x = row.MusicID
        }
      }
    )
    this.killAudio(x)
  }
  killAudio(x) {
    console.log(x)
    this.state.audio.pause()
    this.setState({
      play: true,
      musicIndex: x,
    }, () => {
      console.log(this.state.audio)
      this.state.audio.setAttribute('src', this.state.data[this.state.musicIndex]['mp3'])
      this.state.audio.play()
    })
  }
  UpIndex() {
    let x = this.state.musicIndex + 1;
    if (x < this.state.data.length) {
      this.killAudio(x)
    }
  }
  DownIndex() {
    let x = this.state.musicIndex - 1;
    if (x >= 0) {
      this.killAudio(x)
    }
  }
  loop() {
    this.state.audio.loop = true
  }
  PlayMusic(state) {
    if (state === 'play') {
      this.state.audio.play();
      this.setState({
        play: true
      })
    } else if (state === 'pause') {
      this.state.audio.pause();
      this.setState({
        play: false
      })
    }
  }
  handleChange(e) {
    this.setState({
      volume: e.target.value,
    })
  }
  onChange(e) {
    var x = (this.state.audio.duration / 100) * e.target.value
    this.state.audio.currentTime = x
    this.setState({
      timePlayed: x
    })
  }
  render() {
    setTimeout(() => {
      if (this.state.play) {
        this.setState({
          timePlayed: this.state.audio.currentTime
        })
      }
    }, 500);
    if (this.state.firstLog) {
      if (this.state.play === true) {
        this.state.audio.play()
      } else {
        this.state.audio.pause()
      }
    }
    this.state.audio.volume = this.state.volume / 100
    return (
      <div>
        <div className="player">
          <div className="musicInfos">
            <div className="picturesPlayer" style={{
              backgroundImage: this.state.data[this.state.musicIndex] && `url(${this.state.data[this.state.musicIndex]['Pictures']})`
            }}>
            </div>
            <div className="nameSong">
              <h5>
                {
                  this.state.data[this.state.musicIndex]
                  && this.state.data[this.state.musicIndex]['Titre']
                }
              </h5>
            </div>
          </div>

          <div className="ContentPlayer">

            <div className="indicatorPlayer">
              <ReplayIcon onClick={this.loop} />
              <SkipPreviousIcon
                onClick={this.DownIndex}
                style={{
                  color: this.state.musicIndex - 1 < 0 && '#F8F8F8'
                }} />
              {
                !this.state.play
                  ? <PlayArrowIcon onClick={() => { this.PlayMusic('play') }} />
                  : <PauseIcon onClick={() => { this.PlayMusic('pause') }} />
              }
              <SkipNextIcon onClick={this.UpIndex}
                style={{
                  color: this.state.musicIndex + 1 > this.state.data.length - 1 && '#F8F8F8'
                }} />


            </div>
            <div className="ProgressBarPlayer">
              <SliderMui percentage={this.state.timePlayed / this.state.duration * 100} onChange={this.onChange} />
            </div>
          </div>
          <div className="volumeSlider">
            <Box sx={{ width: '100%' }}>
              <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                {
                  this.state.volume > 0
                    ? <VolumeDown />
                    : <VolumeOffIcon />
                }

                <Slider aria-label="Volume" value={this.state.volume} onChange={this.handleChange} />
                <VolumeUp />
              </Stack>
            </Box>
            <SkipNextIcon onClick={this.UpIndex}
              style={{
                color: this.state.musicIndex + 1 > this.state.data.length - 1 && '#F8F8F8'
              }} />
          </div>
        </div>
        <div className="ListOfTracks">
          {
            this.state.data.length > 0
            && this.state.data.map(
              row =>
                <div className="Tracks" key={row.MusicID} onClick={() => { this.TrackChangeMusic(row.MusicID) }}>
                  <img src={row.Pictures} />
                  <h5>{row.Titre}</h5>
                  <h5>{row.Auteur}</h5>
                  <h5>{row.Genre}</h5>
                </div>
            )
          }
        </div>
      </div >
    )
  }
}




//  MusicPlayer(){
//

// }
export default MusicPlayer;