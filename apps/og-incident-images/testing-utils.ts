const localSettingsPath = "./local.settings.json";

export function loadFromLocalSettings(): void {
  try {
    const { Values } = JSON.parse(Deno.readTextFileSync(localSettingsPath));

    for (const key in Values) {
      if (Object.prototype.hasOwnProperty.call(Values, key)) {
        Deno.env.set(key, Values[key]);
      }
    }
  } catch {
    // Intentionally ignored
  }
}
