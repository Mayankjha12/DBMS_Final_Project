import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const API = "https://dbms-final-project-q07u.onrender.com";

function CircleDetail() {
  const { id } = useParams();

  const [circle, setCircle] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [resources, setResources] = useState([]);
  const [text, setText] = useState("");

  const { user } = useUser();

  // 🔥 DUMMY DATA
  const dummyCircle = {
    title: "React Learning Circle",
    description: "Group of students learning React together 🚀"
  };

  const dummyTasks = [
    { id: 1, title: "Learn Hooks", description: "useState & useEffect" },
    { id: 2, title: "Build UI", description: "Create dashboard page" }
  ];

  const dummyMessages = [
    {
      id: 1,
      text: "Bhai React samajh aa gaya 🔥",
      clerk_id: "1",
      timestamp: new Date()
    },
    {
      id: 2,
      text: "Kal task complete karte hain",
      clerk_id: "2",
      timestamp: new Date()
    }
  ];

  const dummyResources = [
    { id: 1, title: "React Docs", content: "https://react.dev" },
    { id: 2, title: "Tailwind Docs", content: "https://tailwindcss.com" }
  ];

  // 🔥 LOAD DATA
  useEffect(() => {
    fetch(`${API}/api/circles/${id}`)
      .then(res => res.json())
      .then(data => setCircle(data?.title ? data : dummyCircle))
      .catch(() => setCircle(dummyCircle));
  }, [id]);

  useEffect(() => {
    fetch(`${API}/api/circles/${id}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data?.length ? data : dummyTasks))
      .catch(() => setTasks(dummyTasks));
  }, [id]);

  useEffect(() => {
    fetch(`${API}/api/circles/${id}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data?.length ? data : dummyMessages))
      .catch(() => setMessages(dummyMessages));
  }, [id]);

  useEffect(() => {
    fetch(`${API}/api/circles/${id}/resources`)
      .then(res => res.json())
      .then(data => setResources(data?.length ? data : dummyResources))
      .catch(() => setResources(dummyResources));
  }, [id]);

  // 🔥 JOIN
  const joinCircle = async () => {
    if (!user) return alert("Login required");

    await fetch(`${API}/api/circles/${id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerk_id: user.id })
    });

    alert("Joined successfully!");
  };

  // 🔥 COMPLETE TASK
  const completeTask = async (taskId) => {
    if (!user) return alert("Login required");

    await fetch(`${API}/api/tasks/${taskId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerk_id: user.id })
    });

    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, completed: true } : t
      )
    );
  };

  // 🔥 SEND MESSAGE (instant UI update + timestamp)
  const sendMessage = async () => {
    if (!user) return alert("Login required");
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now(),
      text,
      clerk_id: user.id,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMsg]); // instant show

    await fetch(`${API}/api/circles/${id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        clerk_id: user.id,
        timestamp: new Date().toISOString()
      })
    });

    setText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          {circle?.title || "Loading..."}
        </h1>
        <p className="text-gray-600 mt-2">
          {circle?.description}
        </p>

        <button
          onClick={joinCircle}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl shadow"
        >
          Join Circle
        </button>
      </div>

      {/* RESOURCES */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Resources</h2>

        {resources.map(r => (
          <div
            key={r.id}
            className="border p-3 rounded-lg mb-2 hover:shadow"
          >
            <p className="font-semibold">{r.title}</p>
            <a
              href={r.content}
              target="_blank"
              className="text-blue-500 text-sm"
            >
              {r.content}
            </a>
          </div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* TASKS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>

          {tasks.map(t => (
            <div
              key={t.id}
              className="border p-3 rounded-lg mb-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{t.title}</p>
                <p className="text-sm text-gray-500">
                  {t.description}
                </p>
              </div>

              <button
                onClick={() => completeTask(t.id)}
                className={`px-3 py-1 text-sm rounded-lg ${
                  t.completed
                    ? "bg-gray-300"
                    : "bg-green-500 text-white"
                }`}
              >
                {t.completed ? "Done" : "Complete"}
              </button>
            </div>
          ))}
        </div>

        {/* CHAT */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Chat</h2>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 max-h-[350px] pr-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-xl max-w-[75%] ${
                  user && m.clerk_id === user.id
                    ? "bg-purple-500 text-white ml-auto"
                    : "bg-gray-200"
                }`}
              >
                <p>{m.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(m.timestamp || Date.now()).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message..."
              className="flex-1 border p-2 rounded-lg"
            />

            <button
              onClick={sendMessage}
              className="bg-purple-600 text-white px-4 rounded-lg hover:bg-purple-700"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CircleDetail;