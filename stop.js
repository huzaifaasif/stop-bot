const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json')

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

const TOKEN = auth.token;

const bot = new Discord.Client({
  token: TOKEN,
  autorun: true
});

const channel = new Discord.Channel();

bot.on('ready', (evt) => {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.user.username + ' - ' + bot.user.id);
});

let stoppedWords = new Array();

bot.on('message', (msg) => {
  string = msg.content
  const date = new Date().toString();
  let admin = msg.member.hasPermission('ADMINISTRATOR')

  if (msg.toString().substring(0, 1) === '!') {
    const args = msg.toString().substring(1).split(' ');
    const cmd = args[0];
    const subcmd = args[1];

    if (cmd === 'stop') {
      if (!subcmd) {
        msg.channel.send(date);
        msg.channel.send('IT\'S TIME TO STOP.');
      } else if (subcmd === 'video') {
        msg.channel.send('https://www.youtube.com/watch?v=2k0SmqbBIpQ');
      } else if (subcmd === 'list') {
        msg.channel.send('These words are currently being stopped: `' + stoppedWords.join(', ') + '`');
      } else if (typeof subcmd !== 'undefined') {
        if (admin) {
          stoppedWords.push(subcmd.toLowerCase());
          // console.log(stoppedWords);
          msg.channel.send('`' + subcmd + '`' + ' will now be stopped.');
        } else if (!admin) {
          msg.reply('you can\'t use this command.');
        }
      } else return;
    } else if (cmd === 'go') {
      if (!admin) {
        msg.reply('you can\'t use this command.');
      } else if (admin && typeof subcmd !== 'undefined') {
        let goWord = stoppedWords.indexOf(subcmd);
        if (goWord !== -1) {
          stoppedWords.splice(goWord, 1);
          // console.log(stoppedWords);
          msg.channel.send('`' + subcmd + '`' + ' will no longer be stopped.');
        } else {
          msg.channel.send('`' + subcmd + '`' + ' was not on the list of stopped words.');
        }
      } else {
        msg.reply('what do you want to unstop?');
      }
    } else {
      msg.channel.send('Unknown command.');
    }
  } else {
    if (msg.author.bot) return;
    else {
      for (let i = 0; i <= stoppedWords.length; i++) {
        // console.log(stoppedWords);
        // console.log(string.toString().toLowerCase().indexOf(stoppedWords[i]));
        if (string.toString().toLowerCase().indexOf(stoppedWords[i]) !== -1) {
          // console.log(stoppedWords[i] + ' must be stopped now');
          msg.channel.send(date);
          msg.reply('IT\'S TIME TO STOP.');
        }
      }
    }
  }
});

bot.login(TOKEN);
