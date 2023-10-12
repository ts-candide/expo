package expo.modules.video

import androidx.media3.ui.AspectRatioFrameLayout
import expo.modules.kotlin.types.Enumerable

enum class VideoContentFit(val value: String) : Enumerable {
  CONTAIN("contain"),
  COVER("cover"),
  FILL("fill");

  fun toAspectRatioFrameLayout(): Int {
    return when(this) {
      CONTAIN -> AspectRatioFrameLayout.RESIZE_MODE_FIT
      COVER -> AspectRatioFrameLayout.RESIZE_MODE_FILL
      FILL -> AspectRatioFrameLayout.RESIZE_MODE_FILL
    }
  }
}