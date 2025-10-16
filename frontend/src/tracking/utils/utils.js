const ITEMS_PER_PAGE = 4;
const sectorConstant = {
  heading: "Tracking Sector",
  assigned_to: "sector",
  assigned_to_label: "Sector Name:",
  task_to_assign: "strategic_goal",
  task_to_assign_label: "Strategic Goal:",
};

const divisionConstant = {
  heading: "Tracking Division",
  assigned_to: "division",
  assigned_to_label: "Division Name:",
  task_to_assign: "main_goal",
  task_to_assign_label: "Main Goal:",
};

const statusList = [
  { id: 1, name: "ongoing" },
  { id: 2, name: "active" },
  { id: 3, name: "compeleted" },
  { id: 4, name: "uncompeleted" },
];

const teamConstant = {
  heading: "Tracking Team",
  assigned_to: "team",
  assigned_to_label: "Team Name:",
  task_to_assign: "kpi",
  task_to_assign_label: "Kpi:",
};

export {
  ITEMS_PER_PAGE,
  sectorConstant,
  statusList,
  divisionConstant,
  teamConstant,
};
