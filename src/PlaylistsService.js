const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistWithSongs(playlistId) {
    const playlistQuery = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    const songsQuery = {
      text: `
      SELECT songs.id, songs.title, songs.performer
      FROM songs
      LEFT JOIN playlistsongs ON playlistsongs.song_id = songs.id
      WHERE playlistsongs.playlist_id = $1
      `,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);

    const playlist = {
      id: playlistResult.rows[0].id,
      name: playlistResult.rows[0].name,
      songs: songsResult.rows,
    };

    return { playlist };
  }
}

module.exports = PlaylistsService;
