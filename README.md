------------------------------------------------------------------------------------------------------
1. Start Project:
  1) In config file you should write email and password for this email (and db info)
  2) Create folder avatars, video, musics, photo (If you want upload musics, avatars, video and photo)
  3) Connect to DB in app module
  4) npm start (server start in port 3000)
2. Modules:
  1) signin
  2) signup
  3) myVideo
  4) myPhoto
  5) myMusics
  6) friends
  7) chat
  8) add-friend
  9) acountSettings
3. Technologies:
  Backend:  
    Framework: Nest js
    DB: MySql
  Layout: HTML/CSS + Metro Css, Responsive, Metro
  Front-end: JavaScript (Native), Metro
 

4. Problems module
  1) Chat  (maybe don't better solution) 
  2) signin/signup (auth) - maybe don't better solution 

5. How chat work ?
  1) If user go to link for send messages to user in DB created one row (sender (id user), getter (id user getter), chatId (random id chat. This id use for WebSockets room )) 
  2) If user send message in DB create second row (where sender=getter, getter=sender)
  3) If first and second row exists - loading messages

6. In error-filter folder I try create my error validation

7. How work auth ? 
  After you write correct username and password you get token.
  This token check in middleware (middleware folder ...)
  but if you don't auth you can watch another user account (listen music, watch video, look on photo )

8. TypeError: Cannot read properties of undefined (reading '_id'). Don't worry ... Project work .. but I don't know why I get this message :) (Work don't touch)
------------------------------------------------------------------------------------------------------
