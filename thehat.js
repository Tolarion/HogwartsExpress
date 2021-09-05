const Discord = require('discord.js');
const client = new Discord.Client({ shards: 'auto'});
var mysql = require('mysql');

let token = 'SECRET';

// ID ролей
let G_RoleID = "883392988456312863";
let	H_RoleID = "883393328677277827";
let	S_RoleID = "883393519790747669";
let	R_RoleID = "883393485363875940";
let RolesIDArray = [G_RoleID, H_RoleID, R_RoleID, S_RoleID];

let myguild;
let G_Role;
let H_Role;
let S_Role
let R_Role;

let RolesArray;

// ID сообщения со счетчиком
let TotalsMessageID = '883819538649604106';

let HE_cache_channel;


client.on('ready', async () => {	
	
	myguild = await client.guilds.fetch('212960013197508608');
	G_Role = await myguild.roles.cache.get(G_RoleID);
	H_Role = await myguild.roles.cache.get(H_RoleID);
	S_Role = await myguild.roles.cache.get(S_RoleID);
	R_Role = await myguild.roles.cache.get(R_RoleID);
	
	RolesArray = [G_Role, H_Role, S_Role, R_Role];
	
  // Кешируем канал и сообщение с эмодзи распределения
	HE_cache_channel = await client.channels.fetch('883387825729458217')
	let HE_cache_msg = await HE_cache_channel.messages.fetch('883419423845810229');
	
  // Кешируем сообщение со счетчиком
	let counter_cache_channel = await client.channels.fetch('212960013197508608')
	
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity(`судьбы людей`, { type: 'PLAYING' });
	
});

client.on('messageReactionAdd', async (reaction, user) => {
	
	let author = await myguild.members.fetch(user);
	let fid = 0;
	let mesauthor = await myguild.members.fetch(reaction.message.author);
	
	mesauthor._roles.forEach((element) => {
		switch (element){
			case G_RoleID:
			fid = '1';
			break;
			case H_RoleID:
			fid = '2';
			break;
			case R_RoleID:
			fid = '3';
			break;
			case S_RoleID:
			fid = '4';
			break;
		}
		console.log(fid);
	})
	
	RolesArray = [G_Role, H_Role, S_Role, R_Role];
	
	/* ChatCounter */
	let countUp;
	let countDown;
	
	if (reaction.message.channel.id == '212960013197508608' && !user.bot) {

		if (reaction._emoji.name == '👍') {
			if (reaction.message.reactions.cache.get('👍') === undefined) {
				countUp = 0;
			} else {
				countUp = reaction.message.reactions.cache.get('👍').count;
				UpdateTotals (fid, 10);
			}
		}
		
		if (reaction._emoji.name == '👎') {
			if (reaction.message.reactions.cache.get('👎') === undefined) {
				countDown= 0;
			} else {
				countDown = reaction.message.reactions.cache.get('👎').count;
				UpdateTotals (fid, -10);
			}
		}
		
	}
	
	/* ChatCounter */
	
	/* HE */
	let needreset_rh = false;
	if (reaction.message.id == '883419423845810229' && !user.bot) {
		let vhtid = '0';
		switch (reaction._emoji.reaction._emoji.name){
			case "🪄":
			vhtid = '1';
			break;
			case "🇿":
			vhtid = '-1';
			break;
		}
		if (vhtid == -1)
			needreset_rh = true;
			
		if (vhtid != '0' && vhtid != '-1') {
			
			if (author._roles.some(r=> RolesIDArray.includes(r))) {
				reaction.message.channel.send('Дорогой '+ author.nickname + '! Министерство Магии сообщает, что ты уже проходил(а) распределение. Удачи!').then(msg => msg.delete({ timeout: 10000 }));
			} else {
				var TheRole = RolesArray[Math.floor(Math.random()*RolesArray.length)];
				author.roles.add(TheRole, 'Так решила распределяющая шляпа')
				.then(()=> {
					console.log('Пользователю '+ user.username + ' выдана роль '+TheRole.name);
					reaction.message.channel.send(''+ author.nickname + ' надел распределяющую шляпу и зажмурился... "' + TheRole.name + '" торжественно выкрикнула шляпа. Поздравляем и добро пожаловать!\nМагия начнет работать после твоего первого поста с момента распределения.').then(msg => msg.delete({ timeout: 15000 }));
				})
			  .catch(console.error);
			}
			reaction.users.remove(user);
		}
		else {
			reaction.users.remove(user);
		}

		if (needreset_rh) {
			needreset_rh = false;
			reaction.message.reactions.removeAll()
			.then(reaction.message.react("🪄"));
		}		
	}	
	/* HE */
});
client.on('messageReactionRemove', async (reaction, user) => {
	
	let author = await myguild.members.fetch(user);
	let fid = 0;
	let mesauthor = await myguild.members.fetch(reaction.message.author);
	mesauthor._roles.forEach((element) => {
		switch (element){
			case G_RoleID:
			fid = '1';
			break;
			case H_RoleID:
			fid = '2';
			break;
			case R_RoleID:
			fid = '3';
			break;
			case S_RoleID:
			fid = '4';
			break;
		}
		console.log(fid);
	})
	
	/* ChatCounter */
	let countUp;
	let countDown;
	
	if (reaction.message.channel.id == '212960013197508608' && !user.bot) {
		
		if (reaction._emoji.name == '👍') {
			if (reaction.message.reactions.cache.get('👍') === undefined) {
				countUp = 0;
				UpdateTotals (fid, -10);
			} else {
				countUp = reaction.message.reactions.cache.get('👍').count;
				UpdateTotals (fid, -10);
			}
		}
		
		if (reaction._emoji.name == '👎') {
			if (reaction.message.reactions.cache.get('👎') === undefined) {
				countDown= 0;
				UpdateTotals (fid, 10);
			} else {
				countDown = reaction.message.reactions.cache.get('👎').count;
				UpdateTotals (fid, 10);
			}
		}
	}
	
	/* ChatCounter */
	
});


