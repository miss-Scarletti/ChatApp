import Parse from "parse";

export async function createUser(
  username,
  password,
  email,
  nativeLangs,
  targetLangs,
  profilePicture
) {
  try {
    const User = new Parse.User();
    User.set("username", username);
    User.set("password", password);
    User.set("email", email);
    User.set("profilePicture", profilePicture);
    const nativeLangsRelation = User.relation("nativeLangs");
    nativeLangsRelation.add(await getLanguagesFromIDs(nativeLangs));
    const targetLangsRelation = User.relation("targetLangs");
    targetLangsRelation.add(await getLanguagesFromIDs(targetLangs));
    await User.signUp();
    return true;
  } catch (error) {
    alert(`Error when trying to create a new user! ${error}`);
  }
}

export async function getLanguagesFromIDs(ids) {
  const languageQuery = new Parse.Query("Language");
  try {
    languageQuery.containedIn("objectId", ids);
    return await languageQuery.find();
  } catch (error) {
    console.log(`Error while getting language from ID: ${error.message}`);
  }
}

export async function logIn(username, password) {
  try {
    await Parse.User.logIn(username, password);
  } catch (error) {
    alert("Please enter a valid Username and Password!");
  }
}

export async function logOut() {
  try {
    return await Parse.User.logOut();
  } catch (error) {
    console.log(`Error logging out! ${error}`);
  }
}

export async function sendMessage(messageText, chat) {
  const Message = new Parse.Object("Message");
  try {
    Message.set("text", messageText);
    Message.set("chat", chat);
    Message.set("sender", getCurrentUser());
    await Message.save();
    return true;
  } catch (error) {
    console.log(
      `Error when trying to send a message to the database! ${error}`
    );
  }
}

export async function getMessagesToDisplay(chat) {
  try {
    const parseQuery = new Parse.Query("Message");
    parseQuery.containedIn("chat", chat);
    parseQuery.ascending("createdAt");
    parseQuery.includeAll();
    return parseQuery;
  } catch (error) {
    console.log(`Error when trying to get messages! ${error}`);
  }
}

async function getMessagesToDelete(chat) {
  try {
    const messageQuery = new Parse.Query("Message");
    messageQuery.equalTo("chat", chat);
    messageQuery.include("sender");
    return messageQuery.find();
  } catch (error) {
    console.log(
      `Error when trying to get all messages belonging to a chat! ${error}`
    );
  }
}

export async function deleteUser(user) {
  try {
    let chats = await getChats(user);
    for (let chat of chats) {
      let messages = await getMessagesToDelete(chat);
      await Parse.Object.destroyAll(messages);
    }
    await Parse.Object.destroyAll(chats);
    await user.destroy();
    return true;
  } catch (error) {
    console.log(
      `Error when trying to delete the user and all of their chats and messages! ${error}`
    );
  }
}

export async function createChat() {
  const availableUsers = await nonMatchedUsers();
  const otherUsers = await matchLanguages(availableUsers);
  if (otherUsers.length > 0) {
    const users = [getCurrentUser(), otherUsers[0]];
    const [lan1, lan2] = await findCommonLanguages(users);
    try {
      const chat = new Parse.Object("Chat");
      chat.set("language1", lan1[0]);
      chat.set("language2", lan2[0]);
      let usersRelation = chat.relation("users");
      usersRelation.add(users);
      return await chat.save();
    } catch (error) {
      console.log(`Error when trying to create a new chat! ${error}`);
    }
  }
  return false;
}

export async function createGroupChat() {
  const otherUsers = await getUsersForGroup();
  if (otherUsers.length > 1) {
    const user1 = otherUsers[0];
    const user2 = otherUsers[1];
    const users = [getCurrentUser(), user1, user2];
    const lan1 = await matchTargetLanguage(users);
    try {
      const chat = new Parse.Object("Chat");
      chat.set("language1", lan1[0][0]);
      let usersRelation = chat.relation("users");
      usersRelation.add(users);
      return await chat.save();
    } catch (error) {
      console.log(`Error when trying to create a new chat! ${error}`);
    }
  }
  return false;
}

//this function should be split out into several functions along with the other very similar functions
async function findCommonLanguages(users) {
  var numberOfUsers = 0;
  for (var user in users) {
    numberOfUsers = numberOfUsers + 1;
  }
  var currentTarget = [];
  var currentNative = [];
  const targetC = await getChosenLanguages(users[0], "targetLangs");
  for (let key in targetC) {
    currentTarget.push(targetC[key].get("name"));
  }
  const nativeC = await getChosenLanguages(users[0], "nativeLangs");
  for (let key in nativeC) {
    currentNative.push(nativeC[key].get("name"));
  }
  var matchedTarget = [];
  var matchedNative = [];
  var i = numberOfUsers - 1;
  while (i > 0) {
    let otherTarget = [];
    let otherNative = [];
    var targetO = await getChosenLanguages(users[i], "targetLangs");
    for (let key in targetO) {
      otherTarget.push(targetO[key].get("name"));
    }
    var nativeO = await getChosenLanguages(users[i], "nativeLangs");
    for (let key in nativeO) {
      otherNative.push(nativeO[key].get("name"));
    }
    matchedTarget.push(currentTarget.filter((e) => otherNative.includes(e)));
    matchedNative.push(currentNative.filter((e) => otherTarget.includes(e)));
    i = i - 1;
  }
  return [matchedTarget[0], matchedNative[0]];
}

