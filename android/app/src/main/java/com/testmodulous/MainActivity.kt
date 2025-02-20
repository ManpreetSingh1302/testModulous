package com.testmodulous

import android.app.AlertDialog
import android.os.Process
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String = "testModulous"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onBackPressed() {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Exit App")
            .setMessage("Are you sure you want to exit the app?")
            .setPositiveButton("OK") { _, _ ->
                finishAndRemoveTask() // Close all activities & remove from Recent Apps
                Process.killProcess(Process.myPid()) // Kill the app process
                System.exit(0) // Ensure full termination
            }
            .setNegativeButton("Cancel") { dialog, _ ->
                dialog.dismiss() // Close dialog and stay in the app
            }
            .show()
    }
}
