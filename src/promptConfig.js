export async function loadPromptConfig(){
  try {
    const res = await fetch('./prompt-config.json', { cache: 'no-store' });
    if(!res.ok) throw new Error('not ok');
    return await res.json();
  } catch(err){
    console.warn('Prompt config not loaded:', err.message);
    return null;
  }
}
