import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import 'dotenv/config'

const TOKEN = process.env.TOKEN
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function sendJokeEveryXMinutes(channelId, time) {
    setInterval(async () => {
        const joke = await fetchJoke()

        const channel = await client.channels.fetch(channelId);

        if (channel) {
            if (joke.type == "twopart") {
                await channel.send(joke.setup);
                setTimeout(async () => {
                    await channel.send(joke.delivery);

                }, 2000);
            } else {
                await channel.send(joke.joke);
            }
        } else {
            console.log('Channel not found.');
        }
    }, time);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const channelId = '1089214985013563434';
    const time = 600000;

    sendJokeEveryXMinutes(channelId, time)

});

async function fetchJoke() {
    const res = await fetch("https://v2.jokeapi.dev/joke/Programming,Dark")
    const data = await res.json()
    return data
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const joke = await fetchJoke()

    if (interaction.commandName === 'joke') {
        if (joke.type == "twopart") {
            await interaction.reply(joke.setup);
            setTimeout(async () => {
                await interaction.followUp(joke.delivery);

            }, 2000);
        } else {
            await interaction.reply(joke.joke);
        }

    }
});

client.login(TOKEN);
