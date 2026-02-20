function pick(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

export function checkoutReply(user, removed){

  if (removed.length === 0) {
    return pick([
      `I checked everything, ${user}, but there were no Chrome profiles to remove.`,
      `Nothing to clean up this time, ${user}. All Chrome profiles were already gone.`,
      `Looks like there was nothing left to log out, ${user}.`
    ]);
  }

  return pick([
    `All set, ${user}. I’ve logged out and removed these Chrome profiles:\n${removed.join("\n")}`,
    `Done, ${user}. The following Chrome profiles are now removed:\n${removed.join("\n")}`,
    `Checkout completed, ${user}. These profiles have been cleared:\n${removed.join("\n")}`
  ]);
}

export function checkinReply(user, logged){

  if (logged.length === 0) {
    return pick([
      `I tried to start Chrome, ${user}, but nothing needed opening.`,
      `Everything was already running, ${user}. No new profiles opened.`,
      `No profiles required launching this time, ${user}.`
    ]);
  }

  return pick([
    `Welcome back, ${user}. I’ve opened these Chrome profiles for you:\n${logged.join("\n")}`,
    `You’re checked in, ${user}. These profiles are now active:\n${logged.join("\n")}`,
    `All ready, ${user}. Chrome profiles launched:\n${logged.join("\n")}`
  ]);
}