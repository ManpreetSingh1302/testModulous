package com.testmodulous;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Process;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ExitAppModule extends ReactContextBaseJavaModule {

    ExitAppModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "ExitApp";
    }

    @ReactMethod
    public void exitApp() {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }

        // Show confirmation dialog
        activity.runOnUiThread(() -> {
            new AlertDialog.Builder(activity)
                .setTitle("Exit App")
                .setMessage("Are you sure you want to exit the app?")
                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        activity.finishAndRemoveTask(); // Remove from Recent Apps
                        Process.killProcess(Process.myPid()); // Kill the app process
                        System.exit(0); // Ensure full termination
                    }
                })
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss(); // Close dialog, keep app running
                    }
                })
                .show();
        });
    }
}
