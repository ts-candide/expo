package expo.modules.splashscreen

import android.content.Context
import androidx.annotation.UiThread
import androidx.annotation.WorkerThread
import com.facebook.react.ReactActivity
import com.facebook.react.ReactNativeHost
import expo.modules.splashscreen.singletons.SplashScreen
import expo.modules.core.interfaces.Package
import expo.modules.core.interfaces.ReactActivityHandler
import expo.modules.core.interfaces.ReactActivityLifecycleListener
import expo.modules.core.interfaces.SingletonModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class SplashScreenPackage : Package {
  override fun createSingletonModules(context: Context?): List<SingletonModule> {
    return listOf(SplashScreen)
  }

  override fun createReactActivityLifecycleListeners(activityContext: Context): List<ReactActivityLifecycleListener> {
    return listOf(SplashScreenReactActivityLifecycleListener(activityContext))
  }

  override fun createReactActivityHandlers(activityContext: Context): List<ReactActivityHandler> {
    val handler = object : ReactActivityHandler {
      override fun getDelayLoadAppHandler(activity: ReactActivity, reactNativeHost: ReactNativeHost): ReactActivityHandler.DelayLoadAppHandler? {
        val context = activity.applicationContext
        val useDeveloperSupport = reactNativeHost.useDeveloperSupport
          return ReactActivityHandler.DelayLoadAppHandler { whenReadyRunnable ->
            CoroutineScope(Dispatchers.IO).launch {
              waitForSplashScreenToHide(context)
              invokeReadyRunnable(whenReadyRunnable)
            }
          }
        return null
      }

      @WorkerThread
      private suspend fun waitForSplashScreenToHide(context: Context) {
        withContext(Dispatchers.IO) {
          while (SplashScreen.showing) {
            delay(1000)
          }
        }
      }

      @UiThread
      private suspend fun invokeReadyRunnable(whenReadyRunnable: Runnable) {
        withContext(Dispatchers.Main) {
          whenReadyRunnable.run()
        }
      }
    }

    return listOf(handler)
  }
}
