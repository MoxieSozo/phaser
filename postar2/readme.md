## MicroStar GABF Poster App

### CLI Commands

#### Install first 

You should only have to run this once.

1. npm install
1. bower install

#### Run the App 

1. gulp
1. ionic serve

### Assets

####JS

/postar2/build/js

####Stylesheets

/postar2/build/less
**compiles to screen.css**

####Templates
/postar2/www/templates

####HTML & Includes
/postar2/www/index.html

## Deploying to Android
### https://developer.android.com/studio/publish/app-signing.html#considerations
-- change 0-1-4 to the new version
-- 23.0.3 = location of android sdk 
run ./build-android.sh 23.0.3 0-1-4
when asked for password : enter MSweb7210!!

