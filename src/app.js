import React from "react";
import ReactDOM from "react-dom";
import debounce from "es6-promise-debounce";
import style from "../css/base.scss";
import MakePlaylistButton from "./components/make-playlist-button/make-playlist-button";
import PlaylistName from "./components/playlist-name/playlist-name";
import SearchBar from "./components/search-bar/search-bar";
import Logout from "./components/logout/logout";
import RadioOptions from "./components/radio-options/radio-options";
import ResultsTables from "./components/results-tables/results-tables";
import Login from "./components/login/login";
import SpotifyWebApi from "../scripts/spotify-web-api";

const spotifyApi = new SpotifyWebApi();

spotifyApi.searchTracks = debounce(spotifyApi.searchTracks, 500);
spotifyApi.searchArtists = debounce(spotifyApi.searchArtists, 500);
spotifyApi.searchAlbums = debounce(spotifyApi.searchAlbums, 500);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      playlistName: "",
      tracks: [],
      albums: [],
      fullAlbums: [],
      artists: [],
      playlistTracks: [],
      selectedPlaylist: "",
      playlists: [],
      action: "",
      userId: "",
      token: "",
      expires: "",
      stateKey: "",
      radio: "tracks",
      nav: "results"
    };
  }

  logOut = () => {
    this.setState({
      selectedPlaylist: "",
      playlists: [],
      action: "",
      userId: "",
      token: "",
      expires: "",
      stateKey: ""
    });
  };

  handleRadioChange = e => {
    this.setState(
      {
        radio: e.currentTarget.value
      },
      () => {
        if (this.state.searchText) {
          this.handleUserSearchInput(this.state.searchText);
        }
      }
    );
  };

  handleUserSearchChange = searchText => {
    this.setState({
      searchText: searchText
    });
  };

  handleUserSearchInput = searchText => {
    if (searchText) {
      if (this.state.radio === "tracks") {
        spotifyApi.searchTracks("track:" + searchText).then(
          data => {
            // console.log(
            //  'Search tracks by "' + searchText + '" in the track name',
            //  data
            // );
            this.setState({ tracks: data.tracks.items });
          },
          err => {
            console.error(err);
          }
        );
      } else if (this.state.radio === "artists") {
        spotifyApi
          .searchArtists("artist:" + searchText, {
            Authorization: "Bearer " + "6e3b7695b6a54ff6ac27fdcc35afd87d"
          })
          .then(
            data => {
              // console.log("Search artists data received : " + data);
              this.setState({ artists: data.artists.items });
            },
            err => {
              console.error(err);
            }
          );
      } else {
        spotifyApi.searchAlbums("album:" + searchText).then(
          data => {
            // console.log("search album data received : " + data);
            this.setState({ albums: data.albums.items }, () => {
              var albumIds = [];
              this.state.albums.forEach(function(album) {
                albumIds.push(album.id);
              });
              if (albumIds.length) {
                spotifyApi.getAlbums(albumIds).then(
                  data => {
                    // console.log("Albums received: " + data.albums);
                    this.setState({ fullAlbums: data.albums });
                  },
                  err => {
                    console.error(err);
                  }
                );
              }
            });
          },
          err => {
            console.error(err);
          }
        );
      }
    } else {
      this.setState({ tracks: "", artists: "", albums: "" });
    }
  };

  getArtistsAlbums = artist => {
    spotifyApi.getArtistAlbums(artist.id).then(
      data => {
        // console.log("search album data received : " + data);
        this.setState({ albums: data.items, radio: "albums" }, () => {
          var albumIds = [];
          this.state.albums.forEach(album => {
            albumIds.push(album.id);
          });
          spotifyApi.getAlbums(albumIds).then(
            data => {
              // console.log("Albums received: " + data.albums);
              this.setState({ fullAlbums: data.albums });
            },
            err => {
              console.error(err);
            }
          );
        });
      },
      err => {
        console.error(err);
      }
    );
  };

  getTopTracks = artist => {
    spotifyApi.getArtistTopTracks(artist.id, "ES").then(
      data => {
        // console.log("top tracks received");
        this.setState({
          tracks: data.tracks,
          radio: "tracks"
        });
      },
      err => {
        console.error(err);
      }
    );
  };

  handleUserPlaylistInput = playlistName => {
    this.setState({
      playlistName: playlistName
    });

    if (playlistName) {
      this.setState({
        selectedPlaylist: "",
        playlists: []
      });
    }
  };

  authenticate = () => {
    const generateRandomString = N =>
      (Math.random().toString(36) + Array(N).join("0")).slice(2, N + 2);
    const state = generateRandomString(16);
    const scopes =
      "user-read-private playlist-modify-private playlist-modify-public";
    const client_id = "6e3b7695b6a54ff6ac27fdcc35afd87d";
    const redirect_uri = "http://mangakid.co.uk/callback.html";

    this.setState({ stateKey: state });
    var url = "https://accounts.spotify.com/authorize";
    url += "?response_type=token";
    url += "&show_dialog=true";
    url += "&client_id=" + encodeURIComponent(client_id);
    url += "&scope=" + encodeURIComponent(scopes);
    url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
    url += "&state=" + encodeURIComponent(state);

    window.addEventListener(
      "message",
      event => {
        if (typeof event.data !== "object") {
          var hash = JSON.parse(event.data);
        } else {
          var hash = event.data;
        }
        if (
          hash.state === this.state.stateKey &&
          hash.type === "access_token"
        ) {
          // console.log("states match, token received");
          spotifyApi.setAccessToken(hash.access_token);
          var expirationTime = new Date();
          expirationTime = expirationTime.setSeconds(
            expirationTime.getSeconds() + hash.expires_in
          );
          // console.log("will expire on :" + expirationTime);
          this.setState({
            token: hash.access_token,
            expires: expirationTime
          });
          spotifyApi.getMe().then(
            data => {
              // console.log("User data received");
              this.state.userId = data.id;
              if (this.state.action) {
                this.createUpdateOrReceivePlaylists();
              }
            },
            err => {
              console.error(err);
            }
          );
        }
      },
      false
    );

    window.open(url);
  };

  createUpdateOrReceivePlaylists = () => {
    var uris = [];
    this.state.playlistTracks.forEach(function(track) {
      uris.push(track.uri);
    });

    if (this.state.action == "MAKE_PLAYLIST") {
      var pName = "";
      pName =
        this.state.playlistName === ""
          ? "A rad playlist"
          : this.state.playlistName;
      var playlistOptions = { name: pName };
      spotifyApi.createPlaylist(this.state.userId, playlistOptions).then(
        data => {
          /*  console.log(
            "Playlist created: " +
              JSON.stringify(data) +
              "uri at index 0 is : " +
              uris[0]
          ); */
          spotifyApi.addTracksToPlaylist(this.state.userId, data.id, uris).then(
            () => {
              // console.log("Tracks added " + JSON.stringify(data));
              this.setState({
                action: ""
              });
            },
            err => {
              console.error(err);
              this.setState({
                action: ""
              });
            }
          );
        },
        err => {
          console.error(err);
          this.setState({
            action: ""
          });
        }
      );
    } else if (this.state.action == "UPDATE_PLAYLIST") {
      spotifyApi
        .addTracksToPlaylist(
          this.state.userId,
          this.state.selectedPlaylist.id,
          uris
        )
        .then(
          data => {
            // console.log("Tracks added " + JSON.stringify(data));
            this.setState({
              action: ""
            });
          },
          err => {
            console.error(err);
            this.setState({
              action: ""
            });
          }
        );
    } else if (this.state.action == "GET_PLAYLISTS") {
      spotifyApi.getUserPlaylists(this.state.userId).then(
        data => {
          //console.log('Playlists found: ' + JSON.stringify(data.items));
          this.setState({
            playlists: data.items,
            showPlaylists: true,
            action: ""
          });
        },
        err => {
          console.error(err);
          this.setState({
            action: ""
          });
        }
      );
    }
  };

  handleMakePlaylist = () => {
    var action = this.state.selectedPlaylist
      ? "UPDATE_PLAYLIST"
      : "MAKE_PLAYLIST";

    if (this.state.playlistTracks.length) {
      this.setState({ action: action }, () => {
        if (this.state.expires < new Date()) {
          this.authenticate();
        } else {
          this.createUpdateOrReceivePlaylists();
        }
      });
    }
  };

  addTrack = track => {
    if (this.state.playlistTracks.indexOf(track) == -1) {
      var playlistTracks = this.state.playlistTracks;
      playlistTracks.push(track);

      this.setState({
        playlistTracks: playlistTracks,
        searchText: ""
      });

      // console.log(track.name + " was added to playlist");
    }
  };

  subtractTrack = track => {
    var playlistTracks = this.state.playlistTracks;

    var index = playlistTracks.indexOf(track);
    playlistTracks.splice(index, 1);

    this.setState({
      playlistTracks: playlistTracks
    });

    // console.log(track.name + " was subtracted from playlist");
  };

  loadAlbumTracks = tracks => {
    this.setState({
      tracks: tracks,
      radio: "tracks"
    });
  };

  selectPlaylist = playlist => {
    this.setState({
      selectedPlaylist: playlist,
      playlists: []
    });
  };

  getExistingPlaylists = () => {
    this.setState(
      {
        action: "GET_PLAYLISTS",
        selectedPlaylist: "",
        playlists: [],
        playlistName: "",
        playlistId: ""
      },
      () => {
        if (this.state.expires < new Date()) {
          this.authenticate();
        } else {
          this.createUpdateOrReceivePlaylists();
        }
      }
    );
  };

  changeView = value => {
    // console.log(value);

    this.setState({
      nav: value
    });
  };

  render() {
    if (this.state.expires < new Date()) {
      return <Login login={this.authenticate} />;
    }

    return (
      <div className="mainDiv">
        <Logout userId={this.state.userId} handleClick={this.logOut} />
        <RadioOptions
          option={this.state.radio}
          handleChange={this.handleRadioChange}
        />
        <SearchBar
          searchText={this.state.searchText}
          onUserInput={this.handleUserSearchChange}
          onKeyUp={this.handleUserSearchInput}
        />
        <ResultsTables
          tracks={this.state.tracks}
          albums={this.state.albums}
          fullAlbums={this.state.fullAlbums}
          artists={this.state.artists}
          nav={this.state.nav}
          radio={this.state.radio}
          playlists={this.state.playlists}
          playlistTracks={this.state.playlistTracks}
          playlistName={this.state.playlistName}
          selectedPlaylist={this.state.selectedPlaylist}
          changeView={this.changeView}
          getArtistsAlbums={this.getArtistsAlbums}
          getTop={this.getTopTracks}
          addTrack={this.addTrack}
          selectTracks={this.loadAlbumTracks}
          subtractTrack={this.subtractTrack}
          selectPlaylist={this.selectPlaylist}
        />
        <PlaylistName
          show={
            this.state.playlistTracks.length > 0 && this.state.nav == "playlist"
          }
          playlistName={this.state.playlistName}
          handleClick={this.getExistingPlaylists}
          onUserInput={this.handleUserPlaylistInput}
        />
        <MakePlaylistButton
          show={
            this.state.playlistTracks.length > 0 && this.state.nav == "playlist"
          }
          handleClick={this.handleMakePlaylist}
          selectedPlaylist={this.state.selectedPlaylist}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("content"));
