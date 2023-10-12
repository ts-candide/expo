package expo.modules.video

import android.annotation.SuppressLint
import android.content.Context
import android.view.ViewGroup
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView


@SuppressLint("ViewConstructor")
class VideoView(
  context: Context,
  appContext: AppContext
) : ExpoView(context, appContext) {
  private var isFullScreen = false

  var player: ExoPlayer? = null
    set(value) {
      field = value
      playerView.player = value?.apply {
        prepare()
      }
    }

  val playerView = PlayerView(context)

  fun releasePlayer() {
    player?.release()
    player = null
    playerView.player = null
  }

  fun enterFullScreen() {
    appContext.currentActivity?.window?.decorView?.systemUiVisibility = (SYSTEM_UI_FLAG_FULLSCREEN
      or SYSTEM_UI_FLAG_IMMERSIVE_STICKY
      or SYSTEM_UI_FLAG_HIDE_NAVIGATION)

    appContext.currentActivity?.actionBar?.hide()
    val params = playerView.layoutParams
    params.width = LayoutParams.MATCH_PARENT
    params.height = LayoutParams.MATCH_PARENT;
    playerView.layoutParams = params
    isFullScreen = true
  }

  fun exitFullScreen() {

  }

  init {
    val matchParent = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    layoutParams = matchParent
    addView(playerView, matchParent)
  }
}