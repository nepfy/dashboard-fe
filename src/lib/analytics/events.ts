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
  project_id: string;
  template_type?: string;
  timestamp?: string;
}

export interface EditorTextEditedProperties {
  project_id: string;
  section_name?: string;
  edit_type?: "text" | "settings" | "content";
  timestamp?: string;
}

export interface EditorSettingsChangedProperties {
  project_id: string;
  setting_type: string;
  setting_value: string | boolean | number;
  timestamp?: string;
}

export interface ProposalPublishedProperties {
  project_id: string;
  template_type?: string;
  timestamp?: string;
}

export interface ProposalSharedProperties {
  project_id: string;
  share_method: "link" | "email" | "whatsapp" | "other";
  timestamp?: string;
}

// Client Interaction Events
export interface ProposalViewedByClientProperties {
  project_id: string;
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

