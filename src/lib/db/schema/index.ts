// Core schema exports - simplified after proposal_data unification
import { personUserTable, companyUserTable } from "./users";
import {
  jobTypesTable,
  discoverySourcesTable,
  usedBeforeSourceTable,
} from "./onboarding";
import { plansTable } from "./plans";
import { projectsTable } from "./projects";
import { subscriptionsTable } from "./subscriptions";
import {
  agentsTable,
  agentTemplatesTable,
  serviceTypesTable,
  templateTypesTable,
} from "./agents";

export {
  // Users
  personUserTable,
  companyUserTable,
  // Onboarding
  jobTypesTable,
  discoverySourcesTable,
  usedBeforeSourceTable,
  // Plans & Subscriptions
  plansTable,
  subscriptionsTable,
  // Projects (now with unified proposal_data field)
  projectsTable,
  // Agents
  agentsTable,
  agentTemplatesTable,
  serviceTypesTable,
  templateTypesTable,
};
