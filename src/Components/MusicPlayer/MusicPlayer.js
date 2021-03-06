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
import Logo from '../icons/1F680.svg';


import LoopIcon from '@mui/icons-material/Loop';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';



import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SliderMui from '../slider/Slider';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AlbumIcon from '@mui/icons-material/Album';

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
  if (!seconds) return '00:00'

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
    return `00:${sec}`
  } else {
    return `${min}:${sec}`
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
      FavoritePage : false,
      loadedDataMusic: false,
      play: false,
      audio: new Audio(),
      data: [],
      firstLog: false,
      reload: false,
      volume: 100,
      load : false,
      CurrentUp : true,
      CurrentDown : true,
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
    this.returnListMusic = this.returnListMusic.bind(this);
  }
  componentDidMount() {
    this.setState({
      audio : new Audio()
    })
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
            CurrentUp : true,
            CurrentDown : true,
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
      CurrentUp : true,
      CurrentDown : true,
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
    document.getElementById('checkbox').checked = false
    getFavUser(localStorage.getItem(TOKEN_KEY)).then(
      result =>
      {
        result.map(x => {
          x['favorite'] = true
        })
        this.setState({
          data : result,
          FavoritePage : true,
          CurrentUp : false,
          CurrentDown : false,
        })
      }
    )
  }
  addFav(musicID, token){
    var MusicfindInData = false;
    this.state.data.map(x => {
      if(x['MusicID'] === musicID) {
        MusicfindInData = true;
      }
    })
    if (MusicfindInData === false) {
      var newArray = this.state.data
      newArray.unshift({
        'Auteur' : this.state.currentAuteur,
        'Album': this.state.currentAlbum,
        'Genre': this.state.currentGenre,
        'MusicID' : this.state.currentMusicId,
        'Pictures' : this.state.currentPictures,
        'Titre' : this.state.currentTitre,
        'favorite' : true,
        'mp3' : this.state.currentmp3,
      })
    }
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
        if (this.state.FavoritePage){
          var y = [];
          this.state.data.map(
            x => {
              if (x['MusicID'] !== musicID){
                console.log('false')
                y.push(x)
              }
            }
          )
          this.setState({
            data : y
          })
        }
      }
    )
  }
  returnListMusic(){
    document.getElementById('checkbox').checked = false
    getMusic().then(
      result => {
        this.setState({
          data : result,
          favoritePage : false
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
              this.setState({
                data : this.state.data
              })
            }
          )
        }
      )
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
        CurrentUp : true,
        CurrentDown : true,
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
    if (this.state.CurrentUp) {
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
          CurrentUp : true,
          CurrentDown : true,
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
  }
  DownIndex() {
    if (this.state.CurrentDown) {
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
          CurrentUp : true,
          CurrentDown : true,
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
    }, 1000);
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
                <p onClick={
                    this.returnListMusic
                  }><li><AlbumIcon/> <p>Liste des musiques</p></li></p>
                <p onClick={
                    this.GetFavMusicUser
                  }><li><FavoriteIcon/> <p>Favoris</p></li></p>
                <p onClick={
                    () => {
                      logout()
                      this.props.history.push('/')
                    }
                }><li><AccountCircleIcon/> <p>Deconnexion</p></li></p>
              </ul>
            </div>
          </nav>
          <img src={Logo}/>
          <input type="search" id="searchNavbar"onChange={this.searchTracks} />
        </div>
        <div className="player" >
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
            <div className="expendInfoSong">
              <ExpandLessIcon/>
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
                  cursor : 'pointer',
                  color: this.state.currentMusicIndex - 1 < 0 && '#F8F8F8'
                }} />
              {
                !this.state.play
                  ? <img src={PlayIcon} onClick={() => { this.PlayMusic('play') }} />
                  : <img src={PauseIcon} onClick={() => { this.PlayMusic('pause') }} />
              }
              <img src={SkipNextIcon} onClick={this.UpIndex}
                style={{
                  cursor : 'pointer',
                  color: this.state.currentMusicIndex + 1 > this.state.data.length - 1 && '#F8F8F8'
                }} />
                {
                  !this.state.currentFavorite
                  ? <FavoriteBorderIcon onClick={() => {this.addFav(this.state.currentMusicId, localStorage.getItem(TOKEN_KEY))}} sx={{ fontSize: 50 , color:"white"}}/>
                : <FavoriteIcon onClick={ () => {this.deleteFav(this.state.currentMusicId, localStorage.getItem(TOKEN_KEY))}} sx={{ fontSize: 50 , color:"white"}}/>
                }


            </div>
            <div className="ProgressBarPlayer" style={{ width: "50%" }}>
              <div className="currentTimeProgressBar">
                {
                  secondsToHms(this.state.currentPlayed)
                }
              </div>
              <SliderMui percentage={this.state.firstLog && this.state.currentPlayed / this.state.currentDuration * 100} onChange={this.onChange}  />
              <div className="timerProgressBar">
                {
                  secondsToHms(this.state.currentDuration - this.state.currentPlayed)
                }
              </div>

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
                <div className="Tracks" style={{cursor : 'pointer'}}>
                  <div className="AuteurPlusImgPlustitre" key={row.MusicID} onClick={() => { this.TrackChangeMusic(index) }}>
                    <div className="ImgPlusTitreTracks">
                      <img src={row.Pictures} />
                      <h5 className="titreTest">{row.Titre}</h5>
                    </div>
                    <h5 className="AuteurTracks">{row.Auteur}</h5>
                  </div>
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
