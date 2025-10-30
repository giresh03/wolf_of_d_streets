// Pre-defined teams for Wolf of D Street event
// These are the only teams that can login to the system

export const TEAMS = [
  { teamName: "Team Alpha", password: "wolf2024alpha" },
  { teamName: "Team Beta", password: "wolf2024beta" },
  { teamName: "Team Gamma", password: "wolf2024gamma" },
  { teamName: "Team Delta", password: "wolf2024delta" },
  { teamName: "Team Epsilon", password: "wolf2024epsilon" },
  { teamName: "Team Zeta", password: "wolf2024zeta" },
  { teamName: "Team Eta", password: "wolf2024eta" },
  { teamName: "Team Theta", password: "wolf2024theta" },
  { teamName: "Team Iota", password: "wolf2024iota" },
  { teamName: "Team Kappa", password: "wolf2024kappa" },
  { teamName: "Team Lambda", password: "wolf2024lambda" },
  { teamName: "Team Mu", password: "wolf2024mu" },
  { teamName: "Team Nu", password: "wolf2024nu" },
  { teamName: "Team Xi", password: "wolf2024xi" },
  { teamName: "Team Omicron", password: "wolf2024omicron" },
  { teamName: "Team Pi", password: "wolf2024pi" },
  { teamName: "Team Rho", password: "wolf2024rho" },
  { teamName: "Team Sigma", password: "wolf2024sigma" },
  { teamName: "Team Tau", password: "wolf2024tau" },
  { teamName: "Team Upsilon", password: "wolf2024upsilon" },
  { teamName: "Team Phi", password: "wolf2024phi" },
  { teamName: "Team Chi", password: "wolf2024chi" },
  { teamName: "Team Psi", password: "wolf2024psi" },
  { teamName: "Team Omega", password: "wolf2024omega" },
  { teamName: "Team Phoenix", password: "wolf2024phoenix" },
  { teamName: "Team Dragon", password: "wolf2024dragon" },
  { teamName: "Team Tiger", password: "wolf2024tiger" },
  { teamName: "Team Eagle", password: "wolf2024eagle" },
  { teamName: "Team Falcon", password: "wolf2024falcon" },
  { teamName: "Team Hawk", password: "wolf2024hawk" },
  { teamName: "Team Lion", password: "wolf2024lion" },
  { teamName: "Team Panther", password: "wolf2024panther" },
  { teamName: "Team Leopard", password: "wolf2024leopard" },
  { teamName: "Team Cheetah", password: "wolf2024cheetah" },
  { teamName: "Team Jaguar", password: "wolf2024jaguar" },
  { teamName: "Team Cobra", password: "wolf2024cobra" },
  { teamName: "Team Viper", password: "wolf2024viper" },
  { teamName: "Team Python", password: "wolf2024python" },
  { teamName: "Team Anaconda", password: "wolf2024anaconda" },
  { teamName: "Team Shark", password: "wolf2024shark" },
  { teamName: "Team Orca", password: "wolf2024orca" },
  { teamName: "Team Dolphin", password: "wolf2024dolphin" },
  { teamName: "Team Whale", password: "wolf2024whale" },
  { teamName: "Team Kraken", password: "wolf2024kraken" },
  { teamName: "Team Titan", password: "wolf2024titan" },
  { teamName: "Team Atlas", password: "wolf2024atlas" },
  { teamName: "Team Zeus", password: "wolf2024zeus" },
  { teamName: "Team Thor", password: "wolf2024thor" },
  { teamName: "Team Odin", password: "wolf2024odin" },
  { teamName: "Team Apex", password: "wolf2024apex" },
  // Additional 10 teams
  { teamName: "Team Blaze", password: "wolf2024blaze" },
  { teamName: "Team Comet", password: "wolf2024comet" },
  { teamName: "Team Nova", password: "wolf2024nova" },
  { teamName: "Team Orion", password: "wolf2024orion" },
  { teamName: "Team Pegasus", password: "wolf2024pegasus" },
  { teamName: "Team Hydra", password: "wolf2024hydra" },
  { teamName: "Team Cyclone", password: "wolf2024cyclone" },
  { teamName: "Team Meteor", password: "wolf2024meteor" },
  { teamName: "Team Nebula", password: "wolf2024nebula" },
  { teamName: "Team Quantum", password: "wolf2024quantum" },
  // Additional 10 teams (batch 2)
  { teamName: "Team Aurora", password: "wolf2024aurora" },
  { teamName: "Team Bolt", password: "wolf2024bolt" },
  { teamName: "Team Cosmos", password: "wolf2024cosmos" },
  { teamName: "Team Eclipse", password: "wolf2024eclipse" },
  { teamName: "Team Galaxy", password: "wolf2024galaxy" },
  { teamName: "Team Horizon", password: "wolf2024horizon" },
  { teamName: "Team Inferno", password: "wolf2024inferno" },
  { teamName: "Team Javelin", password: "wolf2024javelin" },
  { teamName: "Team Kestrel", password: "wolf2024kestrel" },
  { teamName: "Team Lightning", password: "wolf2024lightning" },
  // Additional 10 teams (batch 3)
  { teamName: "Team Matrix", password: "wolf2024matrix" },
  { teamName: "Team Nexus", password: "wolf2024nexus" },
  { teamName: "Team Odyssey", password: "wolf2024odyssey" },
  { teamName: "Team Pulse", password: "wolf2024pulse" },
  { teamName: "Team Quasar", password: "wolf2024quasar" },
  { teamName: "Team Rift", password: "wolf2024rift" },
  { teamName: "Team Solaris", password: "wolf2024solaris" },
  { teamName: "Team Tempest", password: "wolf2024tempest" },
  { teamName: "Team Umbra", password: "wolf2024umbra" },
  { teamName: "Team Vertex", password: "wolf2024vertex" },
];

// Helper function to check if credentials are valid
export const validateTeamCredentials = (teamName, password) => {
  const team = TEAMS.find((t) => t.teamName === teamName);
  if (!team) return { valid: false, message: "Team name not found" };
  if (team.password !== password)
    return { valid: false, message: "Incorrect password" };
  return { valid: true, team };
};

// Helper function to get team by name
export const getTeamByName = (teamName) => {
  return TEAMS.find((t) => t.teamName === teamName);
};

// Helper function to check if team exists
export const teamExists = (teamName) => {
  return TEAMS.some((t) => t.teamName === teamName);
};
