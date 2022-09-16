function kanto_server_install(){db.query("DROP TABLE games, maps, users;",function(e,t){e&&console.log(e.toString()),console.log("Successfully uninstalled Kanto."),console.log("Running Kanto installation.."),db.query("CREATE TABLE games (id SERIAL PRIMARY KEY, name TEXT, game_id TEXT, author_id BIGINT, game_data TEXT, featured BOOL DEFAULT 'f');",function(e,t){e?console.log(e.toString()):fs.readdir("templates/games/",(e,t)=>{t.forEach(e=>{let i=JSON.parse(fs.readFileSync("templates/games/"+e,"utf8"));e=generate_game_id();db.query("INSERT INTO games (name, game_id, game_data, featured) values ($1, $2, $3, $4);",[i.meta.name,e,JSON.stringify(i),"t"],function(e,t){console.log("Inserted game:",i.meta.name),e&&console.log(e.toString())})})})}),db.query("CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR ( 50 ) UNIQUE NOT NULL, password VARCHAR ( 50 ) NOT NULL, email VARCHAR ( 255 ) UNIQUE NOT NULL, created_on TIMESTAMP NOT NULL, last_login TIMESTAMP );",function(e,t){e&&console.log(e.toString())}),db.query("CREATE TABLE maps (id SERIAL PRIMARY KEY, name TEXT, data TEXT);",function(e,t){e?console.log(e.toString()):fs.readdir("templates/maps/",(e,t)=>{t.forEach(e=>{e=JSON.parse(fs.readFileSync("templates/maps/"+e,"utf8"));db.query("INSERT INTO maps (name, data) values ($1, $2);",[e.name,JSON.stringify(e)],function(e,t){e&&console.log(e.toString())}),console.log("Inserted map:",e.name)})})})})}function generate_game_id(t=11){var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";let o="";for(let e=0;e<t;e++)o+=i.charAt(Math.floor(Math.random()*i.length));return o}function find_lobby_index(i){let o=null;return lobbies.forEach((e,t)=>{e.id==i&&(o=t)}),o}function find_trainer_index(e,i){let o=null;return lobbies[e]&&lobbies[e].trainers.forEach((e,t)=>{i==e.socket_id&&(o=t)}),o}function requireHTTPS(e,t,i){if(!e.secure&&"https"!==e.get("x-forwarded-proto")&&"development"!==process.env.NODE_ENV)return t.redirect("https://"+e.get("host")+e.url);i()}items=[{name:"POKé BALL",type:"Ball"},{name:"GREAT BALL",type:"Ball"},{name:"POTION",type:"Restore"},{name:"SUPER POTION",type:"Restore"},{name:"ANTIDOTE",type:"Status"},{name:"BICYCLE",type:"Special"}];const express=require("express"),ejs=require("ejs"),app=express(),server=require("http").Server(app),path=require("path"),bodyParser=require("body-parser"),fs=require("fs"),Server=require("socket.io")["Server"],io=new Server(server),Client=require("pg")["Client"],db=new Client({connectionString:process.env.DATABASE_URL}),lobbies=[],items=[];app.set("view engine","ejs"),app.use(requireHTTPS),app.use(express.json({limit:"50mb"})),app.use("/assets",express.static(path.join(__dirname,"assets"))),app.use("/dist",express.static(path.join(__dirname,"dist"))),db.connect(),server.listen(process.env.PORT||8e3),app.get("/",function(e,o){db.query("SELECT * FROM games WHERE featured=true ORDER BY name ASC;",function(e,t){if(e)console.log(e.toString());else{let i=t.rows;db.query("SELECT * FROM games WHERE featured=false ORDER BY name ASC;",function(e,t){e?console.log(e.toString()):(e=t.rows,o.render("home",{featured_games:i,user_games:e}))})}})}),app.get("/play",(e,t)=>{e=e.header("x-forwarded-for")||e.connection.remoteAddress;console.log("Connection attempt from "+e+" accepted."),t.render("play")}),app.get("/create",(e,t)=>{e=e.header("x-forwarded-for")||e.connection.remoteAddress;console.log("Connection attempt from "+e+" accepted."),t.render("create")}),app.get("/reset",(e,t)=>{kanto_server_install(),t.send("Success")}),app.get("/games",(e,i)=>{e.header("x-forwarded-for")||e.connection.remoteAddress;db.query("SELECT * FROM games;",function(e,t){e?console.log(e.toString()):i.json(t.rows)})}),app.get("/templates/games",(e,o)=>{fs.readdir("templates/games/",(e,t)=>{let i=[];t.forEach(e=>{i.push(JSON.parse(fs.readFileSync("templates/games/"+e,"utf8")))}),o.json(i)})}),app.get("/templates/maps",(e,o)=>{fs.readdir("templates/maps/",(e,t)=>{let i=[];t.forEach(e=>{i.push(JSON.parse(fs.readFileSync("templates/maps/"+e,"utf8")))}),o.json(i)})}),app.get("/maps",(e,i)=>{e.header("x-forwarded-for")||e.connection.remoteAddress;db.query("SELECT * FROM maps;",function(e,t){e?console.log(e.toString()):i.json(t.rows)})}),app.post("/game",(e,i)=>{e=e.body.game;e?db.query("SELECT * FROM games WHERE game_id=$1;",[e],function(e,t){e?console.log(e.toString()):0<t.rows.length?i.json(t.rows[0].game_data):db.query("SELECT * FROM games WHERE name=$1;",["Pallet Town"],function(e,t){e&&console.log(e.toString()),i.json(t.rows[0].game_data)})}):db.query("SELECT * FROM games WHERE name=$1;",["Pallet Town"],function(e,t){e&&console.log(e.toString()),i.json(t.rows[0])})}),app.post("/upload",(i,e)=>{var t=i.header("x-forwarded-for")||i.connection.remoteAddress;console.log("Upload attempt from "+t+" accepted.");let o=null;i.body.meta.game_id&&(o=i.body.meta.game_id),console.log(o,i.body),o?db.query("SELECT * FROM games WHERE game_id=$1;",[o],function(e,t){e?console.log(e.toString()):0<t.rows.length&&db.query("UPDATE games SET game_data=$2 WHERE game_id=$1;",[o,i.body],function(e,t){e&&console.log(e.toString())})}):(o=generate_game_id(),i.body.meta.game_id=o,db.query("INSERT INTO games (name, game_id, game_data) values ($1, $2, $3);",[i.body.meta.name,o,i.body],function(e,t){e&&console.log(e.toString())})),e.json({success:!0,game_id:o})}),io.on("connection",s=>{console.log("New socket: ",s.id),s.on("join_lobby",i=>{var e=new Trainer(s.id,i.trainer.position,i.trainer.spritesheet_id);let o=null;lobbies.forEach((e,t)=>{i.lobby_id==e.id&&(o=t)}),null===o?lobbies.push(new Lobby(i.lobby_id,i.game_id,[e])):(s.emit("create_current_trainers",lobbies[o].trainers),lobbies[o].trainers.push(e)),s.join(i.lobby_id),s.to(i.lobby_id).emit("trainer_joined",{name:"BLUE",position:e.position,facing:e.facing,spritesheet_id:i.trainer.spritesheet_id,socket_id:s.id});find_lobby_index(i.lobby_id)}),s.on("position_update",e=>{var t=find_lobby_index(e.lobby_id),i=find_trainer_index(t,s.id);null!==t&&(lobbies[t].trainers[i].position=e.trainer.position,s.to(lobbies[t].id).emit("trainer_moved",{socket_id:lobbies[t].trainers[i].socket_id,position:lobbies[t].trainers[i].position,exiting:e.trainer.exiting}))}),s.on("facing_update",e=>{var t=find_lobby_index(e.lobby_id),i=find_trainer_index(t,s.id);null!==t&&(lobbies[t].trainers[i].position.f=e.f,s.to(lobbies[t].id).emit("trainer_faced",{socket_id:lobbies[t].trainers[i].socket_id,f:lobbies[t].trainers[i].position.f}))}),s.on("map_server_sync",t=>{var e=find_lobby_index(t.lobby_id);let i=[];lobbies[e]&&(lobbies[e].npcs.forEach(e=>{e.position.map==t.map&&i.push({uid:e.uid,position:e.position})}),s.emit("map_server_sync",{npcs:i}))}),s.on("disconnecting",e=>{let t=null;var i,o;s.rooms.forEach(e=>{e!==s.id&&(t=e)}),t&&(o=find_trainer_index(i=find_lobby_index(t),s.id),lobbies[i].trainers.splice(o,1)),io.to(t).emit("trainer_disconnected",s.id)})});class Lobby{constructor(e=null,t=null,i=[]){this.id=e,this.game_id=t,this.trainers=i,this.game=!1,this.import_data=this.retrieve_game(t),this.loaded=!1,this.import_data.then(e=>this.generate_game(e),e=>console.log("Error importing game:",t))}async retrieve_game(e){return console.log("Retrieving game..",e),(await db.query("SELECT * FROM games WHERE game_id=$1;",[e])).rows[0]}generate_game(e){this.game=JSON.parse(e.game_data),this.npcs=[],this.items=[],this.game.maps.forEach((e,t)=>{e.id=t,this.build_npcs(e)}),this.loaded=!0}build_npcs(i){let o=0;for(let t=0;t<i.height;t++)for(let e=0;e<i.width;e++){var s=e+i.width*t,s=i.atts[s];5==s.type&&(this.npcs.push(new Npc({map:i.id,x:e,y:t},s.facing,s.movement_state,i,this.id,o)),o++)}}close(){}}class Npc{constructor(e={map:0,x:0,y:0,f:0},t="South",i="Active",o=null,s=0,n=0){this.position=e,this.facing=t,this.map=o,this.movement_state=i,this.index=n,this.lobby_id=s,this.initial_properties={position:e,facing:t},this.uid=`M${this.position.map}X${this.position.x}Y`+this.position.y,"Active"==this.movement_state&&(this.wander_interval=setInterval(this.wander,1e3,this))}place(e,t){this.position.index=this.position.x+this.map.width*this.position.y,this.position.tile=map.atts[e+this.map.width*t]}position_update(){this.position.index=this.position.x+this.map.width*this.position.y,this.position.tile=this.map.tiles[this.position.index],this.position.att=this.map.atts[this.position.index]}move(e){let t={x:this.position.x,y:this.position.y};switch(e){case"East":t.x++;break;case"West":t.x--;break;case"North":t.y--;break;case"South":t.y++}if(!this.collision_check(t.x,t.y)){switch(this.moving=!0,this.current_move_ticker=0,e){case"North":this.facing="North",this.position.y--,this.position.f=0;break;case"East":this.facing="East",this.position.x++,this.position.f=1;break;case"South":this.facing="South",this.position.y++,this.position.f=2;break;case"West":this.facing="West",this.position.x--,this.position.f=3}io.to(this.lobby_id).emit("npc_moved",{uid:this.uid,position:this.position,moving:e})}}wander(e){var t=Math.floor(5*Math.random())+1,i=Math.floor(3*Math.random())+1;1==t&&e.move(["North","South","East","West"][i])}collision_check(t,i){var e=find_lobby_index(this.lobby_id);if(t<0||t>=this.map.width)return!0;if(i<0||i>=this.map.height)return!0;switch(this.map.atts[t+this.map.width*i].type){case 1:case 3:case 6:case 7:return!0}return lobbies[e].trainers.forEach(e=>{if(t==e.position.x&&i==e.position.y)return!0}),lobbies[e].npcs.forEach(e=>{if(this.position.map==e.position.map&&t==e.position.x&&i==e.position.y)return!0}),!1}}class Trainer{constructor(e=null,t={map:1,x:5,y:5},i=0){this.socket_id=e,this.position=t,this.spritesheet_id=i,this.facing="South"}}