async function matchTargetLanguage(users) {
  var numberOfUsers = 0;
  for (var user in users) {
    numberOfUsers = numberOfUsers + 1;
  }
  var currentTarget = [];
  const targetC = await getChosenLanguages(users[0], "targetLangs");
  for (let key in targetC) {
    currentTarget.push(targetC[key].get("name"));
  }
  var matchedTarget = [];
  var i = numberOfUsers - 1;
  while (i > 0) {
    let otherTarget = [];
    var targetO = await getChosenLanguages(users[i], "targetLangs");
    for (let key in targetO) {
      otherTarget.push(targetO[key].get("name"));
    }
    matchedTarget.push(currentTarget.filter((e) => otherTarget.includes(e)));
    i = i - 1;
  }
  return [matchedTarget[0]];
}

export async function getChats() {
  try {
    const chatQuery = new Parse.Query("Chat");
    chatQuery.equalTo("users", getCurrentUser());
    chatQuery.includeAll("users");
    return await chatQuery.find();
  } catch (error) {
    console.log(`Error when trying to read chats! ${error}`);
  }
}

async function getRelationObjects(object, relationName) {
  try {
    return await object.relation(relationName).query().find();
  } catch (error) {
    console.log(`Error when getting relation objects! ${error}`);
  }
}

export async function getChosenLanguages(user, languageType) {
  return await getRelationObjects(user, languageType);
}

export async function getUsersInChat(chat) {
  const users = await getRelationObjects(chat, "users");
  try {
    for (let user of users) {
      await user.get("profilePicture").fetch();
    }
    return users;
  } catch (error) {
    console.log(`Error when trying to get users belonging to chat! ${error}`);
  }
}

export function getCurrentUser() {
  return Parse.User.current();
}

async function nonMatchedUsers() {
  const chats = await getChats();
  const userNames = new Set();
  for (let chat of chats) {
    const users = await getUsersInChat(chat);
    for (let user of users) {
      userNames.add(user.get("username"));
    }
  }
  userNames.add(getCurrentUser().get("username"))
  const userNamesArray = [...userNames];
  try {
    const usersQuery = new Parse.Query("User");
    usersQuery.notContainedIn("username", userNamesArray);
    return await usersQuery.find();
  } catch (error) {
    console.log(
      `Error when trying to get all non matched users: ${error.message}`
    );
  }
}

function createArray(object, attribute) {
  var array = [];
  for (let key in object) {
    array.push(object[key].get(attribute));
  }
  return array;
}

async function matchLanguages(users) {
  const currentUser = getCurrentUser();
  const currentTarget = await getRelationObjects(currentUser, "targetLangs");
  const currentNative = await getRelationObjects(currentUser, "nativeLangs");
  const currentTargetLanguages = createArray(currentTarget, "name");
  const currentNativeLanguages = createArray(currentNative, "name");
  var includeUsers = [];
  for (let key in users) {
    const otherNative = await getRelationObjects(users[key], "nativeLangs");
    const otherNativeLanguages = createArray(otherNative, "name");
    const otherTarget = await getRelationObjects(users[key], "targetLangs");
    const otherTargetLanguages = createArray(otherTarget, "name");
    const existsTarget = currentTargetLanguages.some(
      (language) => otherNativeLanguages.indexOf(language) >= 0
    );
    const existsNative = currentNativeLanguages.some(
      (language) => otherTargetLanguages.indexOf(language) >= 0
    );
    if (existsTarget || existsNative) {
      let username = users[key].get("username");
      includeUsers.push(username);
    }
  }
  try {
    const usersQuery = new Parse.Query("User");
    usersQuery.containedIn("username", includeUsers);
    return await usersQuery.find();
  } catch (error) {
    console.log(
      `Error when trying to get all non matched users: ${error.message}`
    );
  }
}

async function getUsersForGroup() {
  const currentUser = getCurrentUser();
  const targetLanguages = await getRelationObjects(currentUser, "targetLangs");
  try {
    const usersQuery = new Parse.Query("User");
    usersQuery.notEqualTo("username", currentUser.get("username"));
    for (let key in targetLanguages) {
      usersQuery.equalTo("targetLangs", targetLanguages[key]);
    }
    return await usersQuery.find();
  } catch (error) {
    console.log(
      `Error when trying to get new users for a group chat: ${error.message}`
    );
  }
}

export async function getLanguages() {
  try {
    const languageQuery = new Parse.Query("Language");
    languageQuery.ascending("name");
    languageQuery.includeAll();
    return await languageQuery.find();
  } catch (error) {
    console.log(`Error while getting language options: ${error.message}`);
  }
}

export async function getCatIcons() {
  try {
    const queryIcons = new Parse.Query("CatIcons");
    return await queryIcons.find();
  } catch (error) {
    console.log(`Error when trying to get cat icons! ${error}`);
  }
}

export async function deleteChat(chat) {
  try {
    let messages = await getMessagesToDelete(chat);
    await Parse.Object.destroyAll(messages);
    return await chat.destroy();
  } catch (error) {
    return false;
  }
}

async function passwordResetHelper(email) {
  try {
    await Parse.User.requestPasswordReset(email);
    return true;
  } catch (error) {
    console.log(`Error when trying to reset password! ${error}`);
    return false;
  }
}

export async function passwordReset(email) {
  const query = new Parse.Query("User");
  try {
    const results = query.equalTo("email", email);
    const result = await results.find();
    if (result.length !== 0) {
      return passwordResetHelper(email);
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error resetting password", error);
  }
}
