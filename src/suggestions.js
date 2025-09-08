// Heuristic layout generator for dot journal ideas.
// Returns array of { title, description, sections: [{label, bounds: {x,y,w,h}}] }

import { synthesizePromptTags } from './tags.js';

export function generateIdeas({ purpose, width, height, promptConfig }) {
  const base = normalizePurpose(purpose);
  const tags = synthesizePromptTags(base, promptConfig);
  const ideas = [];
  const aspect = width / height;

  // Idea templates selection influenced by tags
  if(tags.has('fitness') || tags.has('exercise')) {
    ideas.push(makeFitnessSpread(width, height));
  }
  if(tags.has('habit') || tags.has('tracker')) {
    ideas.push(makeHabitGrid(width, height));
  }
  if(tags.has('meal') || tags.has('nutrition')) {
    ideas.push(makeMealPlanner(width, height));
  }
  if(tags.has('mood') || tags.has('emotion')) {
    ideas.push(makeMoodTracker(width, height));
  }
  if(tags.has('project') || tags.has('kanban')) {
    ideas.push(makeProjectKanban(width, height));
  }
  if(tags.has('finance') || tags.has('budget')) {
    ideas.push(makeFinanceBudget(width, height));
  }
  if(tags.has('goal')) ideas.push(makeGoalPlanner(width, height));
  if(tags.has('time')) ideas.push(makeTimeBlock(width, height));
  if(tags.has('sleep')) ideas.push(makeSleepTracker(width, height));
  if(tags.has('gratitude')) ideas.push(makeGratitude(width, height));
  if(tags.has('reading') || tags.has('learning')) ideas.push(makeReadingLearning(width, height));
  if(tags.has('travel')) ideas.push(makeTravelPlanner(width, height));
  if(tags.has('selfcare')) ideas.push(makeSelfCare(width, height));
  if(tags.has('creative')) ideas.push(makeCreativeBoard(width, height));
  if(tags.has('event')) ideas.push(makeEventPlanner(width, height));
  if(tags.has('health')) ideas.push(makeHealthLog(width, height));
  if(tags.has('hobby')) ideas.push(makeHobbyPractice(width, height));
  if(tags.has('social')) ideas.push(makeSocialConnections(width, height));
  if(tags.has('home')) ideas.push(makeHomeManagement(width, height));
  if(tags.has('pet')) ideas.push(makePetCare(width, height));
  if(tags.has('seasonal')) ideas.push(makeSeasonalPlanner(width, height));
  if(tags.has('minimal')) ideas.push(makeMinimalismTracker(width, height));
  if(tags.has('memory')) ideas.push(makeMemoryKeeper(width, height));
  if(tags.has('dream')) ideas.push(makeDreamJournal(width, height));
  if(tags.has('productivity')) ideas.push(makeProductivitySystem(width, height));
  if(tags.has('sustain')) ideas.push(makeSustainability(width, height));
  if(tags.has('growth')) ideas.push(makeGrowthReflection(width, height));
  if(tags.has('collection')) ideas.push(makeCollectionTracker(width, height));
  if(tags.has('gaming')) ideas.push(makeGamingLog(width, height));
  if(tags.has('language')) ideas.push(makeLanguageLearning(width, height));
  if(tags.has('spiritual')) ideas.push(makeSpiritualTracker(width, height));
  if(tags.has('career')) ideas.push(makeCareerNetworking(width, height));
  if(tags.has('garden')) ideas.push(makeGardenPlanner(width, height));
  if(tags.has('volunteer')) ideas.push(makeVolunteerLog(width, height));
  if(tags.has('fashion')) ideas.push(makeFashionStyle(width, height));
  if(tags.has('writing')) ideas.push(makeWritingPlanner(width, height));
  // Always include generic weekly and notes layout (guaranteed baseline)
  ideas.push(makeWeekly(width, height));
  ideas.push(makeNotesFocus(width, height));

  // Post-process: ensure uniqueness by title
  const unique = [];
  const seen = new Set();
  for(const i of ideas){
    if(!seen.has(i.title)) { seen.add(i.title); unique.push(i); }
  }

  if(unique.length === 0){
    // Fallback safety (should not occur)
    unique.push(makeNotesFocus(width, height));
  }
  return unique.slice(0,5);
}

