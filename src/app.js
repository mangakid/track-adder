import React, { useEffect, useReducer, useRef } from "react";
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
import { radioOptions } from "./constants";
import { reducer } from "./reducer";

const spotifyApi = new SpotifyWebApi();
const searchCountry = "ES";
export const AppContext = React.createContext();

spotifyApi.searchTracks = debounce(spotifyApi.searchTracks, 500);
spotifyApi.searchArtists = debounce(spotifyApi.searchArtists, 500);
spotifyApi.searchAlbums = debounce(spotifyApi.searchAlbums, 500);

const initialState = {
  artistsLoading: false,
  searchText: "",
  playlistName: "",
  tracks: [],
  albums: [],
  albumsLoading: false,
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
  tracksLoading: false,
  radio: "tracks",
  nav: "results",
  searchAfterChange: true
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    window.addEventListener("message", setAuthStuff, false);
    return () => window.removeEventListener("message", setAuthStuff);
  }, [state.stateKey]);

  // handle radio change
  useEffect(() => {
    if (state.searchText && state.searchAfterChange) {
      handleUserSearchInput(state.searchText);
    }
  }, [state.radio]);

  // fetch albums by ids if albums changes
  useEffect(() => {
    if (state.albums) {
      const albumIds = state.albums.map(({ id }) => id);
      if (albumIds.length) {
        spotifyApi.getAlbums(albumIds).then(
          ({ albums: fullAlbums }) => {
            dispatch({ type: "set_full_albums", payload: fullAlbums });
          },
          err => {
            console.error(err);
          }
        );
      }
    }
  }, [state.albums]);

  useEffect(() => {
    switch (state.action) {
      case "GET_PLAYLISTS":
      case "UPDATE_PLAYLIST":
      case "MAKE_PLAYLIST": {
        createUpdateOrReceivePlaylists();
      }
      default:
        return;
    }
  }, [state.action]);

  const setAuthStuff = ({ data }) => {
    const { access_token: token, expires_in, state: dataState, type } =
      (typeof data !== "object" && JSON.parse(data)) || data;
    if (dataState === state.stateKey && type === "access_token") {
      spotifyApi.setAccessToken(token);
      let expires = new Date();
      expires = expires.setSeconds(expires.getSeconds() + expires_in);
      dispatch({ type: "set_token", payload: token });
      dispatch({ type: "set_expires", payload: expires });
      spotifyApi.getMe().then(
        ({ id: userId }) => {
          dispatch({ type: "set_user_id", payload: userId });
          if (state.action) {
            createUpdateOrReceivePlaylists();
          }
        },
        err => {
          console.error(err);
        }
      );
    }
  };

  const logOut = () => {
    dispatch({ type: "logout" });
  };

  const handleRadioChange = ({ currentTarget: { value } }) => {
    dispatch({ type: "set_radio", payload: value });
  };

  const handleUserSearchChange = searchText => {
    dispatch({ type: "set_search_text", payload: searchText });
  };

  const handleUserSearchInput = searchText => {
    if (searchText) {
      if (state.radio === radioOptions.TRACKS) {
        dispatch({ type: "set_tracks_loading", payload: true });
        spotifyApi.searchTracks(`track:${searchText}`).then(
          ({ tracks: { items: tracks } }) => {
            dispatch({ type: "set_tracks", payload: tracks });
            dispatch({ type: "set_tracks_loading", payload: false });
          },
          err => {
            dispatch({ type: "set_tracks_loading", payload: false });
            console.error(err);
          }
        );
      } else if (state.radio === radioOptions.ARTISTS) {
        dispatch({ type: "set_artists_loading", payload: true });
        spotifyApi
          .searchArtists(`artist:${searchText}`, {
            Authorization: "Bearer " + "6e3b7695b6a54ff6ac27fdcc35afd87d"
          })
          .then(
            ({ artists: { items } }) => {
              dispatch({ type: "set_artists", payload: items });
              dispatch({ type: "set_artists_loading", payload: false });
            },
            err => {
              dispatch({ type: "set_artists_loading", payload: false });
              console.error(err);
            }
          );
      } else {
        dispatch({ type: "set_albums_loading", payload: true });
        spotifyApi.searchAlbums("album:" + searchText).then(
          ({ albums }) => {
            dispatch({ type: "set_albums", payload: albums.items });
            dispatch({ type: "set_albums_loading", payload: false });
          },
          err => {
            dispatch({ type: "set_albums_loading", payload: false });
            console.error(err);
          }
        );
      }
    } else {
      dispatch({ type: "set_tracks", payload: "" });
      dispatch({ type: "set_artists", payload: "" });
      dispatch({ type: "set_albums", payload: "" });
    }
  };

  const getArtistsAlbums = ({ id: artistId }) => {
    dispatch({
      type: "set_radio",
      payload: radioOptions.ALBUMS,
      searchAfterChange: false
    });
    dispatch({ type: "set_albums_loading", payload: true });
    spotifyApi.getArtistAlbums(artistId).then(
      ({ items: albums }) => {
        dispatch({ type: "set_albums", payload: albums });
        dispatch({ type: "set_albums_loading", payload: false });
      },
      err => {
        dispatch({ type: "set_albums_loading", payload: false });
        console.error(err);
      }
    );
  };

  const getTopTracks = ({ id }) => {
    dispatch({
      type: "set_radio",
      payload: radioOptions.TRACKS,
      searchAfterChange: false
    });
    dispatch({ type: "set_tracks_loading", payload: true });
    spotifyApi.getArtistTopTracks(id, searchCountry).then(
      ({ tracks }) => {
        dispatch({ type: "set_tracks", payload: tracks });
        dispatch({ type: "set_tracks_loading", payload: false });
      },
      err => {
        dispatch({ type: "set_tracks_loading", payload: false });
        console.error(err);
      }
    );
  };

  const handleUserPlaylistInput = playlistName => {
    dispatch({ type: "set_playlist_name", payload: playlistName });

    if (playlistName) {
      dispatch({ type: "select_playlist", payload: "" });
    }
  };

  const authenticate = () => {
    const generateRandomString = N =>
      (Math.random().toString(36) + Array(N).join("0")).slice(2, N + 2);
    const stateKey = generateRandomString(16);
    const scopes =
      "user-read-private playlist-modify-private playlist-modify-public";
    const client_id = "6e3b7695b6a54ff6ac27fdcc35afd87d";
    const redirect_uri = "http://mangakid.co.uk/callback.html";

    dispatch({ type: "set_state_key", payload: stateKey });
    var url = "https://accounts.spotify.com/authorize";
    url += "?response_type=token";
    url += "&show_dialog=true";
    url += `&client_id=${encodeURIComponent(client_id)}`;
    url += `&scope=${encodeURIComponent(scopes)}`;
    url += `&redirect_uri=${encodeURIComponent(redirect_uri)}`;
    url += `&state=${encodeURIComponent(stateKey)}`;

    window.open(url);
  };

  const createUpdateOrReceivePlaylists = () => {
    const uris = state.playlistTracks.map(({ uri }) => uri);

    if (state.action === "MAKE_PLAYLIST") {
      const name = state.playlistName || "A rad playlist";
      const playlistOptions = { name };
      spotifyApi.createPlaylist(state.userId, playlistOptions).then(
        ({ id }) => {
          spotifyApi.addTracksToPlaylist(state.userId, id, uris).then(
            () => {
              dispatch({ type: "set_action", payload: "" });
            },
            err => {
              console.error(err);
              dispatch({ type: "set_action", payload: "" });
            }
          );
        },
        err => {
          console.error(err);
          dispatch({ type: "set_action", payload: "" });
        }
      );
    } else if (state.action == "UPDATE_PLAYLIST") {
      spotifyApi
        .addTracksToPlaylist(state.userId, state.selectedPlaylist.id, uris)
        .then(
          () => {
            dispatch({ type: "set_action", payload: "" });
          },
          err => {
            console.error(err);
            dispatch({ type: "set_action", payload: "" });
          }
        );
    } else if (state.action == "GET_PLAYLISTS") {
      spotifyApi.getUserPlaylists(state.userId).then(
        ({ items: playlists }) => {
          dispatch({ type: "set_playlists", payload: playlists });
          dispatch({ type: "set_show_playlists", payload: true });
          dispatch({ type: "set_action", payload: "" });
        },
        err => {
          console.error(err);
          dispatch({ type: "set_action", payload: "" });
        }
      );
    }
  };

  const handleMakePlaylist = () => {
    var action = state.selectedPlaylist ? "UPDATE_PLAYLIST" : "MAKE_PLAYLIST";

    if (state.playlistTracks.length) {
      dispatch({ type: "set_action", payload: action });
      if (state.expires < new Date()) {
        authenticate();
      } else {
        createUpdateOrReceivePlaylists();
      }
    }
  };

  const addTrack = track => {
    dispatch({ type: "add_track", payload: track });
  };

  const subtractTrack = trackToSubtract => {
    dispatch({ type: "subtract_track", payload: trackToSubtract });
  };

  const loadAlbumTracks = tracks => {
    dispatch({ type: "set_tracks", payload: tracks });
    dispatch({
      type: "set_radio",
      payload: radioOptions.TRACKS,
      searchAfterChange: false
    });
  };

  const selectPlaylist = selectedPlaylist => {
    dispatch({ type: "select_playlist", payload: selectedPlaylist });
  };

  const getExistingPlaylists = () => {
    dispatch({ type: "set_action", payload: "GET_PLAYLISTS" });
    dispatch({ type: "select_playlist", payload: "" });
    dispatch({ type: "set_playlist_name" });

    () => {
      if (state.expires < new Date()) {
        authenticate();
      } else {
        createUpdateOrReceivePlaylists();
      }
    };
  };

  const changeView = nav => dispatch({ type: "set_view", payload: nav });

  return state.expires < new Date() ? (
    <AppContext.Provider value={state}>
      <Login login={authenticate} />
    </AppContext.Provider>
  ) : (
    <AppContext.Provider value={state}>
      <div className="mainDiv">
        <Logout userId={state.userId} handleClick={logOut} />
        <RadioOptions option={state.radio} handleChange={handleRadioChange} />
        <SearchBar
          searchText={state.searchText}
          onUserInput={handleUserSearchChange}
          onKeyUp={handleUserSearchInput}
        />
        <ResultsTables
          changeView={changeView}
          getArtistsAlbums={getArtistsAlbums}
          getTop={getTopTracks}
          addTrack={addTrack}
          selectTracks={loadAlbumTracks}
          subtractTrack={subtractTrack}
          selectPlaylist={selectPlaylist}
        />
        <PlaylistName
          show={!!state.playlistTracks.length && state.nav === "playlist"}
          playlistName={state.playlistName}
          handleClick={getExistingPlaylists}
          onUserInput={handleUserPlaylistInput}
        />
        <MakePlaylistButton
          show={!!state.playlistTracks.length && state.nav === "playlist"}
          handleClick={handleMakePlaylist}
          selectedPlaylist={state.selectedPlaylist}
        />
      </div>
    </AppContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("content"));
