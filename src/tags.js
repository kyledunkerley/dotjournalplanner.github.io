// Build a set of tags derived from purpose plus optional prompt-config synonyms
export function synthesizePromptTags(purpose, promptConfig){
  const tokens = purpose.split(/[^a-z0-9]+/).filter(Boolean);
  const set = new Set(tokens);
  if(promptConfig && promptConfig.synonyms){
    for(const [tag, words] of Object.entries(promptConfig.synonyms)){
      for(const w of words){
        if(tokens.includes(w.toLowerCase())) set.add(tag.toLowerCase());
      }
    }
  }
  return set;
}
