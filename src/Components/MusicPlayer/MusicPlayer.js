import React, { Component } from 'react';
import './MusicPlayer.css';

//icons
import VolumeUp from '../icons/VolumeUppIcon.svg';
import VolumeOffIcon from '../icons/VolumeDownIcon.svg';
import VolumeDown from '../icons/VolumeOffIcon.svg';
import ReplayIcon from '../icons/loop.svg';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '../icons/next.svg';
import SkipPreviousIcon from '../icons/previous.svg';
import PlayIcon from '../icons/play.svg';
import PauseIcon from '../icons/pause.svg';
import BlankIcon from '../icons/blank.png';


import LoopIcon from '@mui/icons-material/Loop';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';



import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SliderMui from '../slider/Slider';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';

// api
import getMusic from '../../api/getMusic';
import searchSongs from '../../api/searchSongs';
import getFavUser from '../../api/getFavUser';
import addFavUser from '../../api/addFavUser';
import deleteFavUser from '../../api/deleteFavUser';

import { TOKEN_KEY, logout } from "../../utils";

import { withRouter } from 'react-router-dom';

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
      loadedDataMusic: false,
      play: false,
      audio: new Audio(),
      data: [],
      firstLog: false,
      reload: false,
      volume: 100,
      load : false,

      currentmp3: '',
      currentPictures: '',
      currentMusicId: '',
      currentAlbum: '',
      currentAuteur: '',
      currentGenre: '',
      currentTitre: '',
      currentDuration: 0,
      currentPlayed: 0,
      currentMusicIndex: 0,
      currentSongEnd : false,
      currentFavorite : false,
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
    this.searchTracks = this.searchTracks.bind(this);
    this.GetFavMusicUser = this.GetFavMusicUser.bind(this);
    this.addFav = this.addFav.bind(this);
    this.deleteFav = this.deleteFav.bind(this);
  }
  componentDidMount() {
    this.state.audio.pause()
    getMusic().then(
      result => {
        this.setState({
          data : result
        })
    })
    .then(
      getFavUser(localStorage.getItem(TOKEN_KEY)).then(
        fav => {
          fav.map(
            rowfav => {
              this.state.data.map(
                x => {
                  if (x['favorite'] === false || x['favorite'] === undefined ){
                    if(x['MusicID'] === rowfav['MusicID']){
                      x['favorite'] = true
                    } else {
                      x['favorite'] = false
                    }
                  }
                }
              )
            }
          )
          this.setState({
            firstLog: true,
            currentmp3: this.state.data[this.state.currentMusicIndex]['mp3'],
            currentPictures: this.state.data[this.state.currentMusicIndex]['Pictures'],
            currentMusicId: this.state.data[this.state.currentMusicIndex]['MusicID'],
            currentAlbum: this.state.data[this.state.currentMusicIndex]['Album'],
            currentAuteur: this.state.data[this.state.currentMusicIndex]['Auteur'],
            currentGenre: this.state.data[this.state.currentMusicIndex]['Genre'],
            currentTitre: this.state.data[this.state.currentMusicIndex]['Titre'],
            currentFavorite : this.state.data[this.state.currentMusicIndex]['favorite'],
            currentSongEnd : false,
            audio: new Audio(this.state.data[this.state.currentMusicIndex]['mp3']),
            currentLoop : false,
          }, () => {
            this.state.audio.addEventListener('loadedmetadata', (e) => {
              this.setState({
                currentDuration: e.target.duration
              })
            })
            this.state.audio.addEventListener('ended', (e) => {
              this.detectChangeMusic(this.state.currentMusicIndex)
            })
          })
        }
      )
    )
  }
  searchTracks(e) {
    if (e.target.value == '') {
      this.state.audio.pause()
      getMusic().then(
        result => {
          this.setState({
            firstLog: true,
            data: result,
          })
        }
      )
      .then(
        getFavUser(localStorage.getItem(TOKEN_KEY)).then(
          fav => {
            fav.map(
              rowfav => {
                this.state.data.map(
                  x => {
                    if (x['favorite'] === false || x['favorite'] === undefined ){
                      if(x['MusicID'] === rowfav['MusicID']){
                        x['favorite'] = true
                      } else {
                        x['favorite'] = false
                      }
                    }
                  }
                )
              }
            )
          }
        )
      )
    } else {
      searchSongs(e.target.value).then(
        songs => {
          this.setState({
            data: songs
          })
        }
      )
      .then(
        getFavUser(localStorage.getItem(TOKEN_KEY)).then(
          fav => {
            fav.map(
              rowfav => {
                this.state.data.map(
                  x => {
                    if (x['favorite'] === false || x['favorite'] === undefined ){
                      if(x['MusicID'] === rowfav['MusicID']){
                        x['favorite'] = true
                      } else {
                        x['favorite'] = false
                      }
                    }
                  }
                )
              }
            )
          }
        )
      )
    }

  }
  TrackChangeMusic(x) {
    this.killAudio(x)
    this.setState({
      currentmp3: this.state.data[x]['mp3'],
      currentPictures: this.state.data[x]['Pictures'],
      currentMusicId: this.state.data[x]['MusicID'],
      currentAlbum: this.state.data[x]['Album'],
      currentAuteur: this.state.data[x]['Auteur'],
      currentFavorite : this.state.data[x]['favorite'],
      currentGenre: this.state.data[x]['Genre'],
      currentTitre: this.state.data[x]['Titre'],
      audio: new Audio(this.state.data[x]['mp3']),
      currentLoop : false,
    }, () => {
      this.state.audio.play()
      this.state.audio.addEventListener('loadedmetadata', (e) => {
        this.setState({
          currentDuration: e.target.duration
        })
      })
      this.state.audio.addEventListener('ended', (e) => {
        this.detectChangeMusic(this.state.currentMusicIndex)
      })
    })
  }
  killAudio(x) {
    this.state.audio.pause()
    this.setState({
      play: true,
      currentMusicIndex: x,
    })
  }
  //FAV
  GetFavMusicUser(){
    getFavUser(localStorage.getItem(TOKEN_KEY)).then(
      result =>
      {
        result.map(x => {
          x['favorite'] = true
        })
        this.setState({
          data : result
        })
      }
    )
  }
  addFav(musicID, token){
    addFavUser(token,musicID)
    .then(
      x => {
        this.state.data.map(
          row => {
            if (row['MusicID'] === musicID){
              row['favorite'] = true
              this.setState({
                reload : true
              }, () =>{
                this.setState({
                  reload : false
                })
              })
            }
          }
        )
        if (musicID === this.state.currentMusicId){
          this.setState({
            currentFavorite : true
          })
        }
      }
    )

  }
  deleteFav(musicID, token){
    deleteFavUser(token,musicID)
    .then(
      x => {
        this.state.data.map(
          row => {
            if (row['MusicID'] === musicID){
              row['favorite'] = false
              this.setState({
                reload : true
              }, () =>{
                this.setState({
                  reload : false
                })
              })
            }
          }
        )
        if (musicID === this.state.currentMusicId){
          this.setState({
            currentFavorite : false
          })
        }
      }
    )
  }


  detectChangeMusic(x){
    if (x+1 < this.state.data.length) {
      this.state.audio.pause()
      this.setState({
        play: true,
        currentMusicIndex: x+1,
        currentmp3: this.state.data[x+1]['mp3'],
        currentPictures: this.state.data[x+1]['Pictures'],
        currentMusicId: this.state.data[x+1]['MusicID'],
        currentAlbum: this.state.data[x+1]['Album'],
        currentAuteur: this.state.data[x+1]['Auteur'],
        currentGenre: this.state.data[x+1]['Genre'],
        currentTitre: this.state.data[x+1]['Titre'],
        currentFavorite : this.state.data[[x+1]]['favorite'],
        audio: new Audio(this.state.data[x+1]['mp3']),
        currentSongEnd : false,
        currentLoop : false,
        load : true
      }, () => {
        this.state.audio.play()
        this.state.audio.addEventListener('loadedmetadata', (e) => {
          this.setState({
            currentDuration: e.target.duration,
            load : false
          })
        })
        this.state.audio.addEventListener('ended', (e) => {
          this.detectChangeMusic(this.state.currentMusicIndex)
        })
      })
    }
    else {
      this.setState({
        play : false
      })
      this.state.audio.pause()
    }
  }
  UpIndex() {
    let x = this.state.currentMusicIndex + 1;
    if (x < this.state.data.length) {
      this.killAudio(x)
      this.setState({
        currentMusicId: this.state.data[x]['MusicId'],
        currentmp3: this.state.data[x]['mp3'],
        currentPictures: this.state.data[x]['Pictures'],
        currentMusicId: this.state.data[x]['MusicID'],
        currentAlbum: this.state.data[x]['Album'],
        currentAuteur: this.state.data[x]['Auteur'],
        currentGenre: this.state.data[x]['Genre'],
        currentFavorite : this.state.data[x]['favorite'],
        currentTitre: this.state.data[x]['Titre'],
        audio: new Audio(this.state.data[x]['mp3']),
        currentSongEnd : false,
        currentLoop : false,
      }, () => {
        this.state.audio.play()
        this.state.audio.addEventListener('loadedmetadata', (e) => {
          this.setState({
            currentDuration: e.target.duration
          })
        })
        this.state.audio.addEventListener('ended', (e) => {
          this.detectChangeMusic(this.state.currentMusicIndex)
        })
      })
    }
  }
  DownIndex() {
    let x = this.state.currentMusicIndex - 1;
    if (x >= 0) {
      this.killAudio(x)
      this.setState({
        currentMusicId: this.state.data[x]['MusicId'],
        currentmp3: this.state.data[x]['mp3'],
        currentPictures: this.state.data[x]['Pictures'],
        currentMusicId: this.state.data[x]['MusicID'],
        currentAlbum: this.state.data[x]['Album'],
        currentAuteur: this.state.data[x]['Auteur'],
        currentGenre: this.state.data[x]['Genre'],
        currentTitre: this.state.data[x]['Titre'],
        currentFavorite : this.state.data[x]['favorite'],
        audio: new Audio(this.state.data[x]['mp3']),
        currentSongEnd : false,
        currentLoop : false,
      }, () => {
        this.state.audio.play()
        this.state.audio.addEventListener('loadedmetadata', (e) => {
          this.setState({
            currentDuration: e.target.duration
          })
        })
        this.state.audio.addEventListener('ended', (e) => {
          this.detectChangeMusic(this.state.currentMusicIndex)
        })
      })
    }
  }
  loop() {
    this.setState({
      currentLoop : this.state.currentLoop ? false : true
    }, () => {
      this.state.audio.loop = this.state.currentLoop
    })
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
    var x = (this.state.currentDuration / 100) * e.target.value
    if (x >= this.state.currentDuration){
      this.state.audio.pause()
      this.setState({
        play: true,
        currentMusicIndex: x+1,
        currentMusicId: this.state.data[this.state.currentIndex]['MusicId'],
        currentmp3: this.state.data[this.state.currentIndex]['mp3'],
        currentPictures: this.state.data[this.state.currentIndex]['Pictures'],
        currentMusicId: this.state.data[this.state.currentIndex]['PMusicId'],
        currentAlbum: this.state.data[this.state.currentIndex]['Album'],
        currentAuteur: this.state.data[this.state.currentIndex]['Auteur'],
        currentGenre: this.state.data[this.state.currentIndex]['Genre'],
        currentTitre: this.state.data[this.state.currentIndex]['Titre'],
        audio: new Audio(this.state.data[this.state.currentIndex]['mp3']),
        currentSongEnd : false,
        currentLoop : false,
        load : true
      }, () => {
        this.state.audio.play()
        this.state.audio.addEventListener('loadedmetadata', (e) => {
          this.setState({
            currentDuration: e.target.duration,
            load : false
          })
        })
        this.state.audio.addEventListener('loadedmetadata', (e) => {
          this.setState({
            currentSongEnd : true,
          })
        })
      })
    } else {
      this.state.audio.currentTime = x
      this.setState({
        currentPlayed: x
      })
    }
  }
  render() {
    setTimeout(() => {
      if (this.state.play) {
        this.setState({
          currentPlayed: this.state.audio.currentTime
        })
      }
    }, 500);
    this.state.audio.volume = this.state.volume / 100
    return (
      <div className="Body">
        <div className="Navbar">
          <nav role="navigation">
            <div id="menuToggle">
              <input type="checkbox" id="checkbox"/>
              <span></span>
              <span></span>
              <span></span>
              <ul id="menu">
                <p onClick={console.log("clicked")}><li>Liste des musiques</li></p>
                <p onClick={this.GetFavMusicUser}><li>Favoris</li></p>
                <p onClick={
                    () => {
                      logout()
                      this.props.history.push('/')
                    }
                }><li>Deconnexion</li></p>
              </ul>
            </div>
          </nav>
          <input type="search" id="searchNavbar" onChange={this.searchTracks} />
        </div>
        <div className="player">
          <div className="musicInfos">
            <div className="picturesPlayer" style={{
              backgroundImage: `url(${this.state.currentPictures})`
            }}>
            </div>
            <div className="nameSong">
              <h5>
                {
                  this.state.currentTitre
                }
              </h5>
            </div>
          </div>

          <div className="ContentPlayer">

            <div className="indicatorPlayer">
              {
                this.state.currentLoop
                ? <img src={ReplayIcon} onClick={this.loop} />
                : <LoopIcon sx={{ fontSize: 50 , color:"white"}}onClick={this.loop}/>
              }
              <img src={SkipPreviousIcon}
                onClick={this.DownIndex}
                style={{
                  color: this.state.currentMusicIndex - 1 < 0 && '#F8F8F8'
                }} />
              {
                !this.state.play
                  ? <img src={PlayIcon} onClick={() => { this.PlayMusic('play') }} />
                  : <img src={PauseIcon} onClick={() => { this.PlayMusic('pause') }} />
              }
              <img src={SkipNextIcon} onClick={this.UpIndex}
                style={{
                  color: this.state.currentMusicIndex + 1 > this.state.data.length - 1 && '#F8F8F8'
                }} />
                {
                  !this.state.currentFavorite
                  ? <FavoriteBorderIcon onClick={() => {this.addFav(this.state.currentMusicId, localStorage.getItem(TOKEN_KEY))}} sx={{ fontSize: 50 , color:"white"}}/>
                : <FavoriteIcon onClick={ () => {this.deleteFav(this.state.currentMusicId, localStorage.getItem(TOKEN_KEY))}} sx={{ fontSize: 50 , color:"white"}}/>
                }


            </div>
            <div className="ProgressBarPlayer" style={{ width: "50%" }}>
              <SliderMui percentage={this.state.firstLog && this.state.currentPlayed / this.state.currentDuration * 100} onChange={this.onChange}  />
            </div>
          </div>
          <div className="volumeSlider">
            <Box sx={{ width: '100%' }}>
              <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                {
                  this.state.volume > 0
                    ? <img src={VolumeOffIcon} />
                    : <img src={VolumeDown} />
                }

                <Slider aria-label="Volume" value={this.state.volume} onChange={this.handleChange} />
                <img src={VolumeUp} />
              </Stack>
            </Box>
          </div>
        </div>
        <div className="ListOfTracks">
          {
            this.state.data.length > 0
            && this.state.data.map(
              (row, index) =>
              <div>
                <div className="Tracks" style={{cursor : 'pointer'}}key={row.MusicID} onClick={() => { this.TrackChangeMusic(index) }}>
                  <div className="ImgPlusTitreTracks">
                    <img src={row.Pictures} />
                    <h5 className="titreTest">{row.Titre}</h5>
                  </div>

                  <h5 className="AuteurTracks">{row.Auteur}</h5>
                    <div className="CoeurAuMillieu">
                    {
                        !row['favorite']
                        ? <FavoriteBorderIcon onClick={() => {this.addFav(row.MusicID, localStorage.getItem(TOKEN_KEY))}} color='white' sx={{ fontSize: 50, color:'white'}}/>
                      : <FavoriteIcon onClick={ () => {this.deleteFav(row.MusicID, localStorage.getItem(TOKEN_KEY))}} color='white' sx={{ fontSize: 50, color:'white'}}/>
                    }
                    </div>
                </div>
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
