import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RoundResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Data passed via navigate
  const { results = [], winner } = location.state || {};

  if (!results.length) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-bold">No round results available.</h2>
        <button
          onClick={() => navigate("/canvas")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Canvas
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Round Results</h1>
      <h2 className="text-xl font-semibold mb-4">Winner: {winner}</h2>

      {results.map((r) => (
        <div key={r.playerId} className="mb-6 p-4 border rounded bg-gray-100">
          <h3 className="font-bold text-lg">
            Player: {r.playerId} {r.playerId === winner && "(Winner!)"}
          </h3>
          <p>Top Prediction: {r.topPrediction} ({(r.topConfidence*100).toFixed(2)}%)</p>
          <h4 className="font-semibold mt-2">Top 10 Predictions:</h4>
          <ol className="list-decimal ml-5">
            {r.top10.map((p, i) => (
              <li key={i}>
                {p.label}: {(p.confidence*100).toFixed(2)}%
              </li>
            ))}
          </ol>
        </div>
      ))}

      <button
        onClick={() => navigate("/canvas")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Back to Canvas
      </button>
    </div>
  );
};

export default RoundResultPage;
