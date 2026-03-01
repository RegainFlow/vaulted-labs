export function isTutorialCompleted(storageKey: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    return localStorage.getItem(storageKey) === "true";
  } catch {
    return false;
  }
}

export function setTutorialCompleted(storageKey: string, completed = true) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(storageKey, completed ? "true" : "false");
  } catch {
    // Ignore storage failures. Tutorials should never block the app.
  }
}

export function migrateTutorialCompletion(
  storageKey: string,
  legacyKeys: string[]
): boolean {
  if (typeof window === "undefined") return false;

  try {
    if (localStorage.getItem(storageKey) === "true") {
      return true;
    }

    const matchedLegacyKey = legacyKeys.find(
      (legacyKey) => localStorage.getItem(legacyKey) === "true"
    );

    if (!matchedLegacyKey) {
      return false;
    }

    localStorage.setItem(storageKey, "true");
    return true;
  } catch {
    return false;
  }
}