function normalizePurpose(p){
  return p.toLowerCase();
}

function makeWeekly(w,h){
  const cols = 2; const rows = 4; // 8 blocks (7 days + notes)
  const cellW = Math.floor(w / cols);
  const cellH = Math.floor(h / rows);
  const sections = [];
  let idx=0; const labels=['Mon','Tue','Wed','Thu','Fri','Sat','Sun','Notes'];
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      if(idx>=labels.length) break;
      sections.push({ label: labels[idx], bounds: { x: c*cellW, y: r*cellH, w: cellW-1, h: cellH-1 }});
      idx++;
    }
  }
  return { title: 'Weekly Overview', description: 'Two-column weekly spread with notes block.', sections };
}

function makeNotesFocus(w,h){
  const headerH = Math.min(6, Math.floor(h*0.1));
  const sections = [
    { label: 'Header', bounds: { x:0,y:0,w:w-1,h:headerH }},
    { label: 'Notes', bounds: { x:0,y:headerH+1,w:w-1,h:h-headerH-2 }}
  ];
  return { title: 'Notes Centric', description: 'Large free-form notes area with subtle header.', sections };
}

function makeFitnessSpread(w,h){
  // Left metrics column, right workout log area
  const metricsW = Math.max(10, Math.floor(w*0.3));
  const sections = [
    { label: 'Goals', bounds: { x:0,y:0,w:metricsW-1,h:Math.floor(h*0.18) }},
    { label: 'Stats', bounds: { x:0,y:Math.floor(h*0.18)+1,w:metricsW-1,h:Math.floor(h*0.25) }},
    { label: 'Progress Graph', bounds: { x:0,y:Math.floor(h*0.43)+1,w:metricsW-1,h:Math.floor(h*0.25) }},
    { label: 'Workout Log', bounds: { x:metricsW+1,y:0,w:w-metricsW-2,h:h-1 }}
  ];
  return { title: 'Fitness Tracker', description: 'Metrics sidebar plus roomy workout log area.', sections };
}

function makeHabitGrid(w,h){
  // Grid of small squares; allocation depends on available width/height
  const cellSize = 4; // each habit square 4x4 dots
  const cols = Math.floor(w / (cellSize+1));
  const rows = Math.floor((h*0.55) / (cellSize+1));
  const habitAreaH = rows*(cellSize+1)-1;
  const sections = [
    { label: 'Habits', bounds: { x:0,y:0,w:w-1,h:habitAreaH }},
    { label: 'Reflection', bounds: { x:0,y:habitAreaH+2,w:w-1,h:h-habitAreaH-3 }}
  ];
  return { title: 'Habit Tracker', description: 'Compact habit grid with reflection space below.', sections };
}

function makeMealPlanner(w,h){
  const headerH = Math.min(5, Math.floor(h*0.08));
  const cols = 3; const rows = 3; // 9 blocks (Meals + grocery + notes)
  const cellW = Math.floor(w/cols);
  const cellH = Math.floor((h-headerH-2)/rows);
  const labels = ['Breakfast','Lunch','Dinner','Snacks','Hydration','Grocery','Prep','Calories','Notes'];
  const sections = [ { label: 'Header', bounds: { x:0,y:0,w:w-1,h:headerH }} ];
  let idx=0;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const y = headerH+1 + r*cellH;
      const x = c*cellW;
      sections.push({ label: labels[idx], bounds: { x, y, w: cellW-1, h: cellH-1 }});
      idx++;
    }
  }
  return { title: 'Meal Planner', description: 'Meal + nutrition blocks with header area.', sections };
}

function makeMoodTracker(w,h){
  // Top header, left legend, large horizontal timeline
  const headerH = Math.max(4, Math.floor(h*0.08));
  const legendW = Math.max(8, Math.floor(w*0.18));
  const timelineH = h - headerH - 2;
  const sections = [
    { label: 'Header', bounds: { x:0,y:0,w:w-1,h:headerH }},
    { label: 'Legend', bounds: { x:0,y:headerH+1,w:legendW-1,h:timelineH }},
    { label: 'Timeline', bounds: { x:legendW+1,y:headerH+1,w:w-legendW-2,h:timelineH }}
  ];
  return { title: 'Mood Tracker', description: 'Legend + horizontal timeline for daily mood tracking.', sections };
}

