import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { TEAMS } from '../data/teams';

const TeamCredentials = () => {
  const [teamStatuses, setTeamStatuses] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, attended, not-attended, allotted
  const [useFirebase, setUseFirebase] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    setUseFirebase(!!db);
    loadTeamStatuses();
    
    // Refresh every 5 seconds to check for new logins
    const interval = setInterval(loadTeamStatuses, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTeamStatuses = async () => {
    const statuses = {};
    
    // First, initialize all teams as not logged in and not attended
    TEAMS.forEach(team => {
      statuses[team.teamName] = {
        attended: false,
        allotted: false,
        lastLogin: null
      };
    });
    
    if (!useFirebase) {
      // Load from localStorage
      TEAMS.forEach(team => {
        const teamId = team.teamName.toLowerCase().replace(/\s+/g, '_');
        const attended = localStorage.getItem(`team_attended_${teamId}`);
        const teamData = localStorage.getItem(`teamData_${teamId}`);
        
        statuses[team.teamName] = {
          attended: attended === 'yes',
          allotted: !!teamData, // True if team has logged in
          lastLogin: teamData ? JSON.parse(teamData).lastUpdated : null
        };
      });
    } else {
      // Load from Firebase
      try {
        const teamsRef = collection(db, 'teams');
        const querySnapshot = await getDocs(teamsRef);
        
        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          // Find the team in our pre-defined list
          const teamExists = TEAMS.find(t => t.teamName === data.teamName);
          if (teamExists) {
            statuses[data.teamName] = {
              attended: data.attended || false,
              allotted: true, // If exists in Firebase, they've logged in
              lastLogin: data.lastUpdated || data.createdAt
            };
          }
        });

        // Check attendance markers
        const attendanceRef = collection(db, 'attendance');
        const attendanceSnapshot = await getDocs(attendanceRef);
        attendanceSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (statuses[data.teamName]) {
            statuses[data.teamName].attended = data.attended;
          } else {
            // Initialize if not already in statuses
            const teamExists = TEAMS.find(t => t.teamName === data.teamName);
            if (teamExists) {
              statuses[data.teamName] = {
                attended: data.attended,
                allotted: statuses[data.teamName]?.allotted || false,
                lastLogin: null
              };
            }
          }
        });
      } catch (error) {
        console.error('Error loading team statuses:', error);
      }
    }

    setTeamStatuses(statuses);
    setLastRefresh(new Date());
  };

  const handleAttendance = async (teamName, attended) => {
    const teamId = teamName.toLowerCase().replace(/\s+/g, '_');

    try {
      if (useFirebase) {
        await setDoc(doc(db, 'attendance', teamId), {
          teamName,
          attended,
          markedAt: new Date().toISOString()
        });
      } else {
        localStorage.setItem(`team_attended_${teamId}`, attended ? 'yes' : 'no');
      }

      setTeamStatuses(prev => ({
        ...prev,
        [teamName]: {
          ...prev[teamName],
          attended
        }
      }));

      alert(`✅ ${teamName} marked as ${attended ? 'Present' : 'Absent'}`);
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('❌ Failed to update attendance');
    }
  };

  const filteredTeams = TEAMS.filter(team => {
    const matchesSearch = team.teamName.toLowerCase().includes(searchTerm.toLowerCase());
    const status = teamStatuses[team.teamName];
    
    if (filterStatus === 'attended') return matchesSearch && status?.attended;
    if (filterStatus === 'not-attended') return matchesSearch && !status?.attended;
    if (filterStatus === 'allotted') return matchesSearch && status?.allotted;
    
    return matchesSearch;
  });

  const stats = {
    total: TEAMS.length,
    attended: Object.values(teamStatuses).filter(s => s?.attended).length,
    allotted: Object.values(teamStatuses).filter(s => s?.allotted).length,
    notAttended: TEAMS.length - Object.values(teamStatuses).filter(s => s?.attended).length
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">👥 Team Credentials & Attendance</h2>
        <div className="text-right">
          <button
            onClick={loadTeamStatuses}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700 transition-colors mb-1"
          >
            🔄 Refresh Now
          </button>
          <p className="text-gray-400 text-xs">Auto-refresh: 5s</p>
          <p className="text-gray-300 text-xs">Updated: {lastRefresh.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-blue-500/20 rounded-lg p-3 text-center">
          <p className="text-blue-200 text-xs sm:text-sm">Total Teams</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-green-500/20 rounded-lg p-3 text-center">
          <p className="text-green-200 text-xs sm:text-sm">Present</p>
          <p className="text-2xl font-bold text-white">{stats.attended}</p>
        </div>
        <div className="bg-purple-500/20 rounded-lg p-3 text-center">
          <p className="text-purple-200 text-xs sm:text-sm">Logged In</p>
          <p className="text-2xl font-bold text-white">{stats.allotted}</p>
        </div>
        <div className="bg-red-500/20 rounded-lg p-3 text-center">
          <p className="text-red-200 text-xs sm:text-sm">Absent</p>
          <p className="text-2xl font-bold text-white">{stats.notAttended}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Teams</option>
          <option value="attended">Present Only</option>
          <option value="not-attended">Absent Only</option>
          <option value="allotted">Logged In Only</option>
        </select>
      </div>

      {/* Teams Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/10 border-b border-white/20">
              <th className="px-3 py-3 text-white font-semibold text-xs sm:text-sm">#</th>
              <th className="px-3 py-3 text-white font-semibold text-xs sm:text-sm">Team Name</th>
              <th className="px-3 py-3 text-white font-semibold text-xs sm:text-sm">Password</th>
              <th className="px-3 py-3 text-white font-semibold text-xs sm:text-sm">Status</th>
              <th className="px-3 py-3 text-white font-semibold text-xs sm:text-sm">Attendance</th>
              <th className="px-3 py-3 text-white font-semibold text-xs sm:text-sm">Mark</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.map((team, index) => {
              const status = teamStatuses[team.teamName] || { attended: false, allotted: false };
              const originalIndex = TEAMS.findIndex(t => t.teamName === team.teamName);
              
              return (
                <tr 
                  key={team.teamName} 
                  className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                    status.attended ? 'bg-green-500/10' : ''
                  }`}
                >
                  <td className="px-3 py-3 text-gray-300 text-xs sm:text-sm">{originalIndex + 1}</td>
                  <td className="px-3 py-3 text-white font-medium text-xs sm:text-sm">{team.teamName}</td>
                  <td className="px-3 py-3 text-gray-300 text-xs sm:text-sm font-mono">{team.password}</td>
                  <td className="px-3 py-3">
                    {status.allotted ? (
                      <span className="inline-block bg-purple-500 text-white text-xs px-2 py-1 rounded">
                        ✓ Logged In
                      </span>
                    ) : (
                      <span className="inline-block bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">
                        Not Logged In
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {status.attended ? (
                      <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded">
                        ✅ Present
                      </span>
                    ) : (
                      <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded">
                        ❌ Absent
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAttendance(team.teamName, true)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          status.attended
                            ? 'bg-green-600 text-white'
                            : 'bg-white/20 text-gray-300 hover:bg-green-600 hover:text-white'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleAttendance(team.teamName, false)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          !status.attended && teamStatuses[team.teamName]
                            ? 'bg-red-600 text-white'
                            : 'bg-white/20 text-gray-300 hover:bg-red-600 hover:text-white'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No teams match your search criteria</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <h4 className="text-white font-medium mb-2 text-sm">📋 Legend:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-purple-500 text-white px-2 py-1 rounded">✓ Logged In</span>
            <span className="text-gray-300">Team has accessed the portal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded">✅ Present</span>
            <span className="text-gray-300">Team marked as present</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded">Not Logged In</span>
            <span className="text-gray-300">Team hasn't logged in yet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-500 text-white px-2 py-1 rounded">❌ Absent</span>
            <span className="text-gray-300">Team marked as absent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCredentials;
