import React, { useEffect, useState } from "react";
import {
  lessons,
  vocabulary,
  grammar,
  readings,
  listening,
} from "./data.js";

const STORAGE_KEY = "english-master-progress";

const defaultProgress = {
  xp: 0,
  completedLessons: [],
  learnedWords: [],
  grammarDone: [],
  readingDone: [],
  listeningDone: [],
  speakingSessions: 0,
  writingSessions: 0,
  level: "A1",
};

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? { ...defaultProgress, ...JSON.parse(saved) }
      : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

function PageTitle({ title, subtitle }) {
  return (
    <div className="pageTitle">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const addXp = (amount) => {
    setProgress((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + amount,
    }));
  };

  const updateProgress = (changes) => {
    setProgress((prev) => ({
      ...prev,
      ...changes,
    }));
  };

  return (
    <div className="app">
      <TopBar progress={progress} />

      {page === "home" && (
        <Home
          progress={progress}
          addXp={addXp}
          updateProgress={updateProgress}
          setPage={setPage}
        />
      )}

      {page === "lessons" && (
        <Lessons
          progress={progress}
          addXp={addXp}
          updateProgress={updateProgress}
        />
      )}

      {page === "words" && (
        <Vocabulary
          progress={progress}
          addXp={addXp}
          updateProgress={updateProgress}
        />
      )}

      {page === "grammar" && (
        <Grammar
          progress={progress}
          addXp={addXp}
          updateProgress={updateProgress}
        />
      )}

      {page === "reading" && (
        <Reading
          progress={progress}
          addXp={addXp}
          updateProgress={updateProgress}
        />
      )}

      {page === "listening" && (
        <Listening
          progress={progress}
          addXp={addXp}
          updateProgress={updateProgress}
        />
      )}

      {page === "speaking" && (
        <Speaking
          progress={progress}
          addXp={addXp}
          updateProgress={updateProgress}
        />
      )}

      {page === "writing" && (
        <Writing
          progress={progress}
          addXp={addXp}
          updateProgress={updateProgress}
        />
      )}

      <BottomNav page={page} setPage={setPage} />
    </div>
  );
}

function TopBar({ progress }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brandMark">E</span>
        <span>ENGLISH MASTER</span>
      </div>

      <div className="topStats">
        <span>
          XP <strong>{progress.xp || 0}</strong>
        </span>
        <span>
          LEVEL <strong>{progress.level || "A1"}</strong>
        </span>
      </div>
    </header>
  );
}

