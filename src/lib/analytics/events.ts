/**
 * Event type definitions and helper functions for PostHog tracking
 */

// Onboarding Events
export interface OnboardingStartedProperties {
  timestamp?: string;
}

export interface OnboardingQuestionAnsweredProperties {
  question_step: number;
  question_name: string;
  answer: string | string[];
  timestamp?: string;
}

export interface OnboardingCompletedProperties {
  job_type?: string;
  discovery_source?: string;
  used_before?: string;
  application_name?: string;
  application_type?: string;
  completion_time_seconds?: number;
  timestamp?: string;
}

// Dashboard Events
export interface DashboardViewedProperties {
  timestamp?: string;
}

export interface DashboardTabClickedProperties {
  tab_name: "propostas" | "notificacoes" | "metricas";
  timestamp?: string;
}

export interface ProposalClickedProperties {
  proposal_id: string;
  proposal_name?: string;
  proposal_status?: string;
  current_status?: string;
  template_type?: string;
  timestamp?: string;
}

// Proposal Creation Events
export interface ProposalCreationStartedProperties {
  template_type?: string;
  timestamp?: string;
}

export interface ProposalAIGenerationRequestedProperties {
  template_type: string;
  project_name?: string;
  selected_service?: string;
  include_terms?: boolean;
  include_faq?: boolean;
  selected_plans?: number;
  timestamp?: string;
}

export interface ProposalAIGenerationCompletedProperties {
  template_type: string;
  project_id: string;
  project_name?: string;
  generation_time_seconds?: number;
  success: boolean;
  error?: string;
  timestamp?: string;
}

export interface ProposalAIFeedbackSubmittedProperties {
  project_id: string;
  template_type: string;
  rating: number; // 1-5
  feedback_text?: string;
  timestamp?: string;
}

// Editor Events
export interface EditorOpenedProperties {
  proposal_id: string;
  user_id?: string;
  workspace_id?: string;
  template_type?: string;
  timestamp?: string;
}

export interface EditorTextEditedProperties {
  proposal_id: string;
  field?: string;
  chars_count?: number;
  section_name?: string;
  edit_type?: "text" | "settings" | "content";
  timestamp?: string;
}

export interface EditorSettingsChangedProperties {
  proposal_id: string;
  setting_name: string;
  new_value: string | boolean | number;
  setting_type?: string;
  timestamp?: string;
}

export interface BlockAddedProperties {
  proposal_id: string;
  block_type: string;
  timestamp?: string;
}

export interface ProposalSavedProperties {
  proposal_id: string;
  auto_or_manual: "auto" | "manual";
  timestamp?: string;
}

export interface ProposalPublishedProperties {
  proposal_id: string;
  publish_method?: string;
  template_type?: string;
  timestamp?: string;
}

export interface ProposalSharedProperties {
  proposal_id: string;
  share_method: "link" | "email" | "whatsapp" | "other";
  timestamp?: string;
}

// Client Interaction Events
export interface ProposalViewedByClientProperties {
  proposal_id: string;
  viewer_session_id?: string;
  project_url?: string;
  timestamp?: string;
}

export interface ProposalFeedbackReceivedProperties {
  project_id: string;
  feedback_type: "adjustment_request" | "question" | "other";
  feedback_text?: string;
  timestamp?: string;
}

export interface ProposalAcceptedProperties {
  project_id: string;
  time_to_acceptance_seconds?: number;
  timestamp?: string;
}

// Notification Events
export interface NotificationCenterOpenedProperties {
  unread_count?: number;
  timestamp?: string;
}

export interface NotificationClickedProperties {
  notification_id: string;
  notification_type?: string;
  timestamp?: string;
}

export interface NotificationsMarkedAllReadProperties {
  count?: number;
  timestamp?: string;
}

export interface NotificationDeletedProperties {
  notification_id: string;
  notification_type?: string;
  timestamp?: string;
}

export interface NotificationSentProperties {
  notification_id: string;
  notification_type: string;
  user_id: string;
  via_email?: boolean;
  timestamp?: string;
}

export interface NotificationEmailSentProperties {
  notification_id: string;
  notification_type: string;
  user_id: string;
  email_address: string;
  timestamp?: string;
}

// Plan Events
export interface PlanTrialStartedProperties {
  plan_id?: string;
  plan_name?: string;
  timestamp?: string;
}

export interface PlanUpgradedProperties {
  from_plan?: string;
  to_plan: string;
  plan_id: string;
  billing_cycle?: "monthly" | "yearly";
  timestamp?: string;
}

export interface PlanLimitReachedProperties {
  plan_type: string;
  limit_type: "proposals" | "storage" | "features";
  current_usage?: number;
  limit?: number;
  timestamp?: string;
}

export interface PlanCanceledProperties {
  plan_type: string;
  cancellation_reason?: string;
  timestamp?: string;
}

export interface UpgradeModalOpenedProperties {
  source: string;
  timestamp?: string;
}

export interface UpgradeSuccessProperties {
  plan_id: string;
  value?: number;
  plan_name?: string;
  billing_cycle?: "monthly" | "yearly";
  timestamp?: string;
}

export interface ErrorTriggeredProperties {
  error_type: string;
  user_id?: string;
  device_info?: string;
  error_message?: string;
  error_stack?: string;
  timestamp?: string;
}

export interface EditorLoadTimeProperties {
  duration_ms: number;
  proposal_id: string;
  timestamp?: string;
}

export interface AppLoadTimeProperties {
  duration_ms: number;
  route: string;
  timestamp?: string;
}

export interface UserRetentionD7Properties {
  user_id: string;
  signup_date?: string;
  last_active_day?: string;
  timestamp?: string;
}

export interface FunnelMainCompletedProperties {
  user_id: string;
  proposal_id: string;
  timestamp?: string;
}

export interface FunnelMainAbandonedProperties {
  step: string;
  user_id: string;
  proposal_id?: string;
  timestamp?: string;
}

export interface UserSessionStartedProperties {
  user_id: string;
  session_id?: string;
  timestamp?: string;
}

export interface UserSegmentIdentifiedProperties {
  segment: string;
  user_id?: string;
  timestamp?: string;
}

export interface UserEnvironmentDetectedProperties {
  os?: string;
  browser?: string;
  device_type?: string;
  user_id?: string;
  timestamp?: string;
}

export interface AIFunnelCompletedProperties {
  user_id: string;
  proposal_id: string;
  timestamp?: string;
}

export interface AIFunnelAbandonedProperties {
  step: string;
  user_id: string;
  proposal_id?: string;
  timestamp?: string;
}

export interface EditorFunnelCompletedProperties {
  user_id: string;
  proposal_id: string;
  timestamp?: string;
}

export interface EditorSessionStartedProperties {
  session_id: string;
  user_id: string;
  proposal_id: string;
  timestamp?: string;
}

export interface EditorSessionEndedProperties {
  session_id: string;
  duration_ms: number;
  timestamp?: string;
}

export interface ManagerActionTriggeredProperties {
  action_type: string;
  proposal_id?: string;
  user_id?: string;
  timestamp?: string;
}