function makeProjectKanban(w,h){
  // 3-4 columns depending on width
  const cols = w > 40 ? 4 : 3;
  const colW = Math.floor(w/cols);
  const headerH = Math.max(4, Math.floor(h*0.07));
  const sections = [ { label:'Header', bounds:{ x:0,y:0,w:w-1,h:headerH } } ];
  const labels = ['Backlog','In Progress','Review','Done'];
  for(let c=0;c<cols;c++){
    const label = labels[c] || `Col ${c+1}`;
    sections.push({ label, bounds: { x:c*colW, y:headerH+1, w:colW-1, h:h-headerH-2 }});
  }
  return { title: 'Project Kanban', description: 'Columns for task flow under a shared header.', sections };
}

function makeFinanceBudget(w,h){
  const headerH = Math.max(4, Math.floor(h*0.08));
  const summaryH = Math.max(6, Math.floor(h*0.12));
  const bottomH = h - headerH - summaryH - 3;
  const leftW = Math.floor(w*0.5);
  const sections = [
    { label: 'Header', bounds: { x:0,y:0,w:w-1,h:headerH }},
    { label: 'Income', bounds: { x:0,y:headerH+1,w:leftW-2,h:summaryH }},
    { label: 'Fixed Costs', bounds: { x:leftW,y:headerH+1,w:w-leftW-1,h:Math.floor(summaryH/2)-1 }},
    { label: 'Variable Costs', bounds: { x:leftW,y:headerH+1+Math.floor(summaryH/2),w:w-leftW-1,h:Math.ceil(summaryH/2)-1 }},
    { label: 'Savings / Goals', bounds: { x:0,y:headerH+summaryH+2,w:leftW-2,h:bottomH }},
    { label: 'Graph / Notes', bounds: { x:leftW,y:headerH+summaryH+2,w:w-leftW-1,h:bottomH }}
  ];
  return { title: 'Finance Budget', description: 'Income & expenses summary with savings and notes/graph area.', sections };
}

function proportion(value, total, ratio){
  return Math.floor(total * ratio);
}

function makeGoalPlanner(w,h){
  const headerH = proportion(1,h,0.08);
  const ladderH = proportion(1,h,0.4);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Long-Term Goals', bounds:{x:0,y:headerH+1,w:Math.floor(w/2)-2,h:ladderH}},
    { label:'Short-Term Goals', bounds:{x:Math.floor(w/2),y:headerH+1,w:Math.ceil(w/2)-1,h:ladderH}},
    { label:'Milestones', bounds:{x:0,y:headerH+ladderH+2,w:w-1,h:proportion(1,h,0.18)}},
    { label:'Action Steps', bounds:{x:0,y:headerH+ladderH+2+proportion(1,h,0.18)+1,w:w-1,h:h-(headerH+ladderH+proportion(1,h,0.18)+4)}}
  ];
  return { title:'Goal Planner', description:'Split long vs short term goals with milestones and actions.', sections };
}

function makeTimeBlock(w,h){
  const headerH = proportion(1,h,0.07);
  const timelineH = proportion(1,h,0.15);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Time Blocks', bounds:{x:0,y:headerH+1,w:w-1,h:timelineH}},
    { label:'Tasks / Deadlines', bounds:{x:0,y:headerH+timelineH+2,w:Math.floor(w*0.55),h:h-headerH-timelineH-3}},
    { label:'Pomodoro Log', bounds:{x:Math.floor(w*0.55)+1,y:headerH+timelineH+2,w:w-Math.floor(w*0.55)-2,h:h-headerH-timelineH-3}}
  ];
  return { title:'Time Management', description:'Time-block overview with tasks and pomodoro log.', sections };
}