client.on('message', msg => {
	
	if (!msg.author.bot && msg.content.length > 0 && msg.content.startsWith("!анонс") && msg.channel.id == '883387825729458217') {
		
		var EmbedMSG = new Discord.MessageEmbed();
			EmbedMSG
			.setColor('#c1392d')
			.setTitle('Путь в магию начинается здесь')
			.setImage('https://image.mel.fm/i/V/Vzt26ub8lQ/590.jpg')
			.setDescription('Готов вступить в неравную магическую схватку? Точно?! Я два раза не спрашиваю!');
		
		msg.delete();
		msg.channel.send(EmbedMSG);
	}
	
	if (!msg.author.bot && msg.content.length > 0 && msg.content.startsWith("!log") && msg.channel.id == '883387825729458217') {
		
		msg.delete();
		let author = msg.member; 
		//console.log(author._roles.some(r=> RolesIDArray.includes(r)));
	}
	
	if (!msg.author.bot && msg.content.length > 0 && msg.content.startsWith("!итоги") && msg.channel.id == '883387825729458217') {
		
		msg.delete();
		let author = msg.member; 
		msg.channel.send('Гриффиндор - 0\nПуффендуй - 0\nКогтевран - 0\nСлизерин - 0');
	}

});

// Объявляем перехват некешированных событий реакций
client.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = client.channels.cache.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.cache.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.messages.fetch(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.cache.get(emoji);
        // Adds the currently reacting user to the reaction's users collection.
        if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
        }
    });
});

client.login(token);
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

setInterval(function()
{
	var con = mysql.createConnection({
		host: "localhost",
		user: 'thehat',
		password: 'SECRET',
		database: 'thehat'
	});

	let totals = '';

	con.query("SELECT name, total FROM faculty",
	function(err, results, fields) {
		results.forEach( async function(item, i, arr) {
			totals = totals + item.name + ' - ' + item.total + '\n';
		});
		
		client.channels.cache.get('883387825729458217').messages.fetch('883819538649604106').then(msg => msg.edit(totals));

	});
	
	con.end();

}, 10000
)


function UpdateTotals (fid, amount) {
	if (fid == 0) return;
	
	var con = mysql.createConnection({
		host: "localhost",
		user: 'thehat',
		password: 'SECRET',
		database: 'thehat'
	});

	let totals = '';
	qry = 'UPDATE faculty SET total = total + (' + amount + ') WHERE id = ' + fid;

	con.query(qry,
	function(err, results, fields) {
		
	});
	
	con.end();
}
