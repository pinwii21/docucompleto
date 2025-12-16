export async function loadGeoJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error");
    return await res.json();
  } catch {
    console.warn("No se pudo cargar:", url);
    return null;
  }
}