function makeSleepTracker(w,h){
  const headerH = proportion(1,h,0.08);
  const logH = proportion(1,h,0.45);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Sleep Log', bounds:{x:0,y:headerH+1,w:w-1,h:logH}},
    { label:'Quality / Factors', bounds:{x:0,y:headerH+logH+2,w:Math.floor(w/2)-2,h:h-headerH-logH-3}},
    { label:'Notes', bounds:{x:Math.floor(w/2),y:headerH+logH+2,w:Math.ceil(w/2)-1,h:h-headerH-logH-3}}
  ];
  return { title:'Sleep Tracker', description:'Log bedtime, wake time, duration, and influencing factors.', sections };
}

function makeGratitude(w,h){
  const headerH = proportion(1,h,0.08);
  const dailyH = proportion(1,h,0.5);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Daily Entries', bounds:{x:0,y:headerH+1,w:w-1,h:dailyH}},
    { label:'Theme Lists', bounds:{x:0,y:headerH+dailyH+2,w:Math.floor(w/2)-2,h:h-headerH-dailyH-3}},
    { label:'Reflections', bounds:{x:Math.floor(w/2),y:headerH+dailyH+2,w:Math.ceil(w/2)-1,h:h-headerH-dailyH-3}}
  ];
  return { title:'Gratitude Log', description:'Daily gratitude with themed lists and reflection area.', sections };
}

function makeReadingLearning(w,h){
  const headerH = proportion(1,h,0.07);
  const listH = proportion(1,h,0.45);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Reading List', bounds:{x:0,y:headerH+1,w:Math.floor(w*0.55)-2,h:listH}},
    { label:'Study Topics', bounds:{x:Math.floor(w*0.55),y:headerH+1,w:w-Math.floor(w*0.55)-1,h:listH}},
    { label:'Quotes / Key Takeaways', bounds:{x:0,y:headerH+listH+2,w:w-1,h:h-headerH-listH-3}}
  ];
  return { title:'Reading & Learning', description:'Track books, topics, and capture key insights.', sections };
}

function makeTravelPlanner(w,h){
  const headerH = proportion(1,h,0.07);
  const itineraryH = proportion(1,h,0.4);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Itinerary', bounds:{x:0,y:headerH+1,w:w-1,h:itineraryH}},
    { label:'Packing List', bounds:{x:0,y:headerH+itineraryH+2,w:Math.floor(w/2)-2,h:h-headerH-itineraryH-3}},
    { label:'Budget / Expenses', bounds:{x:Math.floor(w/2),y:headerH+itineraryH+2,w:Math.ceil(w/2)-1,h:Math.floor((h-headerH-itineraryH-3)/2)}},
    { label:'Memories / Highlights', bounds:{x:Math.floor(w/2),y:headerH+itineraryH+2+Math.floor((h-headerH-itineraryH-3)/2)+1,w:Math.ceil(w/2)-1,h:h-headerH-itineraryH-3-Math.floor((h-headerH-itineraryH-3)/2)-1}}
  ];
  return { title:'Travel Planner', description:'Plan itinerary, packing, budget, and memories.', sections };
}

function makeSelfCare(w,h){
  const headerH = proportion(1,h,0.07);
  const activityH = proportion(1,h,0.4);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Self-Care Activities', bounds:{x:0,y:headerH+1,w:Math.floor(w*0.55)-2,h:activityH}},
    { label:'Hydration / Habits', bounds:{x:Math.floor(w*0.55),y:headerH+1,w:w-Math.floor(w*0.55)-1,h:activityH}},
    { label:'Reflection', bounds:{x:0,y:headerH+activityH+2,w:w-1,h:h-headerH-activityH-3}}
  ];
  return { title:'Self-Care & Wellness', description:'Track self-care routines, hydration, and reflections.', sections };
}

function makeCreativeBoard(w,h){
  const headerH = proportion(1,h,0.06);
  const ideaH = proportion(1,h,0.35);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Brainstorm', bounds:{x:0,y:headerH+1,w:Math.floor(w/2)-2,h:ideaH}},
    { label:'Inspiration', bounds:{x:Math.floor(w/2),y:headerH+1,w:Math.ceil(w/2)-1,h:ideaH}},
    { label:'Progress Tracker', bounds:{x:0,y:headerH+ideaH+2,w:Math.floor(w/2)-2,h:h-headerH-ideaH-3}},
    { label:'Notes / Mood Board', bounds:{x:Math.floor(w/2),y:headerH+ideaH+2,w:Math.ceil(w/2)-1,h:h-headerH-ideaH-3}}
  ];
  return { title:'Creative Project Board', description:'Brainstorm, inspiration, progress tracking, and mood board.', sections };
}

