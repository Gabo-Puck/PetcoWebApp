class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.activeSessions = new Map();
  }
  findSession(id) {
    return this.activeSessions.get(id);
  }
  saveSession(id, session) {
    this.activeSessions.set(id, session);
  }
  printSessions() {
    console.log(this.activeSessions);
  }

  deleteSession(id) {
    this.activeSessions.delete(id);
  }
}

/*Podría ser útil crear una clase igual pero para comentarios y otra para mensajes*/
module.exports = { InMemorySessionStore };
