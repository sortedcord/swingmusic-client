import { paths } from "@/config";
import { Artist, Playlist, Track } from "@/interfaces";
import { NotifType, Notification, useNotifStore } from "@/stores/notification";
import useAxios from "./useAxios";

const {
  new: newPlaylistUrl,
  all: allPlaylistsUrl,
  base: basePlaylistUrl,
  artists: playlistArtistsUrl,
} = paths.api.playlist;

/**
 * Creates a new playlist on the server.
 * @param playlist_name The name of the playlist to create.
 */
export async function createNewPlaylist(playlist_name: string, track?: Track) {
  const { data, status } = await useAxios({
    url: newPlaylistUrl,
    props: {
      name: playlist_name,
    },
  });

  if (status == 201) {
    new Notification("Playlist created successfullly!", NotifType.Success);

    if (track) {
      setTimeout(() => {
        addTrackToPlaylist(data.playlist, track);
      }, 1000);
    }

    return {
      success: true,
      playlist: data.playlist as Playlist,
    };
  }

  let message = "Something went wrong";

  if (status == 409) {
    message = "That playlist already exists";
  }

  new Notification(message, NotifType.Error);

  return {
    success: false,
    playlist: <Playlist>{},
  };
}

/**
 * Fetches all playlists from the server.
 * @returns {Promise<Playlist[]>} A promise that resolves to an array of playlists.
 */
export async function getAllPlaylists(no_images = false): Promise<Playlist[]> {
  const { data, error } = await useAxios({
    url: allPlaylistsUrl + (no_images ? "?no_images=true" : ""),
    get: true,
  });

  if (error) console.error(error);

  if (data) {
    return data.data;
  }

  return [];
}

export async function getPlaylist(pid: number, no_tracks = false) {
  const uri = `${basePlaylistUrl}/${pid}?no_tracks=${no_tracks}`;

  interface PlaylistData {
    info: Playlist;
    tracks: Track[];
  }

  const { data, status } = await useAxios({
    url: uri,
    get: true,
  });

  if (status == 404) {
    new Notification("Playlist not found", NotifType.Error);
  }

  if (data) {
    return data as PlaylistData;
  }

  return null;
}

// ======== ADD ITEM TO PLAYLIST ========
export async function addItemToPlaylist(playlist: Playlist, props: {}) {
  const uri = `${basePlaylistUrl}/${playlist.id}/add`;

  const { status } = await useAxios({
    url: uri,
    props: props,
  });

  if (status == 409) {
    new Notification("Item already exists in playlist", NotifType.Error);
    return false;
  }

  new Notification("Item added to " + playlist.name);
  return true;
}

export function addTrackToPlaylist(playlist: Playlist, track: Track) {
  return addItemToPlaylist(playlist, {
    itemtype: "track",
    itemhash: track.trackhash,
  });
}

export function addAlbumToPlaylist(playlist: Playlist, albumhash: string) {
  return addItemToPlaylist(playlist, {
    itemtype: "album",
    itemhash: albumhash,
  });
}

export function addFolderToPlaylist(playlist: Playlist, path: string) {
  return addItemToPlaylist(playlist, {
    itemtype: "folder",
    itemhash: path,
  });
}

export function addArtistToPlaylist(playlist: Playlist, artisthash: string) {
  return addItemToPlaylist(playlist, {
    itemtype: "artist",
    itemhash: artisthash,
  });
}

// ===== SAVE ITEM AS =====

export async function saveItemAsPlaylist(itemtype: string, props: {}) {
  const { status } = await useAxios({
    url: paths.api.playlist.base + "/save-item",
    props: { itemtype, ...props },
  });

  const store = useNotifStore();

  if (status === 201) {
    store.showNotification("Playlist created successfully!", NotifType.Success);
    return true;
  }

  if (status === 409) {
    store.showNotification("Playlist already exists!", NotifType.Error);
    return false;
  }

  store.showNotification("Something went wrong!", NotifType.Error);
  return false;
}

export function saveTrackAsPlaylist(playlist_name: string, itemhash: string) {
  return saveItemAsPlaylist("track", {
    itemhash,
    playlist_name,
  });
}

export function saveAlbumAsPlaylist(playlist_name: string, itemhash: string) {
  return saveItemAsPlaylist("album", {
    itemhash,
    playlist_name,
  });
}

export function saveFolderAsPlaylist(playlist_name: string, itemhash: string) {
  return saveItemAsPlaylist("folder", {
    itemhash,
    playlist_name,
  });
}

export function saveArtistAsPlaylist(playlist_name: string, itemhash: string) {
  return saveItemAsPlaylist("artist", {
    itemhash,
    playlist_name,
  });
}

// ========== END =========

export async function updatePlaylist(
  pid: number,
  playlist: FormData,
  pStore: any
) {
  const uri = `${basePlaylistUrl}/${pid}/update`;

  const { data, status } = await useAxios({
    url: uri,
    put: true,
    props: playlist,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (status == 400) {
    new Notification("Failed: Unsupported image", NotifType.Error);
    return;
  }

  if (data) {
    pStore.updatePInfo(data.data);
    new Notification("Playlist updated!");
  }
}

/**
 * Gets the artists in a playlist.
 * @param pid The playlist id to fetch tracks for.
 * @returns {Promise<Artist[]>} A promise that resolves to an array of artists.
 */
export async function getPlaylistArtists(pid: number): Promise<Artist[]> {
  const { data, error } = await useAxios({
    url: playlistArtistsUrl,
    props: {
      pid: pid,
    },
  });

  if (error) {
    new Notification("Something funny happened!", NotifType.Error);
  }

  if (data) {
    return data.data as Artist[];
  }

  return [];
}

export async function deletePlaylist(pid: number) {
  const { status } = await useAxios({
    url: paths.api.playlist.base + "/delete",
    props: {
      pid,
    },
  });

  if (status == 200) {
    new Notification("Playlist deleted", NotifType.Success);
  }
}

export async function updateBannerPos(pid: number, pos: number) {
  const { status } = await useAxios({
    url: paths.api.playlist.base + `/${pid}/set-image-pos`,
    props: {
      pos,
    },
  });

  if (status === 200) {
    new Notification("Image position saved");
    return;
  }

  new Notification("Unable to save image position", NotifType.Error);
}

export async function removeTracks(
  pid: number,
  tracks: { trackhash: string; index: number }[]
) {
  const { status } = await useAxios({
    url: paths.api.playlist.base + `/${pid}/remove-tracks`,
    props: {
      tracks,
    },
  });

  if (status === 200) {
    new Notification("Tracks removed");
    return;
  }

  new Notification("Unable to remove tracks", NotifType.Error);
}

export async function removeBannerImage(playlistid: number) {
  const { data, status } = await useAxios({
    url: paths.api.playlist.base + `/${playlistid}/remove-img`,
    get: true,
  });

  if (status === 200) {
    new Notification("Banner image removed");
    return data.playlist as Playlist;
  }

  new Notification("Unable to remove banner image", NotifType.Error);
}