function makeEventPlanner(w,h){
  const headerH = proportion(1,h,0.07);
  const checklistH = proportion(1,h,0.4);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Checklist', bounds:{x:0,y:headerH+1,w:Math.floor(w*0.5)-2,h:checklistH}},
    { label:'Guest List', bounds:{x:Math.floor(w*0.5),y:headerH+1,w:Math.ceil(w*0.5)-1,h:checklistH}},
    { label:'Vendors / Contacts', bounds:{x:0,y:headerH+checklistH+2,w:Math.floor(w*0.5)-2,h:h-headerH-checklistH-3}},
    { label:'Notes / Lessons', bounds:{x:Math.floor(w*0.5),y:headerH+checklistH+2,w:Math.ceil(w*0.5)-1,h:h-headerH-checklistH-3}}
  ];
  return { title:'Event Planner', description:'Checklist, guests, vendors, notes for event management.', sections };
}

function makeHealthLog(w,h){
  const headerH = proportion(1,h,0.07);
  const symptomsH = proportion(1,h,0.35);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Symptoms', bounds:{x:0,y:headerH+1,w:Math.floor(w/2)-2,h:symptomsH}},
    { label:'Medications', bounds:{x:Math.floor(w/2),y:headerH+1,w:Math.ceil(w/2)-1,h:symptomsH}},
    { label:'Appointments', bounds:{x:0,y:headerH+symptomsH+2,w:Math.floor(w/2)-2,h:h-headerH-symptomsH-3}},
    { label:'Lifestyle Factors', bounds:{x:Math.floor(w/2),y:headerH+symptomsH+2,w:Math.ceil(w/2)-1,h:h-headerH-symptomsH-3}}
  ];
  return { title:'Health Log', description:'Symptoms, medications, appointments, and lifestyle factors.', sections };
}

function makeHobbyPractice(w,h){
  const headerH = proportion(1,h,0.07);
  const practiceH = proportion(1,h,0.4);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Practice Log', bounds:{x:0,y:headerH+1,w:w-1,h:practiceH}},
    { label:'Goals', bounds:{x:0,y:headerH+practiceH+2,w:Math.floor(w/2)-2,h:h-headerH-practiceH-3}},
    { label:'Progress Notes', bounds:{x:Math.floor(w/2),y:headerH+practiceH+2,w:Math.ceil(w/2)-1,h:h-headerH-practiceH-3}}
  ];
  return { title:'Hobby Practice', description:'Practice log with goals and progress notes.', sections };
}

function makeSocialConnections(w,h){
  const headerH = proportion(1,h,0.07);
  const contactsH = proportion(1,h,0.45);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Contacts / Outreach', bounds:{x:0,y:headerH+1,w:Math.floor(w/2)-2,h:contactsH}},
    { label:'Important Dates', bounds:{x:Math.floor(w/2),y:headerH+1,w:Math.ceil(w/2)-1,h:contactsH}},
    { label:'Meetup Ideas', bounds:{x:0,y:headerH+contactsH+2,w:w-1,h:h-headerH-contactsH-3}}
  ];
  return { title:'Social Connections', description:'Outreach, important dates, and meetup planning.', sections };
}

function makeHomeManagement(w,h){
  const headerH = proportion(1,h,0.07);
  const choresH = proportion(1,h,0.35);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Chores / Schedule', bounds:{x:0,y:headerH+1,w:Math.floor(w/2)-2,h:choresH}},
    { label:'Maintenance Log', bounds:{x:Math.floor(w/2),y:headerH+1,w:Math.ceil(w/2)-1,h:choresH}},
    { label:'Projects', bounds:{x:0,y:headerH+choresH+2,w:Math.floor(w/2)-2,h:h-headerH-choresH-3}},
    { label:'Utilities / Sustainability', bounds:{x:Math.floor(w/2),y:headerH+choresH+2,w:Math.ceil(w/2)-1,h:h-headerH-choresH-3}}
  ];
  return { title:'Home Management', description:'Chores, maintenance, projects, and utilities tracking.', sections };
}