function Home({ progress, addXp, updateProgress, setPage }) {
  const [teacherState, setTeacherState] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [teacherReply, setTeacherReply] = useState("");
  const [correction, setCorrection] = useState("");
  const [explanation, setExplanation] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [history, setHistory] = useState([]);

  const speak = (text, onEnd) => {
    if (!text || !window.speechSynthesis) {
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onend = () => {
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  const askTeacher = async (message) => {
    const cleanMessage = message?.trim();

    if (!cleanMessage) return;

    setTeacherState("thinking");
    setTranscript(cleanMessage);
    setTeacherReply("");
    setCorrection("");
    setExplanation("");
    setFollowUp("");

    try {
      const response = await fetch("/api/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: cleanMessage,
          history,
          level: progress.level || "A1",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Teacher request failed.");
      }

      const reply = data.reply || "";
      const nextCorrection = data.correction || "";
      const nextExplanation = data.explanation || "";
      const nextFollowUp = data.followUp || "";

      setTeacherReply(reply);
      setCorrection(nextCorrection);
      setExplanation(nextExplanation);
      setFollowUp(nextFollowUp);

      setHistory((previous) => [
        ...previous.slice(-11),
        {
          role: "student",
          content: cleanMessage,
        },
        {
          role: "teacher",
          content: `${reply} ${nextFollowUp}`.trim(),
        },
      ]);

      setTeacherState("speaking");

      speak(
        `${reply} ${nextFollowUp}`.trim(),
        () => setTeacherState("idle")
      );

      addXp(5);

      updateProgress({
        speakingSessions:
          (progress.speakingSessions || 0) + 1,
      });
    } catch (error) {
      console.error(error);

      setTeacherState("idle");
      setTeacherReply(
        "I couldn't connect to the English Teacher right now."
      );
    }
  };

  const startConversation = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTeacherReply(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    window.speechSynthesis?.cancel();

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    setTeacherState("listening");
    setTranscript("");
    setTeacherReply("");
    setCorrection("");
    setExplanation("");
    setFollowUp("");

    recognition.onresult = (event) => {
      const text =
        event.results[0][0].transcript;

      askTeacher(text);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setTeacherState("idle");
      setTeacherReply(
        "I couldn't hear you. Please try again."
      );
    };

    recognition.onend = () => {
      setTeacherState((current) =>
        current === "listening" ? "idle" : current
      );
    };

    recognition.start();
  };

  const progressPercent = Math.min(
    100,
    ((progress.completedLessons?.length || 0) /
      Math.max(lessons.length, 1)) *
      100
  );

  const status =
    teacherState === "listening"
      ? "LISTENING..."
      : teacherState === "thinking"
      ? "THINKING..."
      : teacherState === "speaking"
      ? "SPEAKING..."
      : "READY TO TALK";

  return (
    <main className="homePage">
      <section className="homeIntro">
        <h1>Let's improve your English.</h1>
        <p>
          Practice naturally with your personal AI English
          Teacher.
        </p>
      </section>

      <section className={`teacher ${teacherState}`}>
        <div className="teacherGlow" />

        <button
          className="teacherOrb"
          onClick={startConversation}
          aria-label="Talk to English Teacher"
        >
          <div className="teacherWave">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </button>

        <div className="teacherStatus">
          {status}
        </div>

        {transcript && (
          <div className="conversationLine userLine">
            <span>You</span>
            {transcript}
          </div>
        )}

        {teacherReply && (
          <div className="conversationLine teacherLine">
            <span>Teacher</span>
            {teacherReply}

            {followUp && (
              <div style={{ marginTop: "10px" }}>
                {followUp}
              </div>
            )}
          </div>
        )}

        {correction && (
          <div className="conversationLine">
            <span style={{ color: "var(--blue)" }}>
              Correction
            </span>

            <div>{correction}</div>

            {explanation && (
              <div
                dir="rtl"
                style={{
                  marginTop: "7px",
                  color: "var(--muted)",
                }}
              >
                {explanation}
              </div>
            )}
          </div>
        )}

        <button
          className="teacherButton"
          onClick={startConversation}
          disabled={
            teacherState === "listening" ||
            teacherState === "thinking" ||
            teacherState === "speaking"
          }
        >
          {teacherState === "listening"
            ? "LISTENING..."
            : teacherState === "thinking"
            ? "THINKING..."
            : teacherState === "speaking"
            ? "SPEAKING..."
            : "TALK TO ME"}
        </button>
      </section>

      <div className="homeDivider" />

      <section className="quickPractice">
        <h2>Your progress</h2>
        <p>
          Keep going. Small daily practice makes a big
          difference.
        </p>

        <div className="progressLine">
          <span
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>

        <div className="progressMeta">
          <span>
            {progress.completedLessons?.length || 0} /{" "}
            {lessons.length} lessons
          </span>

          <span>{Math.round(progressPercent)}%</span>
        </div>
      </section>

      <section className="homeLinks">
        <button onClick={() => setPage("speaking")}>
          <span>Speaking</span>
          <span>→</span>
        </button>

        <button onClick={() => setPage("listening")}>
          <span>Listening</span>
          <span>→</span>
        </button>

        <button onClick={() => setPage("words")}>
          <span>Vocabulary</span>
          <span>→</span>
        </button>
      </section>
    </main>
  );
}

function Lessons({ progress, addXp, updateProgress }) {
  const [level, setLevel] = useState("ALL");

  const levels = [
    "ALL",
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
    "C2",
  ];

  const filtered =
    level === "ALL"
      ? lessons
      : lessons.filter((lesson) => lesson.level === level);

  const completeLesson = (id) => {
    if (progress.completedLessons?.includes(id)) return;

    updateProgress({
      completedLessons: [
        ...(progress.completedLessons || []),
        id,
      ],
    });

    addXp(20);
  };

  return (
    <main className="page">
      <PageTitle
        title="Lessons"
        subtitle="Build your English step by step."
      />

      <div className="filters">
        {levels.map((item) => (
          <button
            key={item}
            className={level === item ? "active" : ""}
            onClick={() => setLevel(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="lessons">
        {filtered.map((lesson) => {
          const completed =
            progress.completedLessons?.includes(
              lesson.id
            );

          return (
            <article className="lessonCard" key={lesson.id}>
              <div>
                <span className="tag">
                  {lesson.level}
                </span>

                <h3>{lesson.title}</h3>
                <p>{lesson.desc}</p>

                <p>
                  <strong>Grammar:</strong>{" "}
                  {lesson.grammar}
                </p>

                <p>
                  <strong>Words:</strong>{" "}
                  {lesson.words.join(", ")}
                </p>
              </div>

              <button
                className="primary"
                onClick={() => completeLesson(lesson.id)}
              >
                {completed ? "COMPLETED" : "COMPLETE"}
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}

function Vocabulary({
  progress,
  addXp,
  updateProgress,
}) {
  const markLearned = (word) => {
    if (progress.learnedWords?.includes(word)) return;

    updateProgress({
      learnedWords: [
        ...(progress.learnedWords || []),
        word,
      ],
    });

    addXp(5);
  };

  return (
    <main className="page">
      <PageTitle
        title="Vocabulary"
        subtitle="Useful words with real examples."
      />

      <section className="vocabulary">
        {vocabulary.map(
          ([word, meaning, example, level]) => (
            <article className="word" key={word}>
              <strong>{word}</strong>

              <div>
                <p>{meaning}</p>
                <p>
                  <em>{example}</em>
                </p>

                <button
                  className="primary"
                  onClick={() => markLearned(word)}
                >
                  {progress.learnedWords?.includes(word)
                    ? "LEARNED"
                    : "MARK LEARNED"}
                </button>
              </div>

              <span className="level">{level}</span>
            </article>
          )
        )}
      </section>
    </main>
  );
}

function Grammar({
  progress,
  addXp,
  updateProgress,
}) {
  const [selected, setSelected] = useState(0);
  const [answer, setAnswer] = useState(null);

  const item = grammar[selected];

  const chooseAnswer = (option) => {
    setAnswer(option);

    if (
      option === item.answer &&
      !progress.grammarDone?.includes(selected)
    ) {
      updateProgress({
        grammarDone: [
          ...(progress.grammarDone || []),
          selected,
        ],
      });

      addXp(10);
    }
  };

  return (
    <main className="page">
      <PageTitle
        title="Grammar"
        subtitle="Understand the patterns behind English."
      />

      <div className="filters">
        {grammar.map((item, index) => (
          <button
            key={item.title}
            className={
              selected === index ? "active" : ""
            }
            onClick={() => {
              setSelected(index);
              setAnswer(null);
            }}
          >
            {item.level}
          </button>
        ))}
      </div>

      <section className="card">
        <span className="tag">{item.level}</span>

        <h2>{item.title}</h2>

        <p>{item.rule}</p>

        <div className="actionCard">
          <strong>{item.example}</strong>
        </div>

        <div style={{ marginTop: "28px" }}>
          <h3>{item.question}</h3>

          <div className="options">
            {item.options.map((option) => (
              <button
                key={option}
                className={
                  answer === option
                    ? option === item.answer
                      ? "correct"
                      : "wrong"
                    : ""
                }
                onClick={() => chooseAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {answer && (
          <p
            style={{
              color:
                answer === item.answer
                  ? "var(--success)"
                  : "var(--danger)",
              fontWeight: 700,
              marginTop: "18px",
            }}
          >
            {answer === item.answer
              ? "Correct!"
              : `The correct answer is "${item.answer}".`}
          </p>
        )}
      </section>
    </main>
  );
}

function Reading({
  progress,
  addXp,
  updateProgress,
}) {
  const [selected, setSelected] = useState(0);
  const [answer, setAnswer] = useState(null);

  const item = readings[selected];

  const chooseAnswer = (option) => {
    setAnswer(option);

    if (
      option === item.answer &&
      !progress.readingDone?.includes(selected)
    ) {
      updateProgress({
        readingDone: [
          ...(progress.readingDone || []),
          selected,
        ],
      });

      addXp(10);
    }
  };

  return (
    <main className="page">
      <PageTitle
        title="Reading"
        subtitle="Improve comprehension and vocabulary."
      />

      <div className="filters">
        {readings.map((item, index) => (
          <button
            key={item.title}
            className={
              selected === index ? "active" : ""
            }
            onClick={() => {
              setSelected(index);
              setAnswer(null);
            }}
          >
            {item.level}
          </button>
        ))}
      </div>

      <article className="reading">
        <span className="tag">{item.level}</span>

        <h3>{item.title}</h3>

        <p className="readingText">
          {item.text}
        </p>

        <h3>{item.question}</h3>

        <div className="options">
          {item.options.map((option) => (
            <button
              key={option}
              className={
                answer === option
                  ? option === item.answer
                    ? "correct"
                    : "wrong"
                  : ""
              }
              onClick={() => chooseAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {answer && (
          <p
            style={{
              color:
                answer === item.answer
                  ? "var(--success)"
                  : "var(--danger)",
              fontWeight: 700,
              marginTop: "18px",
            }}
          >
            {answer === item.answer
              ? "Correct!"
              : `The correct answer is "${item.answer}".`}
          </p>
        )}
      </article>
    </main>
  );
}

function Listening({
  progress,
  addXp,
  updateProgress,
}) {
  const [selected, setSelected] = useState(0);
  const [answer, setAnswer] = useState(null);

  const item = listening[selected];

  const playAudio = () => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(item.text);

    utterance.lang = "en-US";
    utterance.rate = 0.85;

    window.speechSynthesis.speak(utterance);
  };

  const chooseAnswer = (option) => {
    setAnswer(option);

    if (
      option === item.answer &&
      !progress.listeningDone?.includes(selected)
    ) {
      updateProgress({
        listeningDone: [
          ...(progress.listeningDone || []),
          selected,
        ],
      });

      addXp(10);
    }
  };

  return (
    <main className="page">
      <PageTitle
        title="Listening"
        subtitle="Train your ear with spoken English."
      />

      <div className="filters">
        {listening.map((item, index) => (
          <button
            key={item.title}
            className={
              selected === index ? "active" : ""
            }
            onClick={() => {
              setSelected(index);
              setAnswer(null);
            }}
          >
            {item.level}
          </button>
        ))}
      </div>

      <article className="reading">
        <span className="tag">{item.level}</span>

        <h3>{item.title}</h3>

        <button
          className="primary"
          onClick={playAudio}
          style={{ marginTop: "18px" }}
        >
          ▶ LISTEN
        </button>

        <p className="listeningText">
          Listen carefully, then answer the question.
        </p>

        <h3>{item.question}</h3>

        <div className="options">
          {item.options.map((option) => (
            <button
              key={option}
              className={
                answer === option
                  ? option === item.answer
                    ? "correct"
                    : "wrong"
                  : ""
              }
              onClick={() => chooseAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {answer && (
          <p
            style={{
              color:
                answer === item.answer
                  ? "var(--success)"
                  : "var(--danger)",
              fontWeight: 700,
              marginTop: "18px",
            }}
          >
            {answer === item.answer
              ? "Correct!"
              : `The correct answer is "${item.answer}".`}
          </p>
        )}
      </article>
    </main>
  );
}

function Speaking({
  progress,
  addXp,
  updateProgress,
}) {
  const [state, setState] = useState("idle");
  const [text, setText] = useState("");

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setText(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    setState("recording");
    setText("");

    recognition.onresult = (event) => {
      const result =
        event.results[0][0].transcript;

      setText(result);
      setState("idle");

      updateProgress({
        speakingSessions:
          (progress.speakingSessions || 0) + 1,
      });

      addXp(10);
    };

    recognition.onerror = () => {
      setState("idle");
      setText("Please try again.");
    };

    recognition.onend = () => {
      setState((current) =>
        current === "recording" ? "idle" : current
      );
    };

    recognition.start();
  };

  return (
    <main className="page">
      <PageTitle
        title="Speaking"
        subtitle="Practice speaking English out loud."
      />

      <article className="speaking">
        <h3>Tell me about your day.</h3>

        <p>
          Speak naturally. Focus on communicating your
          ideas rather than being perfect.
        </p>

        <button
          className={`recordButton ${
            state === "recording" ? "recording" : ""
          }`}
          onClick={startRecording}
        >
          {state === "recording" ? "●" : "MIC"}
        </button>

        {text && (
          <p>
            <strong>You said:</strong> {text}
          </p>
        )}
      </article>
    </main>
  );
}

function Writing({
  progress,
  addXp,
  updateProgress,
}) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!text.trim()) return;

    setSubmitted(true);

    updateProgress({
      writingSessions:
        (progress.writingSessions || 0) + 1,
    });

    addXp(10);
  };

  return (
    <main className="page">
      <PageTitle
        title="Writing"
        subtitle="Express your ideas in English."
      />

      <article className="writing">
        <h3>Write about your day.</h3>

        <p>
          Try to write at least three sentences in
          English.
        </p>

        <textarea
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setSubmitted(false);
          }}
          placeholder="Write in English..."
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "14px",
            gap: "12px",
          }}
        >
          <span
            style={{
              color: "var(--muted)",
              fontSize: "12px",
            }}
          >
            {text.length} characters
          </span>

          <button
            className="primary"
            onClick={submit}
          >
            SUBMIT
          </button>
        </div>

        {submitted && (
          <p
            style={{
              color: "var(--success)",
              fontWeight: 700,
            }}
          >
            Your writing has been recorded. Keep
            practicing!
          </p>
        )}
      </article>
    </main>
  );
}

function BottomNav({ page, setPage }) {
  const items = [
    ["home", "Home", "⌂"],
    ["lessons", "Lessons", "▤"],
    ["words", "Words", "Aa"],
    ["grammar", "Grammar", "✓"],
    ["speaking", "Speak", "◉"],
  ];

  return (
    <nav className="bottomNav">
      <div className="bottomNavInner">
        {items.map(([id, label, icon]) => (
          <button
            key={id}
            className={page === id ? "active" : ""}
            onClick={() => setPage(id)}
          >
            <div
              style={{
                fontSize: "16px",
                marginBottom: "3px",
              }}
            >
              {icon}
            </div>
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}