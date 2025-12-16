export async function loadJSON(url){
  try{
    const r = await fetch(url);
    if(!r.ok) throw new Error();
    return await r.json();
  }catch{
    return null;
  }
}
