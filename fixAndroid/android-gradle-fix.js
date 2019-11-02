/* eslint-disable */
doLast {
  def moveFunc = { resSuffix ->
      File originalDir = file("$buildDir/generated/res/react/release/drawable-${resSuffix}");
      if (originalDir.exists()) {
          File destDir = file("$buildDir/../src/main/res/drawable-${resSuffix}");
          ant.move(file: originalDir, tofile: destDir);
      }
  }

  moveFunc.curry("ldpi").call()
  moveFunc.curry("mdpi").call()
  moveFunc.curry("hdpi").call()
  moveFunc.curry("xhdpi").call()
  moveFunc.curry("xxhdpi").call()
  moveFunc.curry("xxxhdpi").call()

  File originalDir = file("$buildDir/generated/res/react/release/raw");
      if (originalDir.exists()) {
          File destDir = file("$buildDir/../src/main/res/raw");
          ant.move(file: originalDir, tofile: destDir);
  }
}

// Set up inputs and outputs so gradle can cache the result