function makePetCare(w,h){
  const headerH = proportion(1,h,0.07);
  const scheduleH = proportion(1,h,0.4);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Care Schedule', bounds:{x:0,y:headerH+1,w:Math.floor(w/2)-2,h:scheduleH}},
    { label:'Health / Vet', bounds:{x:Math.floor(w/2),y:headerH+1,w:Math.ceil(w/2)-1,h:scheduleH}},
    { label:'Behavior / Training', bounds:{x:0,y:headerH+scheduleH+2,w:w-1,h:h-headerH-scheduleH-3}}
  ];
  return { title:'Pet Care', description:'Care schedule, health log, and behavior tracking.', sections };
}

function makeSeasonalPlanner(w,h){
  const headerH = proportion(1,h,0.07);
  const calendarH = proportion(1,h,0.35);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Seasonal Calendar', bounds:{x:0,y:headerH+1,w:w-1,h:calendarH}},
    { label:'Activities / Traditions', bounds:{x:0,y:headerH+calendarH+2,w:Math.floor(w/2)-2,h:h-headerH-calendarH-3}},
    { label:'Gifts / Budget', bounds:{x:Math.floor(w/2),y:headerH+calendarH+2,w:Math.ceil(w/2)-1,h:h-headerH-calendarH-3}}
  ];
  return { title:'Seasonal Planner', description:'Track seasonal events, traditions, and gift ideas.', sections };
}

function makeMinimalismTracker(w,h){
  const headerH = proportion(1,h,0.07);
  const declutterH = proportion(1,h,0.4);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Declutter Log', bounds:{x:0,y:headerH+1,w:w-1,h:declutterH}},
    { label:'Capsule Wardrobe', bounds:{x:0,y:headerH+declutterH+2,w:Math.floor(w/2)-2,h:h-headerH-declutterH-3}},
    { label:'Challenges / Progress', bounds:{x:Math.floor(w/2),y:headerH+declutterH+2,w:Math.ceil(w/2)-1,h:h-headerH-declutterH-3}}
  ];
  return { title:'Minimalism Tracker', description:'Decluttering, capsule wardrobe, and progress challenges.', sections };
}

function makeMemoryKeeper(w,h){
  const headerH = proportion(1,h,0.07);
  const memoryH = proportion(1,h,0.45);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Memories / Moments', bounds:{x:0,y:headerH+1,w:w-1,h:memoryH}},
    { label:'Quotes / Highlights', bounds:{x:0,y:headerH+memoryH+2,w:Math.floor(w/2)-2,h:h-headerH-memoryH-3}},
    { label:'Reflections', bounds:{x:Math.floor(w/2),y:headerH+memoryH+2,w:Math.ceil(w/2)-1,h:h-headerH-memoryH-3}}
  ];
  return { title:'Memory Keeper', description:'Capture important memories, quotes, and reflections.', sections };
}

function makeDreamJournal(w,h){
  const headerH = proportion(1,h,0.07);
  const logH = proportion(1,h,0.5);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Dream Log', bounds:{x:0,y:headerH+1,w:w-1,h:logH}},
    { label:'Themes / Symbols', bounds:{x:0,y:headerH+logH+2,w:Math.floor(w/2)-2,h:h-headerH-logH-3}},
    { label:'Analysis / Notes', bounds:{x:Math.floor(w/2),y:headerH+logH+2,w:Math.ceil(w/2)-1,h:h-headerH-logH-3}}
  ];
  return { title:'Dream Journal', description:'Record dreams with themes, symbols, and analysis.', sections };
}

function makeProductivitySystem(w,h){
  const headerH = proportion(1,h,0.07);
  const matrixH = proportion(1,h,0.35);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Eisenhower Matrix', bounds:{x:0,y:headerH+1,w:Math.floor(w/2)-2,h:matrixH}},
    { label:'Backlog / Brain Dump', bounds:{x:Math.floor(w/2),y:headerH+1,w:Math.ceil(w/2)-1,h:matrixH}},
    { label:'Next Actions', bounds:{x:0,y:headerH+matrixH+2,w:Math.floor(w/2)-2,h:h-headerH-matrixH-3}},
    { label:'Review / Notes', bounds:{x:Math.floor(w/2),y:headerH+matrixH+2,w:Math.ceil(w/2)-1,h:h-headerH-matrixH-3}}
  ];
  return { title:'Productivity System', description:'Eisenhower matrix, backlog, next actions, and review.', sections };
}

