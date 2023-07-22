package com.codepushmultidiffdemo;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.annotation.Nullable;

public class MainActivity extends Activity {

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main_act_loadbundle);

    findViewById(R.id.btn_go_buz1).setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {//点击进入rn业务1
        Intent intent = new Intent(MainActivity.this, ReactContentActivity.class);
        intent.putExtra("assetsBundleFileName", "module1");
        intent.putExtra("moduleName", "module1");
        startActivity(intent);
      }
    });
    findViewById(R.id.btn_go_buz2).setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {//点击进入rn业务2
        Intent intent = new Intent(MainActivity.this, ReactContentActivity.class);
        intent.putExtra("assetsBundleFileName", "module2");
        intent.putExtra("moduleName", "module2");
        startActivity(intent);
      }
    });
    findViewById(R.id.btn_go_buz3).setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {//点击进入rn业务3
        Intent intent = new Intent(MainActivity.this, ReactContentActivity.class);
        intent.putExtra("assetsBundleFileName", "module3");
        intent.putExtra("moduleName", "module3");
        startActivity(intent);
      }
    });
  }
}
