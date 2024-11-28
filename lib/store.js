import { readFileSync, writeFileSync, existsSync, promises } from "fs";
import { join } from "path";
const {
  initAuthCreds,
  BufferJSON,
  proto,
  isJidBroadcast,
  isJidGroup,
  WAMessageStubType,
  updateMessageWithReceipt,
  updateMessageWithReaction,
  useMultiFileAuthState: baileysMultiFileAuthState,
} = (await import("@whiskeysockets/baileys")).default;
const TIME_TO_DATA_STALE = 5 * 60 * 1e3;

function makeInMemoryStore() {
  let chats = {};
  let messages = {};
  let state = {
    connection: "close",
  };

  function loadMessage(jid, id = null) {
    let message = null;
    if (jid && !id) {
      id = jid;
      const filter = (m) => m.key?.id == id;
      const messageFind = Object.entries(messages).find(([, msgs]) => {
        return msgs.find(filter);
      });
      message = messageFind?.[1]?.find(filter);
    } else {
      jid = jid?.decodeJid?.();
      if (!(jid in messages)) return null;
      message = messages[jid].find((m) => m.key.id == id);
    }
    return message ? message : null;
  }
  async function fetchGroupMetadata(jid, groupMetadata) {
    jid = jid?.decodeJid?.();
    if (!isJidGroup(jid)) return;
    if (!(jid in chats))
      return (chats[jid] = {
        id: jid,
      });
    const isRequiredToUpdate =
      !chats[jid].metadata ||
      Date.now() - (chats[jid].lastfetch || 0) > TIME_TO_DATA_STALE;
    if (isRequiredToUpdate) {
      const metadata = await groupMetadata?.(jid);
      if (metadata)
        Object.assign(chats[jid], {
          subject: metadata.subject,
          lastfetch: Date.now(),
          metadata: metadata,
        });
    }
    return chats[jid].metadata;
  }

  function fetchMessageReceipts(id) {
    const msg = loadMessage(id);
    if (!msg) return null;
    return msg.userReceipt;
  }
  async function fetchImageUrl(jid, profilePictureUrl) {
    jid = jid?.decodeJid?.();
    if (!(jid in chats))
      return (chats[jid] = {
        id: jid,
      });
    if (!chats[jid].imgUrl) {
      const url = await profilePictureUrl(jid, "image").catch(
        () => "https://telegra.ph/file/0b23910fbd9261c5aa06c.jpg",
      );
      if (url) chats[jid].imgUrl = url;
    }
    return chats[jid].imgUrl;
  }

  function getContact(jid) {
    jid = jid?.decodeJid?.();
    if (!(jid in chats)) return null;
    return chats[jid];
  }
  const upsertMessage = (jid, message, type = "append") => {
    jid = jid?.decodeJid?.();
    if (!(jid in messages)) messages[jid] = [];
    delete message.message?.messageContextInfo;
    delete message.message?.senderKeyDistributionMessage;
    const msg = loadMessage(jid, message.key.id);
    if (msg) {
      Object.assign(msg, message);
    } else {
      if (type == "append") messages[jid].push(message);
      else messages[jid].splice(0, 0, message);
    }
  };

  function bind(
    ev,
    opts = {
      groupMetadata: () => null,
    },
  ) {
    ev.on("connection.update", (update) => {
      Object.assign(state, update);
    });
    ev.on("chats.set", function store(chatsSet) {
      for (const chat of chatsSet.chats) {
        const id = chat.id?.decodeJid?.();
        if (!id) continue;
        if (!(id in chats))
          chats[id] = {
            ...chat,
            isChats: true,
            ...(chat.name
              ? {
                  name: chat.name,
                }
              : {}),
          };
        if (chat.name) chats[id].name = chat.name;
      }
    });
    ev.on("contacts.set", function store(contactsSet) {
      for (const contact of contactsSet.contacts) {
        const id = contact.id?.decodeJid?.();
        if (!id) continue;
        chats[id] = Object.assign(chats[id] || {}, {
          ...contact,
          isContact: true,
        });
      }
    });
    ev.on("messages.set", function store(messagesSet) {
      for (const message of messagesSet.messages) {
        const jid = message.key.remoteJid?.decodeJid?.();
        if (!jid) continue;
        if (!jid || isJidBroadcast(jid)) continue;
        if (!(jid in messages)) messages[jid] = [];
        const id = message.key.id;
        const msg = loadMessage(jid, id);
        upsertMessage(jid, proto.WebMessageInfo.fromObject(message), "prepend");
      }
    });
    ev.on("contacts.update", function store(contactsUpdate) {
      for (const contact of contactsUpdate) {
        const id = contact.id?.decodeJid?.();
        if (!id) continue;
        chats[id] = Object.assign(chats[id] || {}, {
          id: id,
          ...contact,
          isContact: true,
        });
      }
    });
    ev.on("chats.upsert", async function store(chatsUpsert) {
      await Promise.all(
        chatsUpsert.map(async (chat) => {
          const id = chat.id?.decodeJid?.();
          if (!id || isJidBroadcast(id)) return;
          if (!(id in chats))
            chats[id] = {
              id: id,
              ...chat,
              isChats: true,
            };
          const isGroup = isJidGroup(id);
          Object.assign(chats[id], {
            ...chat,
            isChats: true,
          });
          if (isGroup && !chats[id].metadata)
            Object.assign(chats[id], {
              metadata: await fetchGroupMetadata(id, opts.groupMetadata),
            });
        }),
      );
    });
    ev.on("chats.update", function store(chatsUpdate) {
      for (const chat of chatsUpdate) {
        const id = chat.id?.decodeJid?.();
        if (!id) continue;
        if (!(id in chats))
          chats[id] = {
            id: id,
            ...chat,
            isChats: true,
          };
        if (chat.unreadCount) chat.unreadCount += chats[id].unreadCount || 0;
        Object.assign(chats[id], {
          id: id,
          ...chat,
          isChats: true,
        });
      }
    });
    ev.on("presence.update", function store(presenceUpdate) {
      const id = presenceUpdate.id?.decodeJid?.();
      if (!id) return;
      if (!(id in chats))
        chats[id] = {
          id: id,
          isContact: true,
        };
      Object.assign(chats[id], presenceUpdate);
    });
    ev.on("messages.upsert", function store(messagesUpsert) {
      const { messages: newMessages, type } = messagesUpsert;
      switch (type) {
        case "append":
        case "notify":
          for (const msg of newMessages) {
            const jid = msg.key.remoteJid?.decodeJid?.();
            if (!jid || isJidBroadcast(jid)) continue;
            if (msg.messageStubType == WAMessageStubType.CIPHERTEXT) continue;
            if (!(jid in messages)) messages[jid] = [];
            const message = loadMessage(jid, msg.key.id);
            upsertMessage(jid, proto.WebMessageInfo.fromObject(msg));
            if (type === "notify" && !(jid in chats))
              ev.emit("chats.upsert", [
                {
                  id: jid,
                  conversationTimestamp: msg.messageTimestamp,
                  unreadCount: 1,
                  name: msg.pushName || msg.verifiedBizName,
                },
              ]);
          }
          break;
      }
    });
    ev.on("messages.update", function store(messagesUpdate) {
      for (const message of messagesUpdate) {
        const jid = message.key.remoteJid?.decodeJid?.();
        if (!jid) continue;
        const id = message.key.id;
        if (!jid || isJidBroadcast(jid)) continue;
        if (!(jid in messages)) messages[jid] = [];
        const msg = loadMessage(jid, id);
        if (!msg) return;
        if (message.update.messageStubType == WAMessageStubType.REVOKE) {
          continue;
        }
        const msgIndex = messages[jid].findIndex((m) => m.key.id === id);
        Object.assign(messages[jid][msgIndex], message.update);
      }
    });
    ev.on("groups.update", async function store(groupsUpdate) {
      await Promise.all(
        groupsUpdate.map(async (group) => {
          const id = group.id?.decodeJid?.();
          if (!id) return;
          const isGroup = isJidGroup(id);
          if (!isGroup) return;
          if (!(id in chats))
            chats[id] = {
              id: id,
              ...group,
              isChats: true,
            };
          if (!chats[id].metadata)
            Object.assign(chats[id], {
              metadata: await fetchGroupMetadata(id, opts.groupMetadata),
            });
          Object.assign(chats[id].metadata, group);
        }),
      );
    });
    ev.on(
      "group-participants.update",
      async function store(groupParticipantsUpdate) {
        const id = groupParticipantsUpdate.id?.decodeJid?.();
        if (!id || !isJidGroup(id)) return;
        if (!(id in chats))
          chats[id] = {
            id: id,
          };
        if (!(id in chats) || !chats[id].metadata)
          Object.assign(chats[id], {
            metadata: await fetchGroupMetadata(id, opts.groupMetadata),
          });
        const metadata = chats[id].metadata;
        if (!metadata)
          return console.log(
            `Try to update group ${id} but metadata not found in 'group-participants.update'`,
          );
        switch (groupParticipantsUpdate.action) {
          case "add":
            metadata.participants.push(
              ...groupParticipantsUpdate.participants.map((id) => ({
                id: id,
                admin: null,
              })),
            );
            break;
          case "demote":
          case "promote":
            for (const participant of metadata.participants)
              if (groupParticipantsUpdate.participants.includes(participant.id))
                participant.admin =
                  groupParticipantsUpdate.action === "promote" ? "admin" : null;
            break;
          case "remove":
            metadata.participants = metadata.participants.filter(
              (p) => !groupParticipantsUpdate.participants.includes(p.id),
            );
            break;
        }
        Object.assign(chats[id], {
          metadata: metadata,
        });
      },
    );
    ev.on("message-receipt.update", function store(messageReceiptUpdate) {
      for (const { key, receipt } of messageReceiptUpdate) {
        const jid = key.remoteJid?.decodeJid?.();
        if (!jid) continue;
        const id = key.id;
        if (!(jid in messages)) messages[jid] = [];
        const msg = loadMessage(jid, id);
        if (!msg) return;
        updateMessageWithReceipt(msg, receipt);
      }
    });
    ev.on("messages.reaction", function store(reactions) {
      for (const { key, reaction } of reactions) {
        const jid = key.remoteJid?.decodeJid?.();
        if (!jid) continue;
        const msg = loadMessage(jid, key.id);
        if (!msg) return;
        updateMessageWithReaction(msg, reaction);
      }
    });
  }

  function toJSON() {
    return {
      chats: chats,
      messages: messages,
    };
  }

  function fromJSON(json) {
    Object.assign(chats, json.chats);
    for (const jid in json.messages)
      messages[jid] = json.messages[jid]
        .map((m) => m && proto.WebMessageInfo.fromObject(m))
        .filter((m) => m && m.messageStubType != WAMessageStubType.CIPHERTEXT);
  }

  function writeToFile(path) {
    writeFileSync(
      path,
      JSON.stringify(
        toJSON(),
        (key, value) => (key == "isChats" ? undefined : value),
        2,
      ),
    );
  }

  function readFromFile(path) {
    if (existsSync(path)) {
      const result = JSON.parse(
        readFileSync(path, {
          encoding: "utf-8",
        }),
      );
      fromJSON(result);
    }
  }
  return {
    chats: chats,
    messages: messages,
    state: state,
    loadMessage: loadMessage,
    fetchGroupMetadata: fetchGroupMetadata,
    fetchMessageReceipts: fetchMessageReceipts,
    fetchImageUrl: fetchImageUrl,
    getContact: getContact,
    bind: bind,
    writeToFile: writeToFile,
    readFromFile: readFromFile,
  };
}

