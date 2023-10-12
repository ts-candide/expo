package expo.modules.video

import android.annotation.SuppressLint
import android.content.Context
import androidx.media3.common.C
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView


@SuppressLint("ViewConstructor")
class VideoView(
  context: Context,
  appContext: AppContext
) : ExpoView(context, appContext) {
  private var resumePosition: Long? = null

  var player: ExoPlayer? = null
    set(value) {
      field = value
      playerView.player = value?.apply {
        if (resumePosition != null) {
          seekTo(resumePosition!!)
        }
        prepare()
      }
    }

  val playerView = PlayerView(context)

  fun releasePlayer() {
    player?.let {
      resumePosition = if (it.isCurrentMediaItemSeekable) it.currentPosition.coerceAtLeast(0L) else C.TIME_UNSET
      it.release()
    }

    player = null
    playerView.player = null
  }

  init {
    val matchParent = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    layoutParams = matchParent
    addView(playerView, matchParent)
  }
}