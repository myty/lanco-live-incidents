const localSettingsPath = "./local.settings.json";

export function loadFromLocalSettings(path = localSettingsPath): void {
  try {
    const { Values } = JSON.parse(Deno.readTextFileSync(path));

    for (const key in Values) {
      if (Object.prototype.hasOwnProperty.call(Values, key)) {
        Deno.env.set(key, Values[key]);
      }
    }
  } catch {
    // Intentionally ignored
  }
}
