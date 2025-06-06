import BasicEventEmitter from "../src";

// Cria uma instância do EventEmitter
const emitter = new BasicEventEmitter<{
	greet: [name: string, index: number];
	farewell: [name: string];
}>();

// Assinando um evento
emitter.on("greet", (name, index) => {
	console.log(`Hello, ${name}!`);
});

// Emitindo um evento
emitter.emit("greet", "Alice", 0);

// Removendo um listener
emitter.on("farewell", (name) => console.log(`Goodbye, ${name}!`));
emitter.off("farewell", (name) => console.log(`Goodbye, ${name}!`));

// Emitindo novamente (não irá disparar, pois o listener foi removido)
emitter.emit("farewell", "Alice");

type UserEvents = {
	login: [username: string];
	logout: [username: string];
};

class User extends BasicEventEmitter<UserEvents> {
	login(username: string) {
		this.emit("login", username);
	}

	logout(username: string) {
		this.emit("logout", username);
	}
}

const user = new User();

user.on("login", (username) => {
	console.log(`User ${username} logged in.`);
});

user.login("Alice");
