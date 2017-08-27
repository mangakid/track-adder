import React from 'react';
import ReactDOM from 'react-dom';
import MakePlaylistButton from './components/make-playlist-button';
import PlaylistName from './components/playlist-name';
import SearchBar from './components/search-bar';
import Logout from './components/logout';
import RadioOptions from './components/radio-options';
import ResultsTables from './components/results-tables';
import Login from './components/login';
import debounce from 'es6-promise-debounce';

var spotifyApi = new SpotifyWebApi();

spotifyApi.searchTracks   = debounce(spotifyApi.searchTracks, 500);
spotifyApi.searchArtists  = debounce(spotifyApi.searchArtists, 500);
spotifyApi.searchAlbums   = debounce(spotifyApi.searchAlbums, 500);

      //  Main App

      var App = React.createClass({

        getInitialState: function(){
          return{
            searchText: '',
            playlistName: '',
            tracks: [],
            albums: [],
            fullAlbums: [],
            artists: [],
            playlistTracks: [],
            selectedPlaylist: '',
            playlists: [],
            action: '',
            userId: '',
            token : '',
            expires: '',
            stateKey: '',
            radio: 'tracks',
            nav: 'results'
          };
        },

        logOut: function(){
          this.setState({
          selectedPlaylist: '',
          playlists: [],
          action: '',
          userId: '',
          token: '',
          expires: '',
          stateKey: '',
          });
        },

        handleRadioChange: function(e){
          this.setState({
            radio: e.currentTarget.value
          },function(){
            if(this.state.searchText){
              this.handleUserSearchInput(this.state.searchText);
            }
          });
        },

        handleUserSearchChange: function(searchText){
          var self = this;

          self.setState({
            searchText: searchText
          });
        },

        handleUserSearchInput: function(searchText){

          var self = this;

          if(searchText != ''){
            if(this.state.radio === 'tracks'){
              spotifyApi.searchTracks('track:'+ searchText)
                .then(function(data) {
                  console.log('Search tracks by "'+ searchText +'" in the track name', data);
                  self.setState({tracks: data.tracks.items});
                }, function(err) {
                  console.error(err);
                });
            } else if(this.state.radio === 'artists'){
              spotifyApi.searchArtists('artist:'+ searchText, {"Authorization":"Bearer "+ '6e3b7695b6a54ff6ac27fdcc35afd87d'}) // TODO
                .then(function(data) {
                  console.log('Search artists data received : ' + data);
                  self.setState({artists: data.artists.items});
                }, function(err) {
                  console.error(err);
                });
            } else {
              spotifyApi.searchAlbums('album:'+ searchText)
                .then(
                  function(data) {
                  console.log('search album data received : ' + data);
                  self.setState(
                    {albums: data.albums.items},
                    function(){
                      var albumIds = [];
                      self.state.albums.forEach(function(album){
                        albumIds.push(album.id);
                      });
                      if(albumIds.length > 0)
                        {
                          spotifyApi.getAlbums(albumIds)
                          .then(
                            function(data){
                              console.log('Albums received: '+ data.albums);
                              self.setState({fullAlbums: data.albums});
                            },
                            function(err){
                              console.error(err);
                            }
                          );
                        }
                    }
                  );
                }, function(err){
                  console.error(err);
                });
            }
          } else{
            self.setState({tracks: '', artists: '', albums: ''});
          }
        },

        getArtistsAlbums: function(artist){
        var self = this;
         spotifyApi.getArtistAlbums(artist.id)
              .then(
                function(data) {
                console.log('search album data received : ' + data);
                self.setState(
                  {albums: data.items,
                   radio: 'albums'
                  },
                  function(){
                    var albumIds = [];
                    self.state.albums.forEach(function(album){
                      albumIds.push(album.id);
                    });
                    spotifyApi.getAlbums(albumIds)
                      .then(
                        function(data){
                          console.log('Albums received: '+ data.albums);
                          self.setState({fullAlbums: data.albums});
                        },
                        function(err){
                          console.error(err);
                        }
                      );
                  }
                );
              }, function(err){
                console.error(err);
              });
        },

        getTopTracks: function(artist){
          var self = this;
          spotifyApi.getArtistTopTracks(artist.id, 'ES')
            .then(function(data){
              console.log('top tracks received');
              self.setState({
                tracks: data.tracks,
                radio: 'tracks'
              });
            },
            function(err){
              console.error(err);
            });
        },

        handleUserPlaylistInput: function(playlistName){
          this.setState({
            playlistName: playlistName
          });

          if(playlistName != ''){
            this.setState({
              selectedPlaylist: '',
              playlists: []
            });
          }
        },

        authenticate: function(){

          var self = this;

          const generateRandomString = N => (Math.random().toString(36)+Array(N).join('0')).slice(2, N+2);
          const state = generateRandomString(16);
          const scopes = 'user-read-private playlist-modify-private playlist-modify-public';
          const client_id = '6e3b7695b6a54ff6ac27fdcc35afd87d';
          const redirect_uri = "http://mangakid.co.uk/callback.html"

          this.setState({stateKey: state});
          var url = 'https://accounts.spotify.com/authorize';
          url += '?response_type=token';
          url += '&show_dialog=true';
          url += '&client_id=' + encodeURIComponent(client_id);
          url += '&scope=' + encodeURIComponent(scopes);
          url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
          url += '&state=' + encodeURIComponent(state);

          window.addEventListener("message", function(event) {
            if(typeof(event.data) !== 'object'){
              var hash = JSON.parse(event.data);
            } else {
              var hash = event.data;
            }
            if(hash.state === self.state.stateKey && hash.type === 'access_token'){
              console.log('states match, token received');
              spotifyApi.setAccessToken(hash.access_token);
              var expirationTime = new Date();
              expirationTime = expirationTime.setSeconds(expirationTime.getSeconds() + hash.expires_in);
              console.log('will expire on :' + expirationTime);
              self.setState({
                token: hash.access_token,
                expires: expirationTime
              });
              spotifyApi.getMe()
                .then(function(data) {
                  console.log('User data received');
                  self.state.userId = data.id;
                  if(self.state.action){
                    self.createUpdateOrReceivePlaylists();
                  }
                }, function(err) {
                  console.error(err);
                });
            }

          }, false);

          window.open(url);

        },

        createUpdateOrReceivePlaylists(){

          var self = this;

          var uris = [];
          this.state.playlistTracks.forEach(function(track){
            uris.push(track.uri);
          });

          if(this.state.action == 'MAKE_PLAYLIST'){
            var pName = '';
            pName = this.state.playlistName === '' ? 'A rad playlist' : this.state.playlistName;
            var playlistOptions = {'name': pName};
            spotifyApi.createPlaylist(this.state.userId, playlistOptions)
              .then(function(data) {
                console.log('Playlist created: ' + JSON.stringify(data) + 'uri at index 0 is : ' + uris[0]);
                spotifyApi.addTracksToPlaylist(self.state.userId,data.id, uris)
                .then(function(data) {
                  console.log('Tracks added ' + JSON.stringify(data));
                  self.setState({
                  action: ''
                  });
                }, function(err){
                  console.error(err);
                  self.setState({
                    action: ''
                  });
                });
              }, function(err) {
                console.error(err);
                self.setState({
                  action: ''
                });
              });
          } else if (this.state.action == 'UPDATE_PLAYLIST'){
            spotifyApi.addTracksToPlaylist(self.state.userId, self.state.selectedPlaylist.id, uris)
              .then(function(data) {
                console.log('Tracks added ' + JSON.stringify(data));
                self.setState({
                  action: ''
                });
              }, function(err){
                console.error(err);
                self.setState({
                  action: ''
                });
              });
          } else if (this.state.action == 'GET_PLAYLISTS'){
            spotifyApi.getUserPlaylists(this.state.userId)
              .then(function(data) {
                //console.log('Playlists found: ' + JSON.stringify(data.items));
                self.setState({
                  playlists: data.items,
                  showPlaylists: true,
                  action: ''
                });
              }, function(err) {
                console.error(err);
                self.setState({
                  action: ''
                });
            });
          }
        },

        handleMakePlaylist: function(){

          var action = this.state.selectedPlaylist ? 'UPDATE_PLAYLIST' : 'MAKE_PLAYLIST';

          if(this.state.playlistTracks.length > 0){

            this.setState({action: action}, function(){
                if(this.state.expires < new Date()){
                  this.authenticate();
                } else {
                  this.createUpdateOrReceivePlaylists();
                }
            }.bind(this));
          }
        },

        addTrack: function(track){

          if(this.state.playlistTracks.indexOf(track) == -1){
            var playlistTracks = this.state.playlistTracks;
            playlistTracks.push(track);

            this.setState({
              playlistTracks: playlistTracks,
              searchText: ''
            });

            console.log(track.name + ' was added to playlist');
          }
        },

        subtractTrack: function(track){

          var playlistTracks = this.state.playlistTracks;

          var index = playlistTracks.indexOf(track);
          playlistTracks.splice(index, 1);

          this.setState({
            playlistTracks: playlistTracks
          });

          console.log(track.name + ' was subtracted from playlist');
        },

        loadAlbumTracks: function(tracks){
          this.setState({
            tracks: tracks,
            radio: 'tracks'
          });
        },

        selectPlaylist: function(playlist){
          this.setState({
            selectedPlaylist: playlist,
            playlists: []
          });
        },

        getExistingPlaylists: function(){
          this.setState({
            action: 'GET_PLAYLISTS',
            selectedPlaylist: '',
            playlists: [],
            playlistName: '',
            playlistId: ''
          }, function(){
                if(this.state.expires < new Date()){
                  this.authenticate();
                } else {
                  this.createUpdateOrReceivePlaylists();
                }
            }.bind(this));
        },

        changeView: function(value){
          console.log(value);

          this.setState({
            nav: value
          });
        },

        render: function(){
          if(this.state.expires < new Date()){
            return(
              <Login
                login={this.authenticate}
              />
            );
          }

          return (
            <div className='mainDiv'>
              <Logout userId={this.state.userId} handleClick={this.logOut}></Logout>
              <RadioOptions option={this.state.radio} handleChange={this.handleRadioChange}/>
              <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserSearchChange} onKeyUp={this.handleUserSearchInput}/>
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
              <PlaylistName show={this.state.playlistTracks.length > 0 && this.state.nav == 'playlist'} playlistName={this.state.playlistName} handleClick={this.getExistingPlaylists} onUserInput={this.handleUserPlaylistInput} />
              <MakePlaylistButton show={this.state.playlistTracks.length > 0 && this.state.nav == 'playlist'} handleClick={this.handleMakePlaylist} selectedPlaylist={this.state.selectedPlaylist}/>

            </div>
          );
        }
      });

      ReactDOM.render(
        <App />,
        document.getElementById('content')
      );
