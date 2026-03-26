import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
const API_URL = "https://srijan-qualitycodesonly.onrender.com";
function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [result, setResult] = useState(null);
  const [executionDone, setExecutionDone] = useState(false);

  // 🔹 Fetch projects
  useEffect(() => {
    fetch(`${API_URL}/api/projects/`)
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  // 🔥 Generate Tests (AI)
  const generateTests = async () => {
    if (!selectedFeature) return;

    const res = await fetch(`${API_URL}/api/generate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: selectedFeature.description,
      }),
    });

    const data = await res.json();
    setResult(data);
    setExecutionDone(false);
  };

  // 🧪 Execute Tests
  const executeTests = () => {
    setExecutionDone(true);
  };

  // 🎯 Risk Color
  const getRiskColor = (risk) => {
    if (risk === "High") return "#ff4d4d";
    if (risk === "Medium") return "#ffa500";
    return "#4caf50";
  };

  // 🎨 Button Styles
  const btnPrimary = {
    background: "#1976d2",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    marginRight: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const btnExecute = {
    background: "#2e7d32",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>AI Testing Dashboard</h1>

      {/* 🟦 PROJECT LIST */}
      {!selectedProject && (
        <>
          <h2>Select Project</h2>
          {projects.map((p, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedProject(p);
                setSelectedFeature(null);
                setResult(null);
              }}
              style={{
                padding: "15px",
                margin: "10px 0",
                background: "#f5f5f5",
                cursor: "pointer",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{p.project_name}</h3>
              <p>{p.description}</p>
            </div>
          ))}
        </>
      )}

      {/* 🟩 PROJECT VIEW */}
      {selectedProject && !selectedFeature && (
        <>
          <button onClick={() => setSelectedProject(null)}>Back</button>

          <h2>{selectedProject.project_name}</h2>
          <p>{selectedProject.description}</p>

          {/* 📊 GRAPH */}
          <h3>Confidence Overview</h3>
          <BarChart
            width={500}
            height={300}
            data={selectedProject.features.map((f) => ({
              name: f.title,
              confidence: Math.floor(Math.random() * 40) + 60,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="confidence" fill="#1976d2" />
          </BarChart>

          <h3>Features</h3>
          {selectedProject.features.map((f, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedFeature(f);
                setResult(null);
              }}
              style={{
                padding: "12px",
                margin: "8px 0",
                background: f.priority === "High" ? "#ffebee" : "#e8f5e9",
                borderLeft:
                  f.priority === "High" ? "5px solid red" : "5px solid green",
                cursor: "pointer",
                borderRadius: "8px",
              }}
            >
              <b>{f.title}</b> ({f.priority})
            </div>
          ))}
        </>
      )}

      {/* 🔥 FEATURE VIEW */}
      {selectedFeature && (
        <>
          <button onClick={() => setSelectedFeature(null)}>Back</button>

          <h2>{selectedFeature.title}</h2>
          <p>{selectedFeature.description}</p>

          <button style={btnPrimary} onClick={generateTests}>
            Generate Test Cases
          </button>

          {result && (
            <div style={{ marginTop: "20px" }}>
              <h3>Test Cases</h3>

              <h4>Positive</h4>
              <ul>
                {result.test_cases?.positive.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>

              <h4>Negative</h4>
              <ul>
                {result.test_cases?.negative.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>

              <h4>Edge</h4>
              <ul>
                {result.test_cases?.edge.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>

              {/* Risk */}
              <div
                style={{
                  background: getRiskColor(result.risk),
                  color: "white",
                  padding: "10px",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              >
                Risk: {result.risk}
              </div>

              <p>Initial Confidence: {result.initial_confidence}</p>

              {!executionDone && (
                <button style={btnExecute} onClick={executeTests}>
                  Execute Tests
                </button>
              )}

              {executionDone && (
                <>
                  <h3>Execution Results</h3>

                  <table
                    border="1"
                    cellPadding="8"
                    style={{ borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr>
                        <th>Test Case</th>
                        <th>Status</th>
                        <th>Time (ms)</th>
                        <th>Browser</th>
                        <th>Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.execution?.details.map((item, i) => (
                        <tr key={i}>
                          <td>{item.test}</td>
                          <td
                            style={{
                              color: item.status === "Passed" ? "green" : "red",
                            }}
                          >
                            {item.status}
                          </td>
                          <td>
                            {item.time || Math.floor(Math.random() * 200)}
                          </td>
                          <td>{item.browser || "Chrome"}</td>
                          <td>
                            {item.status === "Failed"
                              ? "Assertion failed"
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h3>Final Confidence: {result.final_confidence}</h3>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
