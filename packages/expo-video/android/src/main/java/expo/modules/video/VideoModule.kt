package expo.modules.video

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.media3.common.C.VOLUME_FLAG_ALLOW_RINGER_MODES
import androidx.media3.common.MediaItem
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.SeekParameters
import androidx.media3.exoplayer.SimpleExoPlayer
import androidx.media3.ui.AspectRatioFrameLayout
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.async
import kotlinx.coroutines.launch
import java.util.concurrent.Executors

class VideoModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()
  private val player by lazy {
    ExoPlayer.Builder(context)
      .setLooper(Looper.getMainLooper())
      .build()
  }

  override fun definition() = ModuleDefinition {
    Name("ExpoVideo")

    View(VideoView::class) {
      Prop("player") { view, player: VideoPlayer? ->
        player?.let {
          view.player = it.ref
        }
      }

      Prop("nativeControls") { view, nativeControls: Boolean? ->
        view.playerView.useController = nativeControls ?: false
      }

      Prop("contentFit") { view, contentFit: String? ->
        view.playerView.resizeMode = AspectRatioFrameLayout.RESIZE_MODE_FIT
      }

      OnViewDestroys { view: VideoView ->
        view.releasePlayer()
      }

      OnViewDidUpdateProps {
        Log.d("PROPS", "Update")
      }
    }

    Class(VideoPlayer::class) {
      Constructor { source: String? ->
        if (source != null) {
          val item = MediaItem.fromUri(source)
          appContext.currentActivity?.runOnUiThread {
            player.clearMediaItems()
            player.addMediaItem(item)
          }
        }

        VideoPlayer(player)
      }

      Property("isPlaying") { player: VideoPlayer ->
        var isPlaying = false
        appContext.currentActivity?.runOnUiThread {
          isPlaying = player.ref.isPlaying
        }
        return@Property isPlaying
      }

      Property("isMuted") { player: VideoPlayer ->
        return@Property player.ref.isDeviceMuted
      }.set { player: VideoPlayer, isMuted: Boolean? ->
        appContext.currentActivity?.runOnUiThread {
          player.ref.setDeviceMuted(isMuted ?: false, 0)
        }
      }

      Function("play") { player: VideoPlayer ->
        appContext.currentActivity?.runOnUiThread {
          player.ref.play()
        }
      }

      Function("pause") { player: VideoPlayer ->
        appContext.currentActivity?.runOnUiThread {
          player.ref.pause()
        }
      }

      Function("seekBy") { player: VideoPlayer, seconds: Int ->
        appContext.currentActivity?.runOnUiThread {
          player.ref.seekTo(player.ref.contentPosition + (seconds * 1000).toLong())
        }
      }

      Function("replace") { player: VideoPlayer, source: String ->
        val newItem = MediaItem.fromUri(source)
        appContext.currentActivity?.runOnUiThread {
          player.ref.clearMediaItems()
          player.ref.addMediaItem(newItem)
          player.ref.play()
        }
      }

      Function("replay") { player: VideoPlayer ->
        appContext.currentActivity?.runOnUiThread {
          player.ref.seekTo(0)
          player.ref.play()
        }
      }
    }
  }
}