function JSONreplacer(key, value) {
  if (value == null) return;
  const baileysJSON = BufferJSON.replacer(key, value);
  return baileysJSON;
}
const fixFileName = (file) => file?.replace(/\//g, "__")?.replace(/:/g, "-");
const useMultiFileAuthState =
  baileysMultiFileAuthState ||
  async function useMultiFileAuthState(folder) {
    const writeData = (data, file) => {
      return promises.writeFile(
        join(folder, fixFileName(file)),
        JSON.stringify(data, JSONreplacer),
      );
    };
    const readData = async (file) => {
      try {
        const data = await promises.readFile(join(folder, fixFileName(file)), {
          encoding: "utf-8",
        });
        return JSON.parse(data, BufferJSON.reviver);
      } catch (error) {
        return null;
      }
    };
    const removeData = async (file) => {
      try {
        await promises.unlink(fixFileName(file));
      } catch {}
    };
    const folderInfo = await promises.stat(folder).catch(() => {});
    if (folderInfo) {
      if (!folderInfo.isDirectory()) {
        throw new Error(
          `found something that is not a directory at ${folder}, either delete it or specify a different location`,
        );
      }
    } else {
      await promises.mkdir(folder, {
        recursive: true,
      });
    }
    const creds = (await readData("creds.json")) || initAuthCreds();
    return {
      state: {
        creds: creds,
        keys: {
          get: async (type, ids) => {
            const data = {};
            await Promise.all(
              ids.map(async (id) => {
                let value = await readData(`${type}-${id}.json`);
                if (type === "app-state-sync-key") {
                  value = proto.AppStateSyncKeyData.fromObject(value);
                }
                data[id] = value;
              }),
            );
            return data;
          },
          set: async (data) => {
            const tasks = [];
            for (const category in data) {
              for (const id in data[category]) {
                const value = data[category][id];
                const file = `${category}-${id}.json`;
                tasks.push(value ? writeData(value, file) : removeData(file));
              }
            }
            await Promise.all(tasks);
          },
        },
      },
      saveCreds: () => {
        return writeData(creds, "creds.json");
      },
    };
  };
const KEY_MAP = {
  "pre-key": "preKeys",
  session: "sessions",
  "sender-key": "senderKeys",
  "app-state-sync-key": "appStateSyncKeys",
  "app-state-sync-version": "appStateVersions",
  "sender-key-memory": "senderKeyMemory",
};
const useMemoryAuthState = function useMemoryAuthState() {
  const creds = initAuthCreds();
  const keys = {};
  const saveCreds = () => undefined;
  return {
    state: {
      creds: creds,
      keys: {
        get: (type, ids) => {
          const key = KEY_MAP[type];
          return ids.reduce((dict, id) => {
            let value = keys[key]?.[id];
            if (value) {
              if (type === "app-state-sync-key") {
                value = proto.AppStateSyncKeyData.fromObject(value);
              }
              dict[id] = value;
            }
            return dict;
          }, {});
        },
        set: (data) => {
          for (const _key in data) {
            const key = KEY_MAP[_key];
            keys[key] = keys[key] || {};
            Object.assign(keys[key], data[_key]);
          }
        },
      },
    },
    saveCreds: saveCreds,
  };
};
export default {
  makeInMemoryStore: makeInMemoryStore,
  useMultiFileAuthState: useMultiFileAuthState,
  useMemoryAuthState: useMemoryAuthState,
  fixFileName: fixFileName,
  JSONreplacer: JSONreplacer,
  KEY_MAP: KEY_MAP,
};
