/**
 * On 'ready' event
 * 
 */
const execute = (client) => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
}

export default {
	name: "ready",
	once: true,
	execute
}
