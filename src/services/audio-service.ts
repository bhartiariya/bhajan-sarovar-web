import { Howl } from 'howler'
import { Song } from '@/types'

export class AudioService {
  private howl: Howl | null = null
  private currentSong: Song | null = null
  private listeners: ((event: string, data?: any) => void)[] = []

  constructor() {
    // Don't initialize with empty howl - wait for actual track
    this.howl = null
  }

  loadTrack(song: Song): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!song.url) {
        reject(new Error('No audio URL provided'))
        return
      }

      if (this.howl) {
        this.howl.unload()
      }

      this.currentSong = song
      
      // For testing - use a known working audio URL if the original fails
      const testUrl = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
      
      // Alternative test URLs
      const alternativeUrls = [
        'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav',
        'https://file-examples.com/storage/fe68c8b4a7b4a7b4a7b4a7b/2017/11/file_example_MP3_700KB.mp3'
      ]
      
      // Detect file format from URL and handle URL encoding
      let url = song.url
      
      // Fix URL encoding issues - handle Firebase S3 URLs properly
      if (url.includes('+')) {
        // For Firebase S3 URLs, replace + with %20 for proper encoding
        url = url.replace(/\+/g, '%20')
      }
      
      // Ensure URL is properly encoded
      try {
        const urlObj = new URL(url)
        // Don't re-encode the URL as it might break S3 URLs
        console.log('🎵 URL validation passed')
      } catch (e) {
        console.warn('⚠️ Invalid URL format, using as-is:', url)
      }
      
      const format = this.detectAudioFormat(url)
      
      console.log('🎵 Loading track:', song.name, 'Original URL:', song.url)
      console.log('🎵 Processed URL:', url)
      
      this.howl = new Howl({
        src: [url],
        format: format ? [format] : undefined,
        html5: true,
        preload: true,
        volume: 1.0, // Ensure volume is at maximum
        xhr: {
          method: 'GET',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        },
        onload: () => {
          console.log('✅ Track loaded successfully')
          console.log('🎵 Howl state after load:', this.howl?.state())
          console.log('🎵 Howl duration after load:', this.howl?.duration())
          this.notifyListeners('loaded')
          resolve()
        },
        onloaderror: (id, error) => {
          console.error('❌ Track load error:', error)
          console.error('❌ URL that failed:', url)
          
          // Try fallback URLs for testing
          const tryFallbackUrl = (urlIndex: number) => {
            if (urlIndex >= alternativeUrls.length) {
              console.error('❌ All fallback URLs failed')
              this.notifyListeners('loaderror', error)
              reject(error)
              return
            }
            
            const fallbackUrl = alternativeUrls[urlIndex]
            console.log(`🔄 Trying fallback URL ${urlIndex + 1}/${alternativeUrls.length}:`, fallbackUrl)
            
            this.howl = new Howl({
              src: [fallbackUrl],
              html5: true,
              preload: true,
              volume: 1.0,
              onload: () => {
                console.log('✅ Fallback track loaded successfully')
                this.notifyListeners('loaded')
                resolve()
              },
              onloaderror: (id, error) => {
                console.error(`❌ Fallback URL ${urlIndex + 1} failed:`, error)
                tryFallbackUrl(urlIndex + 1)
              },
              onplay: () => this.notifyListeners('play'),
              onpause: () => this.notifyListeners('pause'),
              onstop: () => this.notifyListeners('stop'),
              onend: () => this.notifyListeners('end'),
              onseek: () => this.notifyListeners('seek'),
              onvolume: () => this.notifyListeners('volume'),
            })
          }
          
          if (!alternativeUrls.includes(url)) {
            tryFallbackUrl(0)
          } else {
            this.notifyListeners('loaderror', error)
            reject(error)
          }
        },
        onplay: () => {
          console.log('▶️ Track started playing')
          this.notifyListeners('play')
        },
        onpause: () => {
          console.log('⏸️ Track paused')
          this.notifyListeners('pause')
        },
        onstop: () => {
          console.log('⏹️ Track stopped')
          this.notifyListeners('stop')
        },
        onend: () => {
          console.log('🔚 Track ended')
          this.notifyListeners('end')
        },
        onseek: () => this.notifyListeners('seek'),
        onvolume: () => this.notifyListeners('volume'),
      })
      
      // Check if Howl is ready immediately
      console.log('🎵 Howl created, checking state...')
      console.log('🎵 Initial Howl state:', this.howl.state())
      
      // If the audio is already loaded (cached), resolve immediately
      if (this.howl.state() === 'loaded') {
        console.log('✅ Track already loaded (cached)')
        console.log('🎵 Howl state:', this.howl.state())
        console.log('🎵 Howl duration:', this.howl.duration())
        this.notifyListeners('loaded')
        resolve()
      }
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
      console.log('🎵 Attempting to play track')
      console.log('🎵 Howl state:', this.howl.state())
      console.log('🎵 Howl duration:', this.howl.duration())
      console.log('🎵 Howl volume:', this.howl.volume())
      
      // Ensure volume is set
      this.howl.volume(1.0)
      
      const soundId = this.howl.play()
      console.log('🎵 Play returned sound ID:', soundId)
      
      // Check if it's actually playing after a short delay
      setTimeout(() => {
        console.log('🎵 Playing check - isPlaying:', this.howl?.playing())
        console.log('🎵 Playing check - state:', this.howl?.state())
      }, 100)
    } else {
      console.warn('⚠️ No track loaded to play')
    }
  }

  pause(): void {
    if (this.howl) {
      console.log('🎵 Pausing track')
      this.howl.pause()
    } else {
      console.warn('⚠️ No track loaded to pause')
    }
  }

  stop(): void {
    if (this.howl) {
      console.log('🎵 Stopping track')
      this.howl.stop()
    } else {
      console.warn('⚠️ No track loaded to stop')
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

  getVolume(): number {
    return this.howl ? this.howl.volume() : 0.8
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
