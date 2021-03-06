import { getLyric } from "api/song"
import { ERR_OK } from "../../api/config"
import { Base64 } from "js-base64"

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric);
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject("no lyric")
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `https://api.newview.top/music/?action=getSongSource&songId=${musicData.songmid}&play=1]&vendor=QQ`,
  })
}

export function modifySong(musicData) {
  return new Song({
    id: Math.random(),
    mid: getSongMid(musicData.mp3),
    singer: getSinger(musicData.artist),
    name: musicData.name,
    album: getAlbumId(musicData.cover),
    duration: musicData.interval,
    image: musicData.cover,
    url: musicData.mp3,
  })
}

function getAlbumId(albumUrl) {
  return getQueryVariable(albumUrl, 'albumMid')
}

function getSongMid (songUrl) {
  return getQueryVariable(songUrl, 'songId')
}

function getQueryVariable(url, param) {
  var temp = url.split('?')[1]
  var parm = new URLSearchParams('?' + temp)
  return parm.get(param)
}

function getSinger (singer) {
  if (!singer) {
    return ""
  }
  let temp = singer.split('、')
  return temp.join("/")
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ""
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join("/")
}
