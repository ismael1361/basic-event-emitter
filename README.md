# basic-event-emitter

**basic-event-emitter** é uma biblioteca simples e leve para gerenciar eventos no estilo "publicador/assinante" (pub/sub). Ideal para projetos que precisam de um sistema de emissão e escuta de eventos sem a complexidade de dependências pesadas.

## 🚀 Instalação

Você pode instalar o pacote via npm:

```bash
npm install basic-event-emitter
```

Ou via yarn:

```bash
yarn add basic-event-emitter
```

## 📖 Uso

Aqui está um exemplo básico de como usar o **basic-event-emitter**:

```ts
import BasicEventEmitter from 'basic-event-emitter';

// Cria uma instância do EventEmitter
const emitter = new BasicEventEmitter<{
    greet: (name: string) => void;
    farewell: (name: string) => void;
}>();

// Assinando um evento
emitter.on('greet', (name) => {
    console.log(`Hello, ${name}!`);
});

// Emitindo um evento
emitter.emit('greet', 'Alice');

// Removendo um listener
const sayGoodbye = (name) => console.log(`Goodbye, ${name}!`);
emitter.on('farewell', sayGoodbye);
emitter.off('farewell', sayGoodbye);

// Emitindo novamente (não irá disparar, pois o listener foi removido)
emitter.emit('farewell', 'Alice');
```

Usando como extensão em classes:

```ts
import BasicEventEmitter from 'basic-event-emitter';

type UserEvents = {
    login: (username: string) => void;
    logout: (username: string) => void;
};

class User extends BasicEventEmitter<UserEvents> {
    login(username: string) {
        this.emit('login', username);
    }

    logout(username: string) {
        this.emit('logout', username);
    }
}

const user = new User();

user.on('login', (username) => {
    console.log(`User ${username} logged in.`);
});

user.login('Alice');
```

## 🛠️ API

### `on(event: string, listener: (...args: any[]) => void): BasicEventHandler`
Registra um ouvinte para um evento específico.

- **event**: O nome do evento.
- **listener**: A função a ser chamada quando o evento é emitido.

```ts
const handler = emitter.on('greet', (name) => {
    console.log(`Hello, ${name}!`);
});

// Remover o ouvinte
handler.remove();
```

### `emit(event: string, ...args: any[]): void`
Dispara todos os ouvintes registrados para um evento.

- **event**: O nome do evento.
- **...args**: Argumentos a serem passados para os ouvintes.

```ts
emitter.emit('greet', 'Alice');
```

### `off(event: string, listener: (...args: any[]) => void): void`
Remove um ouvinte de um evento específico.

- **event**: O nome do evento.
- **listener**: A função a ser removida.

```ts
const sayGoodbye = (name) => console.log(`Goodbye, ${name}!`);
emitter.on('farewell', sayGoodbye);
emitter.off('farewell', sayGoodbye);
```

### `once(event: string, listener: (...args: any[]) => R): Promise<R>`
Registra um ouvinte que será chamado apenas uma vez.

- **event**: O nome do evento.
- **listener**: A função a ser chamada quando o evento for emitido.
- **returns**: Uma Promise que resolve com o valor retornado pela função `listener`.

```ts
emitter.once('greet', (name) => {
    console.log(`Hello, ${name}!`);
    return 'Listener called.';
}).then((message) => {
    console.log(message);
});
```

### `emitOnce(event: string, ...args: any[]): void`
Dispara todos os ouvintes registrados para um evento e remove-os após a execução.

- **event**: O nome do evento.
- **...args**: Argumentos a serem passados para os ouvintes.

```ts
emitter.emitOnce('greet', 'Alice');
```

### `offOnce(event: string, listener: (...args: any[]) => void): void`
Remove um ouvinte de um evento específico após a primeira execução.

- **event**: O nome do evento.
- **listener**: A função a ser removida.

```ts
const sayGoodbye = (name) => console.log(`Goodbye, ${name}!`);
emitter.once('farewell', sayGoodbye);
emitter.offOnce('farewell', sayGoodbye);
```

### `pipe(event: string, emitter: BasicEventEmitter<any>): BasicEventHandler`
Encaminha eventos de outro EventEmitter para o EventEmitter atual.

- **event**: O nome do evento.
- **emitter**: O EventEmitter de origem.

```ts
const emitter2 = new BasicEventEmitter();
const handler = emitter.pipe('greet', emitter2);

// Remover o ouvinte
handler.remove();
```

### `pipeOnce(event: string, emitter: BasicEventtEmitter<any>): Promise<void>`
Encaminha eventos de outro EventEmitter para o EventEmitter atual, removendo o encaminhamento após a primeira execução.

- **event**: O nome do evento.
- **emitter**: O EventEmitter de origem.

```ts
const emitter2 = new BasicEventEmitter();
emitter.pipeOnce('greet', emitter2).then(() => {
    console.log('Event forwarded.');
});
```

### `clearEvents(): void`
Remove todos os ouvintes registrados para todos os eventos.

```ts
emitter.clearEvents();
```

### `ready<R = never>(callback: () => R | Promise<R>): Promise<R>`
Executa uma função após a propriedade `prepared` ser definida como `true`.

- **callback**: A função a ser execut
- **returns**: Uma Promise que resolve com o valor retornado pela função.

```ts
emitter.ready(() => {
    console.log('EventEmitter is ready.');
});
```

### `prepared: boolean`
Propriedade que indica se o EventEmitter está pronto para uso.

```ts
// Verificar se o EventEmitter está pronto
if (emitter.prepared) {
    console.log('EventEmitter is ready.');
}

// Aguardar até que o EventEmitter esteja pronto
emitter.ready(()=>{
    console.log('EventEmitter is ready.');
});

// Infomar que o EventEmitter está pronto
emitter.prepared = true;
```

## 🌟 Funcionalidades

- Leve e sem dependências externas.
- Interface simples e intuitiva.
- Compatível com Node.js e navegadores.

## 💡 Casos de Uso

- Comunicação entre componentes em aplicações frontend.
- Implementação de eventos personalizados em aplicações backend.
- Emissão de notificações ou mensagens em sistemas.