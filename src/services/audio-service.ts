import { Howl } from 'howler'
import { Song } from '@/types'

export class AudioService {
  private howl: Howl | null = null
  private currentSong: Song | null = null
  private listeners: ((event: string, data?: any) => void)[] = []

  constructor() {
    // Initialize with empty howl to avoid errors
    this.howl = new Howl({
      src: [''],
      onload: () => this.notifyListeners('loaded'),
      onloaderror: (id, error) => this.notifyListeners('loaderror', error),
      onplay: () => this.notifyListeners('play'),
      onpause: () => this.notifyListeners('pause'),
      onstop: () => this.notifyListeners('stop'),
      onend: () => this.notifyListeners('end'),
      onseek: () => this.notifyListeners('seek'),
      onvolume: () => this.notifyListeners('volume'),
    })
  }

  loadTrack(song: Song): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.howl) {
        this.howl.unload()
      }

      this.currentSong = song
      
      // Detect file format from URL
      const url = song.url
      const format = this.detectAudioFormat(url)
      
      this.howl = new Howl({
        src: [url],
        format: format ? [format] : undefined,
        html5: true,
        preload: true,
        onload: () => {
          this.notifyListeners('loaded')
          resolve()
        },
        onloaderror: (id, error) => {
          this.notifyListeners('loaderror', error)
          reject(error)
        },
        onplay: () => this.notifyListeners('play'),
        onpause: () => this.notifyListeners('pause'),
        onstop: () => this.notifyListeners('stop'),
        onend: () => this.notifyListeners('end'),
        onseek: () => this.notifyListeners('seek'),
        onvolume: () => this.notifyListeners('volume'),
      })
    })
  }

  private detectAudioFormat(url: string): string | null {
    const extension = url.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'mp3':
        return 'mp3'
      case 'wav':
        return 'wav'
      case 'ogg':
        return 'ogg'
      case 'm4a':
        return 'm4a'
      case 'aac':
        return 'aac'
      case 'flac':
        return 'flac'
      default:
        return null
    }
  }

  play(): void {
    if (this.howl) {
      this.howl.play()
    }
  }

  pause(): void {
    if (this.howl) {
      this.howl.pause()
    }
  }

  stop(): void {
    if (this.howl) {
      this.howl.stop()
    }
  }

  seek(position: number): void {
    if (this.howl) {
      this.howl.seek(position)
    }
  }

  setVolume(volume: number): void {
    if (this.howl) {
      this.howl.volume(volume)
    }
  }

  getCurrentTime(): number {
    return this.howl ? this.howl.seek() : 0
  }

  getDuration(): number {
    return this.howl ? this.howl.duration() : 0
  }

  isPlaying(): boolean {
    return this.howl ? this.howl.playing() : false
  }

  isPaused(): boolean {
    return this.howl ? this.howl.state() === 'loaded' && !this.howl.playing() : false
  }

  getCurrentSong(): Song | null {
    return this.currentSong
  }

  addListener(callback: (event: string, data?: any) => void): () => void {
    this.listeners.push(callback)
    
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(event: string, data?: any): void {
    this.listeners.forEach(callback => callback(event, data))
  }

  destroy(): void {
    if (this.howl) {
      this.howl.unload()
      this.howl = null
    }
    this.currentSong = null
    this.listeners = []
  }
}

export const audioService = new AudioService()
