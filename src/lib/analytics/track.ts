"use client";

import { getPostHog } from "./posthog";
import type {
  OnboardingStartedProperties,
  OnboardingQuestionAnsweredProperties,
  OnboardingCompletedProperties,
  DashboardViewedProperties,
  DashboardTabClickedProperties,
  ProposalClickedProperties,
  ProposalCreationStartedProperties,
  ProposalAIGenerationRequestedProperties,
  ProposalAIGenerationCompletedProperties,
  ProposalAIFeedbackSubmittedProperties,
  EditorOpenedProperties,
  EditorTextEditedProperties,
  EditorSettingsChangedProperties,
  ProposalPublishedProperties,
  ProposalSharedProperties,
  ProposalViewedByClientProperties,
  ProposalFeedbackReceivedProperties,
  ProposalAcceptedProperties,
  PlanTrialStartedProperties,
  PlanUpgradedProperties,
  PlanLimitReachedProperties,
  PlanCanceledProperties,
} from "./events";

/**
 * Tracking utility functions for PostHog events
 */

// Onboarding Tracking
export function trackOnboardingStarted(
  properties?: OnboardingStartedProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("onboarding_started", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackOnboardingQuestionAnswered(
  properties: OnboardingQuestionAnsweredProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("onboarding_question_answered", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackOnboardingCompleted(
  properties: OnboardingCompletedProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("onboarding_completed", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

// Dashboard Tracking
export function trackDashboardViewed(properties?: DashboardViewedProperties) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("dashboard_viewed", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackDashboardTabClicked(
  properties: DashboardTabClickedProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("dashboard_tab_clicked", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackProposalClicked(properties: ProposalClickedProperties) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("proposal_clicked", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

// Proposal Creation Tracking
export function trackProposalCreationStarted(
  properties?: ProposalCreationStartedProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("proposal_creation_started", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackProposalAIGenerationRequested(
  properties: ProposalAIGenerationRequestedProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("proposal_ai_generation_requested", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackProposalAIGenerationCompleted(
  properties: ProposalAIGenerationCompletedProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("proposal_ai_generation_completed", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackProposalAIFeedbackSubmitted(
  properties: ProposalAIFeedbackSubmittedProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("proposal_ai_feedback_submitted", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

// Editor Tracking
export function trackEditorOpened(properties: EditorOpenedProperties) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("editor_opened", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackEditorTextEdited(properties: EditorTextEditedProperties) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("editor_text_edited", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackEditorSettingsChanged(
  properties: EditorSettingsChangedProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("editor_settings_changed", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackProposalPublished(properties: ProposalPublishedProperties) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("proposal_published", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackProposalShared(properties: ProposalSharedProperties) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("proposal_shared", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

// Client Interaction Tracking
export function trackProposalViewedByClient(
  properties: ProposalViewedByClientProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("proposal_viewed_by_client", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackProposalFeedbackReceived(
  properties: ProposalFeedbackReceivedProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("proposal_feedback_received", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackProposalAccepted(properties: ProposalAcceptedProperties) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("proposal_accepted", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

// Notification Tracking
export function trackNotificationCenterOpened(
  properties?: NotificationCenterOpenedProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("notification_center_opened", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackNotificationClicked(
  properties: NotificationClickedProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("notification_clicked", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackNotificationsMarkedAllRead(
  properties?: NotificationsMarkedAllReadProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("notifications_marked_all_read", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackNotificationDeleted(
  properties: NotificationDeletedProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("notification_deleted", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackNotificationSent(
  properties: NotificationSentProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("notification_sent", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackNotificationEmailSent(
  properties: NotificationEmailSentProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("notification_email_sent", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

// Plan Tracking
export function trackPlanTrialStarted(properties?: PlanTrialStartedProperties) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("plan_trial_started", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackPlanUpgraded(properties: PlanUpgradedProperties) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("plan_upgraded", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackPlanLimitReached(properties: PlanLimitReachedProperties) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("plan_limit_reached", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackPlanCanceled(properties: PlanCanceledProperties) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture("plan_canceled", {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

