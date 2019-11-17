#!/usr/bin/env node

var fs = require("fs");
var YAML = require("yaml");

var config = require("./domains.js");
var services = {};

Object.keys(config.domains).forEach(name => {
	let port = config.domains[name][0];

	let environment = [];

	// domain server ports
	[
		"HIFI_DOMAIN_SERVER_HTTP_PORT",
		"HIFI_DOMAIN_SERVER_HTTPS_PORT",
		"HIFI_DOMAIN_SERVER_PORT",
		"HIFI_DOMAIN_SERVER_DTLS_PORT",
	].forEach((key, i) => {
		environment.push(key + "=" + (port + i));
	});

	// assignment client ports
	[
		"HIFI_ASSIGNMENT_CLIENT_AUDIO_MIXER_PORT",
		"HIFI_ASSIGNMENT_CLIENT_AVATAR_MIXER_PORT",
		null, // HIFI_ASSIGNMENT_CLIENT_SCRIPTED_AGENT_PORT
		"HIFI_ASSIGNMENT_CLIENT_ASSET_SERVER_PORT",
		"HIFI_ASSIGNMENT_CLIENT_MESSAGES_MIXER_PORT",
		"HIFI_ASSIGNMENT_CLIENT_ENTITY_SCRIPT_SERVER_PORT",
		"HIFI_ASSIGNMENT_CLIENT_ENTITIES_SERVER_PORT",
	].forEach((key, i) => {
		if (key == null) return;
		environment.push(key + "=" + (port + i + 10));
	});

	// custom metaverse url
	const metaverseUrl = config.domains[name][1];
	if (metaverseUrl != null) {
		environment.push("HIFI_METAVERSE_URL=" + metaverseUrl);
	}

	services[name] = {
		hostname: name,
		image: "makitsune/hifi:" + config.version,
		restart: "always",
		network_mode: "host",
		volumes: ["./domains/" + name + ":/root/.local/share/High Fidelity"],
		environment,

		/*
		cpu_count: 3,
		cpu_percent: 50,
		mem_limit: "8g",
		mem_reservation: "2g", 
		*/

		/*deploy: {
			resources: {
				limits: {
					memory: "2G"
				}
			}
		}*/
	};
});

console.log("Using High Fidelity v" + config.version);
console.log("Wrote " + Object.keys(config.domains).length + " domains\n");

fs.writeFileSync(
	"./docker-compose.yml",
	YAML.stringify({
		version: "3.6",
		services: services,
	}),
);
