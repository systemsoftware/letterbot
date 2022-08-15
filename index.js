const rss = new (require("rss-parser"))()
const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { writeFileSync } = require("fs")
const client = new Client({ intents: [GatewayIntentBits.Guilds] })
const { token } = require("./config.json")


client.once('ready', () => {
	console.log('Ready!')
})

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

setInterval(() => {
for(const u in require("./users.json")){
    let e = require("./users.json")
rss.parseURL(`https://letterboxd.com/${u}/rss/`).then(content => {
if(!content) return
if(content.items[0].guid != e[u].guid && content.items[0].guid != e[u].last_guid){
e[u].guid = content.items[0].guid
e[u].last_guid = content.items[1].guid
writeFileSync('./users.json',JSON.stringify(e))
client.channels.fetch(e[u].channel).then(c => {
c.send({content:`New Letterboxd content from ${content.items[0]['dc:creator']} (@${u}) \n ${content.items[0].link}`})
})
}
})
}
}, require("./config.json").checkEvery)

const adduser = (name,channel,id) => {
   const data = require("./users.json")
   rss.parseURL(`https://letterboxd.com/${name}/rss/`).then(e => {
    data[name] = ({ guid:e.items[0].guid, last_guid:e.items[1].guid, channel, id })
writeFileSync('./users.json',JSON.stringify(data))
})
}


client.on("interactionCreate", (i) => {
if(!i.isChatInputCommand()) return
if(i.commandName == 'add'){
const d = require("./users.json")
const name = i.options.getString("user")
const channel = i.options.getChannel("channel")
if(!d[name]){
(async () => {
const id = makeid(15)
adduser(name,channel.id,id)
i.reply({content:`Added ${name} to ${channel.name}! Write \`${id}\` down! It will allow you to edit your account in the future.`, ephemeral:true})
})()
}else{
i.reply({ content:`${name} is already using this bot. If it isn't you, let us know.`, ephemeral:true })
}
}else if(i.commandName == 'delete'){
    const d = require("./users.json")
    const name = i.options.getString("user")
    const id = i.options.getString("secret")
    if(d[name].id == id){
    delete d[name]
    writeFileSync('./users.json',JSON.stringify(d))
    i.reply({content:`Deleted ${name}`,ephemeral:true})
    }else{
        i.reply({ content:`Incorrect secret`, ephemeral:true })
    }
}
})

process.on('uncaughtException', (err) => {       
    console.log(err)
})

if(!process.argv[2] || process.argv[2].toLowerCase() != '--no-update'){
require("./r")
}

client.login(token)