function makeSustainability(w,h){
  const headerH = proportion(1,h,0.07);
  const logH = proportion(1,h,0.4);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Eco Log', bounds:{x:0,y:headerH+1,w:w-1,h:logH}},
    { label:'Goals', bounds:{x:0,y:headerH+logH+2,w:Math.floor(w/2)-2,h:h-headerH-logH-3}},
    { label:'Progress / Metrics', bounds:{x:Math.floor(w/2),y:headerH+logH+2,w:Math.ceil(w/2)-1,h:h-headerH-logH-3}}
  ];
  return { title:'Sustainability Tracker', description:'Track eco-friendly habits, goals, and progress.', sections };
}

function makeGrowthReflection(w,h){
  const headerH = proportion(1,h,0.07);
  const promptsH = proportion(1,h,0.4);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Prompts / Values', bounds:{x:0,y:headerH+1,w:Math.floor(w/2)-2,h:promptsH}},
    { label:'Reflection Log', bounds:{x:Math.floor(w/2),y:headerH+1,w:Math.ceil(w/2)-1,h:promptsH}},
    { label:'Progress / Insights', bounds:{x:0,y:headerH+promptsH+2,w:w-1,h:h-headerH-promptsH-3}}
  ];
  return { title:'Personal Growth & Reflection', description:'Values, reflections, and insights tracking.', sections };
}

function makeCollectionTracker(w,h){
  const headerH = proportion(1,h,0.07);
  const invH = proportion(1,h,0.45);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Inventory', bounds:{x:0,y:headerH+1,w:w-1,h:invH}},
    { label:'Wishlist / Rares', bounds:{x:0,y:headerH+invH+2,w:Math.floor(w/2)-2,h:h-headerH-invH-3}},
    { label:'Trades / Notes', bounds:{x:Math.floor(w/2),y:headerH+invH+2,w:Math.ceil(w/2)-1,h:h-headerH-invH-3}}
  ];
  return { title:'Collection Tracker', description:'Inventory management with wishlist and trade notes.', sections };
}

function makeGamingLog(w,h){
  const headerH = proportion(1,h,0.07);
  const progressH = proportion(1,h,0.4);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Games / Progress', bounds:{x:0,y:headerH+1,w:w-1,h:progressH}},
    { label:'Achievements', bounds:{x:0,y:headerH+progressH+2,w:Math.floor(w/2)-2,h:h-headerH-progressH-3}},
    { label:'Backlog / Wishlist', bounds:{x:Math.floor(w/2),y:headerH+progressH+2,w:Math.ceil(w/2)-1,h:h-headerH-progressH-3}}
  ];
  return { title:'Gaming Log', description:'Track game progress, achievements, and backlog.', sections };
}

function makeLanguageLearning(w,h){
  const headerH = proportion(1,h,0.07);
  const vocabH = proportion(1,h,0.45);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Vocabulary', bounds:{x:0,y:headerH+1,w:Math.floor(w/2)-2,h:vocabH}},
    { label:'Grammar / Rules', bounds:{x:Math.floor(w/2),y:headerH+1,w:Math.ceil(w/2)-1,h:vocabH}},
    { label:'Practice Log', bounds:{x:0,y:headerH+vocabH+2,w:w-1,h:h-headerH-vocabH-3}}
  ];
  return { title:'Language Learning', description:'Vocabulary, grammar, and practice log.', sections };
}

function makeSpiritualTracker(w,h){
  const headerH = proportion(1,h,0.07);
  const practiceH = proportion(1,h,0.4);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Practices / Schedule', bounds:{x:0,y:headerH+1,w:w-1,h:practiceH}},
    { label:'Reflections', bounds:{x:0,y:headerH+practiceH+2,w:Math.floor(w/2)-2,h:h-headerH-practiceH-3}},
    { label:'Readings / Insights', bounds:{x:Math.floor(w/2),y:headerH+practiceH+2,w:Math.ceil(w/2)-1,h:h-headerH-practiceH-3}}
  ];
  return { title:'Spiritual Tracker', description:'Track practices, readings, and reflections.', sections };
}

