import { radioOptions } from "./constants";

export const reducer = (state, action) => {
  switch (action.type) {
    case "logout": {
      return {
        ...state,
        selectedPlaylist: "",
        playlists: [],
        action: "",
        userId: "",
        token: "",
        expires: "",
        stateKey: ""
      };
    }
    case "set_radio": {
      const { searchAfterChange = true } = action;
      return { ...state, radio: action.payload, searchAfterChange };
    }
    case "set_search_text": {
      return { ...state, searchText: action.payload };
    }
    case "select_playlist": {
      const selectedPlaylist = action.payload;
      return { ...state, selectedPlaylist, playlists: [] };
    }
    case "add_track": {
      const track = action.payload;
      const { playlistTracks } = state;
      if (playlistTracks.indexOf(track) === -1) {
        return { ...state, playlistTracks: [...playlistTracks, track] };
      }
      return state;
    }
    case "set_tracks": {
      const tracks = action.payload;
      return { ...state, tracks };
    }
    case "set_tracks_loading": {
      const { payload } = action;
      const tracks = payload ? [] : state.tracks;
      return {
        ...state,
        tracks,
        tracksLoading: payload
      };
    }
    case "subtract_track": {
      const track = action.payload;
      const { playlistTracks } = state;
      return {
        ...state,
        playlistTracks: playlistTracks.filter(
          playlistTrack => playlistTrack !== track
        )
      };
    }
    case "set_playlist_name": {
      const { payload } = action;
      if (payload) {
        return {
          ...state,
          playlistName: payload,
          selectedPlaylist: "",
          playlists: []
        };
      }
      return { ...state, playlistName: "" };
    }
    case "set_view": {
      return { ...state, nav: action.payload };
    }
    case "set_artists": {
      const artists = action.payload;
      return { ...state, artists };
    }
    case "set_artists_loading": {
      const { payload } = action;
      const artists = payload ? [] : state.artists;
      return {
        ...state,
        artists,
        artistsLoading: payload
      };
    }
    case "set_albums": {
      const albums = action.payload;
      return { ...state, albums };
    }
    case "set_albums_loading": {
      const { payload } = action;
      const albums = payload ? [] : state.albums;
      const fullAlbums = payload ? [] : state.fullAlbums;
      return {
        ...state,
        albums,
        albumsLoading: payload,
        fullAlbums
      };
    }
    case "set_full_albums": {
      const fullAlbums = action.payload;
      return { ...state, fullAlbums };
    }
    case "set_playlists": {
      const playlists = action.payload;
      return { ...state, playlists };
    }
    case "set_show_playlists": {
      const showPlaylists = action.payload;
      return { ...state, showPlaylists };
    }
    case "set_action": {
      return { ...state, action: action.payload };
    }
    // auth stuff
    case "set_state_key": {
      const stateKey = action.payload;
      return { ...state, stateKey };
    }
    case "set_token": {
      const token = action.payload;
      return { ...state, token };
    }
    case "set_expires": {
      const expires = action.payload;
      return { ...state, expires };
    }
    case "set_user_id": {
      const userId = action.payload;
      return { ...state, userId };
    }

    default: {
      return state;
    }
  }
};
