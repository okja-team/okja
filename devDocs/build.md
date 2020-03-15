## Deploy Debug Android Studio

Delete android/platform folder 

npx ionic build
npx cap add android
npx cap sync
npx cap copy
npx cap open android

## Android LiveReload
ionic capacitor run android -l