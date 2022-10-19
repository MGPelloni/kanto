function kanto_server_install(){db.query("DROP TABLE games, maps, users;",function(e,i){e&&console.log(e.toString()),console.log("Successfully uninstalled Kanto."),console.log("Running Kanto installation.."),db.query("CREATE TABLE games (id SERIAL PRIMARY KEY, name TEXT, game_id TEXT, author_id BIGINT, game_data TEXT, featured BOOL DEFAULT 'f');",function(e,i){e?console.log(e.toString()):fs.readdir("templates/games/",(e,i)=>{i.forEach(e=>{let t=JSON.parse(fs.readFileSync("templates/games/"+e,"utf8"));e=generate_game_id();db.query("INSERT INTO games (name, game_id, game_data, featured) values ($1, $2, $3, $4);",[t.meta.name,e,JSON.stringify(t),"t"],function(e,i){console.log("Inserted game:",t.meta.name),e&&console.log(e.toString())})})})}),db.query("CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR ( 50 ) UNIQUE NOT NULL, password VARCHAR ( 50 ) NOT NULL, email VARCHAR ( 255 ) UNIQUE NOT NULL, created_on TIMESTAMP NOT NULL, last_login TIMESTAMP );",function(e,i){e&&console.log(e.toString())}),db.query("CREATE TABLE maps (id SERIAL PRIMARY KEY, name TEXT, data TEXT);",function(e,i){e?console.log(e.toString()):fs.readdir("templates/maps/",(e,i)=>{i.forEach(e=>{e=JSON.parse(fs.readFileSync("templates/maps/"+e,"utf8"));db.query("INSERT INTO maps (name, data) values ($1, $2);",[e.name,JSON.stringify(e)],function(e,i){e&&console.log(e.toString())}),console.log("Inserted map:",e.name)})})})})}function generate_game_id(i=11){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";let s="";for(let e=0;e<i;e++)s+=t.charAt(Math.floor(Math.random()*t.length));return s}function find_lobby_index(t){let s=null;return lobbies.forEach((e,i)=>{e.id==t&&(s=i)}),s}function find_trainer_index(e,t){let s=null;return lobbies[e]&&lobbies[e].trainers.forEach((e,i)=>{t==e.socket_id&&(s=i)}),s}function requireHTTPS(e,i,t){if(!e.secure&&"https"!==e.get("x-forwarded-proto")&&"development"!==process.env.NODE_ENV)return i.redirect("https://"+e.get("host")+e.url);t()}items=[{name:"POKé BALL",type:"Ball"},{name:"GREAT BALL",type:"Ball"},{name:"POTION",type:"Restore"},{name:"SUPER POTION",type:"Restore"},{name:"ANTIDOTE",type:"Status"},{name:"BICYCLE",type:"Special"}];const express=require("express"),ejs=require("ejs"),app=express(),server=require("http").Server(app),path=require("path"),bodyParser=require("body-parser"),fs=require("fs"),Server=require("socket.io")["Server"],io=new Server(server),Client=require("pg")["Client"],db=new Client({connectionString:process.env.DATABASE_URL}),lobbies=[];app.set("view engine","ejs"),app.use(requireHTTPS),app.use(express.json({limit:"50mb"})),app.use("/assets",express.static(path.join(__dirname,"assets"))),app.use("/dist",express.static(path.join(__dirname,"dist"))),db.connect(),server.listen(process.env.PORT||8e3),app.get("/",function(e,s){db.query("SELECT * FROM games WHERE featured=true ORDER BY name ASC;",function(e,i){if(e)console.log(e.toString());else{let t=i.rows;db.query("SELECT * FROM games WHERE featured=false ORDER BY name ASC;",function(e,i){e?console.log(e.toString()):(e=i.rows,s.render("home",{featured_games:t,user_games:e}))})}})}),app.get("/play",(e,i)=>{e=e.header("x-forwarded-for")||e.connection.remoteAddress;console.log("Connection attempt from "+e+" accepted."),i.render("play")}),app.get("/create",(e,i)=>{e=e.header("x-forwarded-for")||e.connection.remoteAddress;console.log("Connection attempt from "+e+" accepted."),i.render("create")}),app.get("/reset",(e,i)=>{kanto_server_install(),i.send("Success")}),app.get("/games",(e,t)=>{e.header("x-forwarded-for")||e.connection.remoteAddress;db.query("SELECT * FROM games;",function(e,i){e?console.log(e.toString()):t.json(i.rows)})}),app.get("/templates/games",(e,s)=>{fs.readdir("templates/games/",(e,i)=>{let t=[];i.forEach(e=>{t.push(JSON.parse(fs.readFileSync("templates/games/"+e,"utf8")))}),s.json(t)})}),app.get("/templates/maps",(e,s)=>{fs.readdir("templates/maps/",(e,i)=>{let t=[];i.forEach(e=>{t.push(JSON.parse(fs.readFileSync("templates/maps/"+e,"utf8")))}),s.json(t)})}),app.get("/maps",(e,t)=>{e.header("x-forwarded-for")||e.connection.remoteAddress;db.query("SELECT * FROM maps;",function(e,i){e?console.log(e.toString()):t.json(i.rows)})}),app.post("/game",(e,t)=>{e=e.body.game;e?db.query("SELECT * FROM games WHERE game_id=$1;",[e],function(e,i){e?console.log(e.toString()):0<i.rows.length?t.json(i.rows[0].game_data):db.query("SELECT * FROM games WHERE name=$1;",["Pallet Town"],function(e,i){e&&console.log(e.toString()),t.json(i.rows[0].game_data)})}):db.query("SELECT * FROM games WHERE name=$1;",["Pallet Town"],function(e,i){e&&console.log(e.toString()),t.json(i.rows[0])})}),app.post("/upload",(t,e)=>{var i=t.header("x-forwarded-for")||t.connection.remoteAddress;console.log("Upload attempt from "+i+" accepted.");let s=null;t.body.meta.game_id&&(s=t.body.meta.game_id),console.log(s,t.body),s?db.query("SELECT * FROM games WHERE game_id=$1;",[s],function(e,i){e?console.log(e.toString()):0<i.rows.length&&db.query("UPDATE games SET game_data=$2 WHERE game_id=$1;",[s,t.body],function(e,i){e&&console.log(e.toString())})}):(s=generate_game_id(),t.body.meta.game_id=s,db.query("INSERT INTO games (name, game_id, game_data) values ($1, $2, $3);",[t.body.meta.name,s,t.body],function(e,i){e&&console.log(e.toString())})),e.json({success:!0,game_id:s})}),io.on("connection",o=>{console.log("New socket: ",o.id),o.on("join_lobby",t=>{var e,i=new Trainer(o.id,t.trainer.name,t.trainer.position,t.trainer.spritesheet_id);let s=null;lobbies.forEach((e,i)=>{t.lobby_id==e.id&&(s=i)}),null===s?(e=new Lobby(t.lobby_id,t.game_id,[i]),lobbies.push(e)):(o.emit("create_current_trainers",lobbies[s].trainers),lobbies[s].chat.direct_message(o.id,`Welcome to Kanto. There are ${lobbies[s].trainers.length} other players in this game.`),lobbies[s].trainers.push(i),lobbies[s].chat.server_message(i.name+" has connected.")),o.join(t.lobby_id),o.to(t.lobby_id).emit("trainer_joined",{name:i.name,position:i.position,spritesheet_id:t.trainer.spritesheet_id,socket_id:o.id});find_lobby_index(t.lobby_id)}),o.on("position_update",e=>{var i=find_lobby_index(e.lobby_id),t=find_trainer_index(i,o.id);null!==i&&(lobbies[i].trainers[t].position=e.trainer.position,o.to(lobbies[i].id).emit("trainer_moved",{socket_id:lobbies[i].trainers[t].socket_id,position:lobbies[i].trainers[t].position,exiting:e.trainer.exiting}))}),o.on("facing_update",e=>{var i=find_lobby_index(e.lobby_id),t=find_trainer_index(i,o.id);null!==i&&(lobbies[i].trainers[t].position.f=e.f,o.to(lobbies[i].id).emit("trainer_faced",{socket_id:lobbies[i].trainers[t].socket_id,f:lobbies[i].trainers[t].position.f}))}),o.on("speed_update",e=>{var i=find_lobby_index(e.lobby_id),t=find_trainer_index(i,o.id);null!==i&&(lobbies[i].trainers[t].speed=e.s,o.to(lobbies[i].id).emit("trainer_speed",{socket_id:lobbies[i].trainers[t].socket_id,s:lobbies[i].trainers[t].speed}))}),o.on("spritesheet_update",e=>{var i=find_lobby_index(e.lobby_id),t=find_trainer_index(i,o.id);null!==i&&(lobbies[i].trainers[t].spritesheet_id=e.spritesheet_id,o.to(lobbies[i].id).emit("trainer_sprite",{socket_id:lobbies[i].trainers[t].socket_id,spritesheet_id:lobbies[i].trainers[t].spritesheet_id}))}),o.on("name_update",e=>{var i=find_lobby_index(e.lobby_id),t=find_trainer_index(i,o.id);null!==i&&(lobbies[i].chat.server_message(`${lobbies[i].trainers[t].name} has changed their name to ${e.name}.`),lobbies[i].trainers[t].name=e.name,o.to(lobbies[i].id).emit("trainer_name",{socket_id:lobbies[i].trainers[t].socket_id,name:lobbies[i].trainers[t].name}))}),o.on("player_encounter",e=>{console.log("player_encounter",e);var s=find_lobby_index(e.lobby_id),e=find_trainer_index(s,o.id);if(null!==s){let i=lobbies[s].trainers[e],t=[];switch(i.position.f){case 0:lobbies[s].trainers.forEach(e=>{e.position.map==i.position.map&&e.position.x==i.position.x&&e.position.y<i.position.y&&i.position.y-e.position.y<=5&&t.push(e)});break;case 1:lobbies[s].trainers.forEach(e=>{e.position.map==i.position.map&&e.position.x>i.position.x&&e.position.y==i.position.y&&e.position.x-i.position.x<=5&&t.push(e)});break;case 2:lobbies[s].trainers.forEach(e=>{e.position.map==i.position.map&&e.position.x==i.position.x&&e.position.y>i.position.y&&e.position.y-i.position.y<=5&&t.push(e)});break;case 3:lobbies[s].trainers.forEach(e=>{e.position.map==i.position.map&&e.position.x<i.position.x&&e.position.y==i.position.y&&i.position.x-e.position.x<=5&&t.push(e)})}0<t.length&&(io.to(i.socket_id).emit("player_encounter",{socket_id:t[0].socket_id}),io.to(t[0].socket_id).emit("player_encountered",{socket_id:i.socket_id}),lobbies[s].chat.server_message(`${i.name} has challenged ${t[0].name} to a BATTLE!`))}}),o.on("map_server_sync",i=>{console.log("map_server_sync",i);var e=find_lobby_index(i.lobby_id);let t=[];lobbies[e]&&(lobbies[e].npcs.forEach(e=>{e.position.map==i.map&&t.push({uid:e.uid,position:e.position})}),o.emit("map_server_sync",{npcs:t}))}),o.on("disconnecting",e=>{let i=null;var t,s;o.rooms.forEach(e=>{e!==o.id&&(i=e)}),i&&(s=find_trainer_index(t=find_lobby_index(i),o.id),lobbies[t].chat.server_message(lobbies[t].trainers[s].name+" has disconnected."),lobbies[t].trainers.splice(s,1)),io.to(i).emit("trainer_disconnected",o.id)}),o.on("chat_add_message",e=>{var i=find_lobby_index(e.lobby_id),t=find_trainer_index(i,o.id);null!==i&&null!==t&&lobbies[i].chat.trainer_message(lobbies[i].trainers[t],e.message)})});class Chat{constructor(e){this.lobby_id=e,this.messages=[],this.pattern="^[^<>/]*$",this.regex=new RegExp(this.pattern),this.banned_words=["fag","fagging","faggitt","faggot","faggs","fagot","fagots","fags","gaylord","n1gga","n1gger","nigg3r","nigg4h","nigga","niggah","niggas","niggaz","nigger","niggers","retard"]}trainer_message(e,i){var t;this.test_message(i)&&(this.messages.push(e.name+": "+i),t={color:e.color},io.to(this.lobby_id).emit("chat_trainer_message",{name:e.name,message:i,atts:t}))}server_message(e){this.messages.push("Server: "+e),io.to(this.lobby_id).emit("chat_server_message",{message:e})}direct_message(e,i){io.to(e).emit("chat_server_message",{message:i})}test_message(i){if(!this.regex.test(i))return!1;let t=!1;return this.banned_words.forEach(e=>{i.includes(e)&&(t=!0)}),!t}edit_message(){}delete_message(){}sync(){}}class Lobby{constructor(e=null,i=null,t=[]){this.id=e,this.game_id=i,this.trainers=t,this.game=!1,this.import_data=this.retrieve_game(i),this.loaded=!1,this.import_data.then(e=>this.generate_game(e),e=>console.log("Error importing game:",i))}async retrieve_game(e){return console.log("Retrieving game..",e),(await db.query("SELECT * FROM games WHERE game_id=$1;",[e])).rows[0]}generate_game(e){this.game=JSON.parse(e.game_data),this.npcs=[],this.items=[],this.chat=new Chat(this.id),this.game.maps.forEach((e,i)=>{e.id=i,this.build_npcs(e)}),this.loaded=!0}build_npcs(t){let s=0;for(let i=0;i<t.height;i++)for(let e=0;e<t.width;e++){var o=e+t.width*i,o=t.atts[o];5==o.type&&(this.npcs.push(new Npc({map:t.id,x:e,y:i},o.facing,o.movement_state,t,this.id,s)),s++)}}close(){}}class Npc{constructor(e={map:0,x:0,y:0,f:0},i="South",t="Active",s=null,o=0,n=0){this.position=e,this.facing=i,this.map=s,this.movement_state=t,this.index=n,this.lobby_id=o,this.initial_properties={position:e,facing:i},this.uid=`M${this.position.map}X${this.position.x}Y`+this.position.y,"Active"==this.movement_state&&(this.wander_interval=setInterval(this.wander,1e3,this))}place(e,i){this.position.index=this.position.x+this.map.width*this.position.y,this.position.tile=map.atts[e+this.map.width*i]}position_update(){this.position.index=this.position.x+this.map.width*this.position.y,this.position.tile=this.map.tiles[this.position.index],this.position.att=this.map.atts[this.position.index]}move(e){let i={x:this.position.x,y:this.position.y};switch(e){case"East":i.x++;break;case"West":i.x--;break;case"North":i.y--;break;case"South":i.y++}if(!this.collision_check(i.x,i.y)){switch(this.moving=!0,this.current_move_ticker=0,e){case"North":this.facing="North",this.position.y--,this.position.f=0;break;case"East":this.facing="East",this.position.x++,this.position.f=1;break;case"South":this.facing="South",this.position.y++,this.position.f=2;break;case"West":this.facing="West",this.position.x--,this.position.f=3}io.to(this.lobby_id).emit("npc_moved",{uid:this.uid,position:this.position,moving:e})}}wander(e){var i=Math.floor(5*Math.random())+1,t=Math.floor(3*Math.random())+1;1==i&&e.move(["North","South","East","West"][t])}collision_check(i,t){let e=find_lobby_index(this.lobby_id),s=!1;if(i<0||i>=this.map.width)return!0;if(t<0||t>=this.map.height)return!0;switch(this.map.atts[i+this.map.width*t].type){case 1:case 3:case 6:case 7:return!0}return lobbies[e].trainers.forEach(e=>{i==e.position.x&&t==e.position.y&&(s=!0)}),lobbies[e].npcs.forEach(e=>{this.position.map==e.position.map&&i==e.position.x&&t==e.position.y&&(s=!0)}),s}}class Trainer{constructor(e=null,i="RED",t={map:1,x:5,y:5},s=0){this.socket_id=e,this.name=i,this.position=t,this.spritesheet_id=s,this.facing="South",this.color="#"+Math.floor(16777215*Math.random()).toString(16)}}