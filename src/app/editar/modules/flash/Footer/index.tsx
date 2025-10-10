interface FlashFooterProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  thankYouMessage: string;
  ctaMessage: string;
  disclaimer: string;
  hideDisclaimer: boolean;
  validity: string;
  buttonTitle: string;
}

export default function FlashFooter({
  id,
  projectId,
  hideSection,
  thankYouMessage,
  ctaMessage,
  disclaimer,
  hideDisclaimer,
  validity,
  buttonTitle,
}: FlashFooterProps) {
  return (
    <div>
      {!hideSection && (
        <div>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{thankYouMessage}</h1>
          <h1>{ctaMessage}</h1>
          {!hideDisclaimer && (
            <>
              <h1>{disclaimer}</h1>
            </>
          )}
          <h1>{validity}</h1>
          <h1>{buttonTitle}</h1>
        </div>
      )}
    </div>
  );
}