function makeCareerNetworking(w,h){
  const headerH = proportion(1,h,0.07);
  const appsH = proportion(1,h,0.4);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Applications / Interviews', bounds:{x:0,y:headerH+1,w:w-1,h:appsH}},
    { label:'Networking / Contacts', bounds:{x:0,y:headerH+appsH+2,w:Math.floor(w/2)-2,h:h-headerH-appsH-3}},
    { label:'Professional Development', bounds:{x:Math.floor(w/2),y:headerH+appsH+2,w:Math.ceil(w/2)-1,h:h-headerH-appsH-3}}
  ];
  return { title:'Career & Networking', description:'Applications, networking, and professional development.', sections };
}

function makeGardenPlanner(w,h){
  const headerH = proportion(1,h,0.07);
  const layoutH = proportion(1,h,0.45);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Garden Layout', bounds:{x:0,y:headerH+1,w:w-1,h:layoutH}},
    { label:'Planting / Schedule', bounds:{x:0,y:headerH+layoutH+2,w:Math.floor(w/2)-2,h:h-headerH-layoutH-3}},
    { label:'Care / Pests', bounds:{x:Math.floor(w/2),y:headerH+layoutH+2,w:Math.ceil(w/2)-1,h:h-headerH-layoutH-3}}
  ];
  return { title:'Garden Planner', description:'Layout, planting schedule, and plant care tracking.', sections };
}

function makeVolunteerLog(w,h){
  const headerH = proportion(1,h,0.07);
  const hoursH = proportion(1,h,0.4);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Hours Log', bounds:{x:0,y:headerH+1,w:w-1,h:hoursH}},
    { label:'Organizations', bounds:{x:0,y:headerH+hoursH+2,w:Math.floor(w/2)-2,h:h-headerH-hoursH-3}},
    { label:'Project Ideas / Impact', bounds:{x:Math.floor(w/2),y:headerH+hoursH+2,w:Math.ceil(w/2)-1,h:h-headerH-hoursH-3}}
  ];
  return { title:'Volunteer Log', description:'Track volunteer hours, organizations, and impact ideas.', sections };
}

function makeFashionStyle(w,h){
  const headerH = proportion(1,h,0.07);
  const outfitsH = proportion(1,h,0.4);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Outfit / Lookbook', bounds:{x:0,y:headerH+1,w:w-1,h:outfitsH}},
    { label:'Shopping List', bounds:{x:0,y:headerH+outfitsH+2,w:Math.floor(w/2)-2,h:h-headerH-outfitsH-3}},
    { label:'Repairs / Alterations', bounds:{x:Math.floor(w/2),y:headerH+outfitsH+2,w:Math.ceil(w/2)-1,h:h-headerH-outfitsH-3}}
  ];
  return { title:'Fashion & Style', description:'Lookbook, shopping list, and repairs tracking.', sections };
}

function makeWritingPlanner(w,h){
  const headerH = proportion(1,h,0.07);
  const ideasH = proportion(1,h,0.35);
  const sections = [
    { label:'Header', bounds:{x:0,y:0,w:w-1,h:headerH}},
    { label:'Story Ideas / Brainstorm', bounds:{x:0,y:headerH+1,w:Math.floor(w/2)-2,h:ideasH}},
    { label:'Characters / World', bounds:{x:Math.floor(w/2),y:headerH+1,w:Math.ceil(w/2)-1,h:ideasH}},
    { label:'Outline / Plot', bounds:{x:0,y:headerH+ideasH+2,w:Math.floor(w/2)-2,h:h-headerH-ideasH-3}},
    { label:'Daily Writing Log', bounds:{x:Math.floor(w/2),y:headerH+ideasH+2,w:Math.ceil(w/2)-1,h:h-headerH-ideasH-3}}
  ];
  return { title:'Writing Planner', description:'Brainstorm, outline, and daily writing log.', sections };
}

