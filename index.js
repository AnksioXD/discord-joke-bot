import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import 'dotenv/config'

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = [
    {
        name: 'jokebro',
        description: 'Replies with a Joke!',
    },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.error(error);
}
function sendRoastEveryXMinutes(channelId, time) {
    setInterval(async () => {
        const roast = await fetch("https://evilinsult.com/generate_insult.php?lang=en&type=json")
        const roastData = await roast.json()

        const channel = await client.channels.fetch(channelId);
        await channel.send(roastData.insult)
    }, time);
}

async function fetchJoke() {
    const res = await fetch("https://v2.jokeapi.dev/joke/Programming,Dark")
    const data = await res.json()
    return data
}
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Initiated RoastXmin`);

    const channelId = '1089214985013563434';
    const time = 600000;

    sendRoastEveryXMinutes(channelId, time)

});


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
