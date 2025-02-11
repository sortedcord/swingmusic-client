const development = import.meta.env.DEV;

function getBaseUrl() {
  const base_url = window.location.origin;

  if (!development) {
    return base_url;
  }

  const splits = base_url.split(":");
  return base_url.replace(splits[splits.length - 1], "1980");
}

const base_url = getBaseUrl();
const baseImgUrl = base_url + "/img";

const imageRoutes = {
  thumb: {
    large: "/t/",
    small: "/t/s/",
    original: "/t/o/",
  },
  artist: {
    large: "/a/",
    small: "/a/s/",
  },
  playlist: "/p/",
  raw: "/raw/",
};

export const paths = {
  api: {
    album: base_url + "/album",
    favorite: base_url + "/favorite",
    favorites: base_url + "/favorites",
    favAlbums: base_url + "/albums/favorite",
    favTracks: base_url + "/tracks/favorite",
    favArtists: base_url + "/artists/favorite",
    isFavorite: base_url + "/favorites/check",
    artist: base_url + "/artist",
    lyrics: base_url + "/lyrics",
    plugins: base_url + "/plugins",
    get addFavorite() {
      return this.favorite + "/add";
    },
    get removeFavorite() {
      return this.favorite + "/remove";
    },
    get albumartists() {
      return this.album + "/artists";
    },
    get albumbio() {
      return this.album + "/bio";
    },
    get albumsByArtistUrl() {
      return this.album + "/from-artist";
    },
    get albumVersions() {
      return this.album + "/versions";
    },
    folder: {
      base: base_url + "/folder",
      showInFiles: base_url + "/folder/show-in-files",
    },
    dir_browser: base_url + "/folder/dir-browser",
    playlist: {
      base: base_url + "/playlist",
      get new() {
        return this.base + "/new";
      },
      get all() {
        return this.base + "s";
      },
      get artists() {
        return this.base + "/artists";
      },
    },
    search: {
      base: base_url + "/search",
      get top() {
        return this.base + "/top?q=";
      },
      get tracks() {
        return this.base + "/tracks?q=";
      },
      get albums() {
        return this.base + "/albums?q=";
      },
      get artists() {
        return this.base + "/artists?q=";
      },
      get load() {
        return this.base + "/loadmore";
      },
    },
    logger: {
      base: base_url + "/logger",
      get logTrack() {
        return this.base + "/track/log";
      },
    },
    getall: {
      base: base_url + "/getall",
      get albums() {
        return this.base + "/albums";
      },
      get artists() {
        return this.base + "/artists";
      },
    },
    colors: {
      base: base_url + "/colors",
      get album() {
        return this.base + "/album";
      },
    },
    settings: {
      base: base_url + "/settings",
      get get_root_dirs() {
        return this.base + "/get-root-dirs";
      },
      get add_root_dir() {
        return this.base + "/add-root-dirs";
      },
      get remove_root_dir() {
        return this.base + "/remove-root-dirs";
      },
      get trigger_scan() {
        return this.base + "/trigger-scan";
      },
    },
    files: base_url + "/file",
    home: {
      base: base_url + "/home",
      get recentlyAdded() {
        return this.base + "/recents/added";
      },
      get recentlyPlayed() {
        return this.base + "/recents/played";
      },
    },
  },
  images: {
    thumb: {
      small: baseImgUrl + imageRoutes.thumb.small,
      large: baseImgUrl + imageRoutes.thumb.large,
      original: baseImgUrl + imageRoutes.thumb.original,
    },
    artist: {
      small: baseImgUrl + imageRoutes.artist.small,
      large: baseImgUrl + imageRoutes.artist.large,
    },
    playlist: baseImgUrl + imageRoutes.playlist,
    raw: baseImgUrl + imageRoutes.raw,
  },
};
