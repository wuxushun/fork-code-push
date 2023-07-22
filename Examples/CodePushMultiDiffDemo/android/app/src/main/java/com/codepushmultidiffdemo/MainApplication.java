package com.codepushmultidiffdemo;

import android.app.Application;

public class MainApplication extends Application {

    public static Application mApplication;

  @Override
  public void onCreate() {
    super.onCreate();
      MainApplication.mApplication = this;
  }
}
