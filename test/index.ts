import BasicEventEmitter from "../src";

// Cria uma instância do EventEmitter
const emitter = new BasicEventEmitter<{
	greet: (name: string) => void;
	farewell: (name: string) => void;
}>();

// Assinando um evento
emitter.on("greet", (name) => {
	console.log(`Hello, ${name}!`);
});

// Emitindo um evento
emitter.emit("greet", "Alice");

// Removendo um listener
const sayGoodbye = (name) => console.log(`Goodbye, ${name}!`);
emitter.on("farewell", sayGoodbye);
emitter.off("farewell", sayGoodbye);

// Emitindo novamente (não irá disparar, pois o listener foi removido)
emitter.emit("farewell", "Alice");

type UserEvents = {
	login: (username: string) => void;
	logout: (username: string) => void;
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
