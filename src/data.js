export const lessons = [
  {id:1, level:"A1", title:"Introductions", desc:"Introduce yourself and ask basic questions.", words:["introduce","name","country","work","meet"], grammar:"Verb to be"},
  {id:2, level:"A1", title:"Daily Routine", desc:"Talk about what you do every day.", words:["wake up","usually","sometimes","early","busy"], grammar:"Present Simple"},
  {id:3, level:"A2", title:"Past Experiences", desc:"Describe things that happened before.", words:["visited","decided","arrived","enjoyed","before"], grammar:"Past Simple"},
  {id:4, level:"A2", title:"Plans & Arrangements", desc:"Talk about future plans.", words:["plan","tomorrow","appointment","probably","arrange"], grammar:"Going to / Present Continuous"},
  {id:5, level:"B1", title:"Opinions", desc:"Give reasons and express your point of view.", words:["opinion","however","although","prefer","suggest"], grammar:"Linking ideas"},
  {id:6, level:"B1", title:"Work & Projects", desc:"Discuss tasks, deadlines and progress.", words:["deadline","progress","require","improve","manage"], grammar:"Present Perfect"},
  {id:7, level:"B2", title:"Arguments", desc:"Build a clear argument and respond to another view.", words:["evidence","claim","whereas","despite","therefore"], grammar:"Complex clauses"},
  {id:8, level:"B2", title:"Natural Conversation", desc:"Understand and use common conversational patterns.", words:["actually","basically","fairly","apparently","rather"], grammar:"Nuance & emphasis"},
  {id:9, level:"C1", title:"Academic & Professional English", desc:"Express complex ideas precisely.", words:["substantial","implement","assess","consequently","perspective"], grammar:"Formal structures"},
  {id:10, level:"C1", title:"Advanced Fluency", desc:"Handle abstract topics with precision and flexibility.", words:["nevertheless","coherent","underlying","ambiguous","convey"], grammar:"Advanced discourse"},
  {id:11, level:"C2", title:"Precision & Nuance", desc:"Work with subtle differences in meaning and tone.", words:["intricate","implicit","plausible","connotation","distinction"], grammar:"Precision"},
  {id:12, level:"C2", title:"Mastery", desc:"Synthesize ideas and communicate naturally in demanding contexts.", words:["synthesize","articulate","compelling","profound","subtle"], grammar:"Style & register"}
];

export const vocabulary = [
  ["achieve","to successfully reach a goal","She worked hard to achieve her goal.","B1"],
  ["accurate","correct and without mistakes","Please give me an accurate answer.","B1"],
  ["although","despite the fact that","Although it was late, we continued.","B1"],
  ["approach","a way of dealing with something","We need a different approach.","B2"],
  ["assess","to judge or evaluate","We need to assess the results.","B2"],
  ["aware","knowing about something","Are you aware of the risks?","B1"],
  ["clarify","to make something clear","Could you clarify your point?","B1"],
  ["coherent","logical and well organized","Her explanation was coherent.","C1"],
  ["convey","to communicate an idea or feeling","Words cannot convey how grateful I am.","C1"],
  ["despite","without being affected by","Despite the rain, we went out.","B2"],
  ["evidence","facts that show something is true","There is strong evidence for this.","B2"],
  ["implement","to put a plan into action","The company will implement the new system.","C1"],
  ["improve","to become better","I want to improve my English.","A2"],
  ["nevertheless","despite what has just been said","It was difficult; nevertheless, we continued.","C1"],
  ["perspective","a particular way of seeing something","Try to see it from her perspective.","B2"],
  ["substantial","large or important","There has been substantial progress.","C1"],
  ["subtle","not obvious; difficult to notice","There is a subtle difference.","C1"],
  ["underlying","existing beneath the surface","We need to understand the underlying problem.","C1"]
];

export const grammar = [
  {title:"Present Simple",level:"A1",rule:"Use it for routines, habits and general facts.",example:"I work every day. / She works every day.",question:"She ___ English every evening.",answer:"studies",options:["study","studies","studying","studied"]},
  {title:"Past Simple",level:"A2",rule:"Use it for completed actions in the past.",example:"I visited London last year.",question:"They ___ home late yesterday.",answer:"arrived",options:["arrive","arrived","have arrived","arriving"]},
  {title:"Present Perfect",level:"B1",rule:"Use it for past actions connected to the present.",example:"I have finished my work.",question:"She ___ already finished the report.",answer:"has",options:["have","has","had","is"]},
  {title:"Conditionals",level:"B2",rule:"Use conditional structures to discuss real or hypothetical situations.",example:"If I had more time, I would travel more.",question:"If I had known, I ___ have called you.",answer:"would",options:["will","would","can","am"]},
  {title:"Advanced Linking",level:"C1",rule:"Use however, therefore, whereas and nevertheless to connect complex ideas.",example:"The plan is expensive; nevertheless, it may be worthwhile.",question:"The task was difficult; ___, we completed it.",answer:"nevertheless",options:["because","nevertheless","unless","during"]}
];

export const readings = [
  {title:"A Better Habit",level:"B1",text:"Learning a language is less about studying for one long day and more about returning to the language every day. Short, focused sessions help you notice patterns, retrieve words from memory, and build confidence. The key is consistency.",question:"According to the text, what matters most?",answer:"Consistency",options:["Studying once a week","Consistency","Learning every word","Long sessions"]},
  {title:"The Value of Perspective",level:"B2",text:"When people disagree, they often focus on defending their own position. A more productive approach is to understand why the other person sees the issue differently. This does not require accepting the other view; it requires understanding it accurately.",question:"What does the writer recommend?",answer:"Understanding the other view accurately",options:["Always agreeing","Ignoring disagreement","Understanding the other view accurately","Avoiding difficult topics"]},
  {title:"Technology and Attention",level:"C1",text:"Digital tools can increase productivity, but they can also fragment attention. The problem is not technology itself; it is the absence of deliberate boundaries. People who decide when and why they will use a tool are more likely to remain focused on demanding work.",question:"What is the central idea?",answer:"Deliberate boundaries can help protect attention.",options:["Technology is always harmful.","Digital tools should be banned.","Deliberate boundaries can help protect attention.","Productivity requires more apps."]}
];

export const listening = [
  {title:"Daily Plans",level:"A2",text:"I usually start work at eight, but tomorrow I'm going to start a little later because I have a doctor's appointment.",question:"Why will the speaker start later?",answer:"Because of an appointment.",options:["Because of traffic.","Because of an appointment.","Because of work.","Because of the weather."]},
  {title:"A Project Update",level:"B1",text:"We've finished the first stage of the project, and we're currently testing the new system. If everything goes well, we'll launch it next week.",question:"What are they doing now?",answer:"Testing the new system.",options:["Planning the project.","Testing the new system.","Launching the system.","Hiring staff."]}
];