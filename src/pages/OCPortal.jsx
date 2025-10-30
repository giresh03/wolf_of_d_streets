import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { TEAMS } from "../data/teams";
import TeamCredentials from "../components/TeamCredentials";

const OCPortal = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState(300);
  const [reason, setReason] = useState("");
  const [useFirebase, setUseFirebase] = useState(false);
  const [teamStatuses, setTeamStatuses] = useState({});
  const [activeTab, setActiveTab] = useState("attendance"); // attendance, credentials, money
  const [teamIdSearch, setTeamIdSearch] = useState("");
  const [checkInTeam, setCheckInTeam] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("ocAuthenticated");
    if (!isAuthenticated) {
      navigate("/oc");
      return;
    }

    setUseFirebase(!!db);
    loadTeams();

    // Refresh data every 2 seconds for real-time updates
    const interval = setInterval(loadTeams, 2000);
    return () => clearInterval(interval);
  }, [navigate]);

  const loadTeams = async () => {
    if (db) {
      try {
        const teamsRef = collection(db, "teams");
        const querySnapshot = await getDocs(teamsRef);

        const loadedTeams = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort teams by name
        const sorted = loadedTeams.sort((a, b) =>
          a.teamName?.localeCompare(b.teamName || "")
        );

        setTeams(sorted);

        // Update team statuses
        const statuses = {};
        querySnapshot.docs.forEach((doc) => {
          const data = doc.data();
          statuses[data.teamName] = {
            attended: data.attended || false,
            allotted: true,
          };
        });

        // Check attendance collection
        const attendanceRef = collection(db, "attendance");
        const attendanceSnapshot = await getDocs(attendanceRef);
        attendanceSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (statuses[data.teamName]) {
            statuses[data.teamName].attended = data.attended;
          }
        });

        setTeamStatuses(statuses);
      } catch (error) {
        console.error("Error loading teams:", error);
      }
    } else {
      // Load from localStorage
      const allTeams = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("teamData_")) {
          const teamId = key.replace("teamData_", "");
          const teamData = JSON.parse(localStorage.getItem(key) || "{}");

          allTeams.push({
            id: teamId,
            ...teamData,
          });
        }
      }

      const sorted = allTeams.sort((a, b) =>
        a.teamName?.localeCompare(b.teamName || "")
      );

      setTeams(sorted);
    }
  };

  const findTeamFromSheet = (teamId) =>
    TEAMS.find((t) => t.teamId.toUpperCase() === teamId.toUpperCase());

  const ensureTeamDoc = async (teamId, teamName) => {
    if (!db) return;
    const teamRef = doc(db, 'teams', teamId.toLowerCase());
    const snap = await getDoc(teamRef);
    if (!snap.exists()) {
      await setDoc(teamRef, {
        teamName,
        initialCapital: 10000,
        currentCapital: 10000,
        stock1Shares: 0,
        stock2Shares: 0,
        portfolioValue: 10000,
        totalTransactions: 0,
        attended: false,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      });
    }
  };

  const handleTeamIdSearch = async () => {
    const id = teamIdSearch.trim();
    if (!id) {
      setCheckInTeam(null);
      return;
    }
    const sheetTeam = findTeamFromSheet(id);
    if (!sheetTeam) {
      setCheckInTeam({ notFound: true, teamId: id });
      return;
    }
    try {
      await ensureTeamDoc(sheetTeam.teamId, sheetTeam.teamName);
    } catch (e) {
      console.error('ensureTeamDoc error:', e);
    }
    setCheckInTeam(sheetTeam);
  };

  const handleMarkPresent = async () => {
    if (!checkInTeam) return;
    setIsCheckingIn(true);
    try {
      const id = checkInTeam.teamId.toLowerCase();
      if (db) {
        await setDoc(doc(db, 'attendance', id), {
          teamId: checkInTeam.teamId,
          teamName: checkInTeam.teamName,
          attended: true,
          timestamp: new Date().toISOString(),
        });
        const teamRef = doc(db, 'teams', id);
        await setDoc(teamRef, { attended: true, lastUpdated: new Date().toISOString() }, { merge: true });
      } else {
        localStorage.setItem(
          `attendance_${checkInTeam.teamId}`,
          JSON.stringify({ attended: true, timestamp: new Date().toISOString() })
        );
        const key = `teamData_${checkInTeam.teamId.toLowerCase()}`;
        const existing = JSON.parse(localStorage.getItem(key) || '{}');
        localStorage.setItem(
          key,
          JSON.stringify({
            teamName: checkInTeam.teamName,
            initialCapital: existing.initialCapital || 10000,
            currentCapital: existing.currentCapital || 10000,
            stock1Shares: 0,
            stock2Shares: 0,
            attended: true,
            lastUpdated: new Date().toISOString(),
          })
        );
      }
      alert(`✅ Marked present: ${checkInTeam.teamId} - ${checkInTeam.teamName}`);
      setTeamIdSearch('');
      setCheckInTeam(null);
      loadTeams();
    } catch (e) {
      console.error('Mark present failed:', e);
      alert('❌ Failed to mark attendance.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleAddMoney = async () => {
    if (!selectedTeam) {
      alert("⚠️ Please select a team first");
      return;
    }

    if (!amount || amount === 0) {
      alert("⚠️ Please enter a valid amount");
      return;
    }

    const confirmMessage =
      amount > 0
        ? `Add ₹${amount} to ${selectedTeam.teamName}?`
        : `Deduct ₹${Math.abs(amount)} from ${selectedTeam.teamName}?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const newCapital = (selectedTeam.currentCapital || 0) + amount;

      if (newCapital < 0) {
        alert("❌ Cannot deduct more than current capital!");
        return;
      }

      if (useFirebase) {
        const teamRef = doc(db, "teams", selectedTeam.id);
        await updateDoc(teamRef, {
          currentCapital: newCapital,
          lastUpdated: new Date().toISOString(),
        });

        // Log the transaction (use setDoc for new documents)
        const transactionId = `${selectedTeam.id}_${Date.now()}`;
        await setDoc(doc(db, "oc_transactions", transactionId), {
          teamId: selectedTeam.id,
          teamName: selectedTeam.teamName,
          amount: amount,
          reason:
            reason ||
            (amount > 0
              ? "Correct fake news identification"
              : "Incorrect fake news identification"),
          previousCapital: selectedTeam.currentCapital,
          newCapital: newCapital,
          timestamp: new Date().toISOString(),
          by: "OC",
        });
      } else {
        // Update in localStorage
        const teamData = JSON.parse(
          localStorage.getItem(`teamData_${selectedTeam.id}`) || "{}"
        );
        teamData.currentCapital = newCapital;
        teamData.lastUpdated = new Date().toISOString();
        localStorage.setItem(
          `teamData_${selectedTeam.id}`,
          JSON.stringify(teamData)
        );
      }

      alert(
        `✅ Successfully ${amount > 0 ? "added" : "deducted"} ₹${Math.abs(
          amount
        )} ${amount > 0 ? "to" : "from"} ${selectedTeam.teamName}`
      );

      // Reset form
      setAmount(300);
      setReason("");
      setSelectedTeam(null);

      // Reload teams
      loadTeams();
    } catch (error) {
      console.error("Error updating capital:", error);
      alert("❌ Failed to update capital. Please try again.");
    }
  };

  const handleDeductMoney = async () => {
    if (!selectedTeam) {
      alert("⚠️ Please select a team first");
      return;
    }

    const deductAmount = Math.abs(amount);

    if (!deductAmount || deductAmount === 0) {
      alert("⚠️ Please enter a valid amount");
      return;
    }

    if (
      !window.confirm(`Deduct ₹${deductAmount} from ${selectedTeam.teamName}?`)
    ) {
      return;
    }

    try {
      const newCapital = (selectedTeam.currentCapital || 0) - deductAmount;

      if (newCapital < 0) {
        alert("❌ Cannot deduct more than current capital!");
        return;
      }

      if (useFirebase) {
        const teamRef = doc(db, "teams", selectedTeam.id);
        await updateDoc(teamRef, {
          currentCapital: newCapital,
          lastUpdated: new Date().toISOString(),
        });
      } else {
        // Update in localStorage
        const teamData = JSON.parse(
          localStorage.getItem(`teamData_${selectedTeam.id}`) || "{}"
        );
        teamData.currentCapital = newCapital;
        teamData.lastUpdated = new Date().toISOString();
        localStorage.setItem(
          `teamData_${selectedTeam.id}`,
          JSON.stringify(teamData)
        );
      }

      alert(
        `✅ Successfully deducted ₹${deductAmount} from ${selectedTeam.teamName}`
      );

      // Reset form
      setAmount(300);
      setReason("");
      setSelectedTeam(null);

      // Reload teams
      loadTeams();
    } catch (error) {
      console.error("Error updating capital:", error);
      alert("❌ Failed to update capital. Please try again.");
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.teamName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("ocAuthenticated");
    navigate("/oc");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              🎯 OC Portal
            </h1>
            <p className="text-green-200 text-sm sm:text-base">
              Organizing Committee Dashboard
            </p>
            {!useFirebase && (
              <p className="text-yellow-400 text-xs sm:text-sm mt-2">
                ⚠️ Running in demo mode (local storage)
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
              activeTab === 'attendance'
                ? 'bg-green-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            🟢 Quick Check-In
          </button>
          <button
            onClick={() => setActiveTab("credentials")}
            className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
              activeTab === "credentials"
                ? "bg-green-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            👥 Credentials & Attendance
          </button>
          <button
            onClick={() => setActiveTab("money")}
            className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
              activeTab === "money"
                ? "bg-green-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            💰 Manage Money
          </button>
        </div>

        {/* Attendance Quick Check-In */}
        {activeTab === 'attendance' && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">🪪 Team ID Check-In</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-white mb-2 font-medium text-sm sm:text-base">Enter / Scan Team ID</label>
                <input
                  type="text"
                  value={teamIdSearch}
                  onChange={(e) => setTeamIdSearch(e.target.value.toUpperCase())}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleTeamIdSearch(); } }}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base uppercase"
                  placeholder="e.g., 25BVD1010"
                />
              </div>
              <button
                onClick={handleTeamIdSearch}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                🔍 Find Team
              </button>
            </div>

            {checkInTeam && !checkInTeam.notFound && (
              <div className="mt-4 bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <p className="text-gray-300 text-sm">Team ID</p>
                    <p className="text-white text-xl font-bold">{checkInTeam.teamId}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Team Name (members)</p>
                    <p className="text-white text-xl font-bold">{checkInTeam.teamName}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Password</p>
                    <p className="text-green-300 text-xl font-bold select-all">{checkInTeam.password}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleMarkPresent}
                    disabled={isCheckingIn}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-600"
                  >
                    ✅ Mark Present
                  </button>
                  <button
                    onClick={() => { setTeamIdSearch(''); setCheckInTeam(null); }}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700"
                  >
                    ✖ Clear
                  </button>
                </div>
              </div>
            )}

            {checkInTeam?.notFound && (
              <div className="mt-4 bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
                ❌ Team ID not found in sheet: {checkInTeam.teamId}. Please verify.
              </div>
            )}
          </div>
        )}

        {/* Credentials & Attendance Tab */}
        {activeTab === "credentials" && <TeamCredentials />}

        {/* Money Management Tab */}
        {activeTab === "money" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Team List for Money Management */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                👥 Select Team
              </h2>

              {/* Search Bar */}
              <input
                type="text"
                placeholder="🔍 Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 text-sm sm:text-base"
              />

              {/* Teams Table */}
              <div className="overflow-y-auto max-h-[600px]">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white/10 border-b border-white/20">
                    <tr>
                      <th className="px-3 py-3 text-white font-semibold text-xs sm:text-sm">
                        #
                      </th>
                      <th className="px-3 py-3 text-white font-semibold text-xs sm:text-sm">
                        Team Name
                      </th>
                      <th className="px-3 py-3 text-white font-semibold text-xs sm:text-sm">
                        Capital
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeams.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center py-8 text-gray-400"
                        >
                          No teams found
                        </td>
                      </tr>
                    ) : (
                      filteredTeams.map((team, index) => {
                        const isSelected = selectedTeam?.id === team.id;

                        return (
                          <tr
                            key={team.id}
                            onClick={() => setSelectedTeam(team)}
                            className={`border-b border-white/10 cursor-pointer transition-all ${
                              isSelected
                                ? "bg-green-500/30 ring-2 ring-green-500"
                                : "hover:bg-white/5"
                            }`}
                          >
                            <td className="px-3 py-3 text-gray-300 text-xs sm:text-sm">
                              {index + 1}
                            </td>
                            <td className="px-3 py-3 text-white font-medium text-xs sm:text-sm">
                              {team.teamName || "Unnamed Team"}
                              {teamStatuses[team.teamName]?.attended && (
                                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                                  ✓
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-3 text-green-400 font-bold text-xs sm:text-sm">
                              ₹{team.currentCapital?.toFixed(0) || "0"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <p className="text-gray-300 text-xs">
                  <span className="bg-green-500 text-white px-2 py-0.5 rounded mr-2">
                    ✓
                  </span>
                  Present teams
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  📝 Note: Team credentials are available in the "Credentials &
                  Attendance" tab
                </p>
              </div>
            </div>

            {/* Right Panel - Money Management */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                💰 Manage Money
              </h2>

              {selectedTeam ? (
                <div className="space-y-4">
                  {/* Selected Team Info */}
                  <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
                    <h3 className="text-white font-bold text-lg mb-2">
                      Selected Team:
                    </h3>
                    <p className="text-2xl font-bold text-green-300 mb-3">
                      {selectedTeam.teamName}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-gray-300 text-xs mb-1">
                          Current Capital
                        </p>
                        <p className="text-xl font-bold text-green-400">
                          ₹{selectedTeam.currentCapital?.toFixed(2) || "0"}
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-gray-300 text-xs mb-1">
                          Portfolio Value
                        </p>
                        <p className="text-xl font-bold text-blue-400">
                          ₹
                          {(
                            (selectedTeam.currentCapital || 0) +
                            (selectedTeam.stock1Shares || 0) *
                              (selectedTeam.stock1Price || 0) +
                            (selectedTeam.stock2Shares || 0) *
                              (selectedTeam.stock2Price || 0)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-white mb-2 font-medium text-sm">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-bold"
                      placeholder="Enter amount"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setAmount(300)}
                        className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
                      >
                        ₹300
                      </button>
                      <button
                        onClick={() => setAmount(500)}
                        className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
                      >
                        ₹500
                      </button>
                      <button
                        onClick={() => setAmount(1000)}
                        className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
                      >
                        ₹1000
                      </button>
                    </div>
                  </div>

                  {/* Reason Input */}
                  <div>
                    <label className="block text-white mb-2 font-medium text-sm">
                      Reason (Optional)
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Correct fake news identification"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleAddMoney}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all text-lg shadow-lg transform hover:scale-105"
                    >
                      ➕ Add Money
                    </button>
                    <button
                      onClick={handleDeductMoney}
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg font-bold hover:from-red-700 hover:to-red-800 transition-all text-lg shadow-lg transform hover:scale-105"
                    >
                      ➖ Deduct Money
                    </button>
                  </div>

                  {/* Clear Selection */}
                  <button
                    onClick={() => {
                      setSelectedTeam(null);
                      setAmount(300);
                      setReason("");
                    }}
                    className="w-full bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Clear Selection
                  </button>

                  {/* Instructions */}
                  <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mt-4">
                    <h4 className="text-blue-200 font-medium mb-2 text-sm">
                      📋 Round 2 - Fake News Rules:
                    </h4>
                    <ul className="text-blue-200 text-xs space-y-1">
                      <li>• Team leader raises pluck card for news</li>
                      <li>• If REAL news + CORRECT: Add ₹300</li>
                      <li>• If FAKE news + CORRECT: Add ₹300</li>
                      <li>• If REAL news + WRONG: Deduct ₹300</li>
                      <li>• If FAKE news + WRONG: Deduct ₹300</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <p className="text-gray-300 text-lg">
                    Select a team from the left panel
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Click on any team to manage their money
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="text-center mt-6 sm:mt-8 flex justify-center gap-4">
          <a
            href="/"
            className="text-green-300 hover:text-green-200 text-xs sm:text-sm"
          >
            ← Team Login
          </a>
          <a
            href="/admin"
            className="text-green-300 hover:text-green-200 text-xs sm:text-sm"
          >
            Admin Panel →
          </a>
        </div>
      </div>
    </div>
  );
};

export default OCPortal;
