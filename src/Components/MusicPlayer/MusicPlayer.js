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

import getMusic from '../../api/getMusic';

// DEV

class MusicPlayer extends Component{
  constructor(props) {
    super(props);
    this.state = {
      musicIndex : 0,
      loadedDataMusic : false,
      play : false,
      audio : [],
      data : []
    }
    this.killAudio = this.killAudio.bind(this);
    this.UpIndex = this.UpIndex.bind(this);
    this.DownIndex = this.DownIndex.bind(this);
    this.loop = this.loop.bind(this);
    this.PlayMusic = this.PlayMusic.bind(this);
  }
  componentDidMount(){
    getMusic().then(
      result => this.setState({
        data : result,
        audio : new Audio(result[0]["mp3"])
      })
    )
  }
   killAudio(x){
     this.state.audio.pause()
     this.setState({
       musicIndex : x,
       play : true,
       audio : new Audio(this.state.data[x]["mp3"])
     })
  }
   UpIndex(){
    let x = this.state.musicIndex + 1;
    if (x < this.state.data.length) {
      this.killAudio(x)
    }
  }
   DownIndex(){
    let x = this.state.musicIndex - 1;
    if (x >= 0){
      this.killAudio(x)
    }
  }
   loop(){
    this.state.audio.loop = true
  }
   PlayMusic(state){
    if (state === 'play') {
      this.state.audio.play();
      this.setState({
        play : true
      })
    } else if (state === 'pause') {
      this.state.audio.pause();
      this.setState({
        play : false
      })
    }
  }
  render(){
    console.log(this.state.data)
    if (this.state.play === true) {
      this.state.audio.play()
    }
    return (
      <div className="player">
        <div className="picturesPlayer">
          <div className="NameSong">
            <h5>
            {
              this.state.data[this.state.musicIndex]
              && this.state.data[this.state.musicIndex]['Titre']
            }
            </h5>
          </div>
        </div>
        <div className="ContentPlayer">
          <div className="ProgressBarPlayer">
          </div>
          <div className="indicatorPlayer">
            <ReplayIcon onClick={this.loop}/>
            <SkipPreviousIcon
              onClick={this.DownIndex}/>
            {
              !this.state.play
              ? <PlayArrowIcon onClick={() => {this.PlayMusic('play')}}/>
            : <PauseIcon onClick={() => {this.PlayMusic('pause')}}/>
            }

            <VolumeUpIcon/>
            <SkipNextIcon onClick={this.UpIndex}/>
          </div>
        </div>
      </div>
    )
  }
}




//  MusicPlayer(){
//

// }
export default MusicPlayer;
