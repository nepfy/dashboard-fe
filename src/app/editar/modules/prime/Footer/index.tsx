interface PrimeFooterProps {
  id: string;
  projectId: string;
  thankYouTitle: string;
  thankYouMessage: string;
  disclaimer: string;
  email: string;
  buttonTitle: string;
  validity: Date | string;
  hideThankYouTitle: boolean;
  hideThankYouMessage: boolean;
  hideDisclaimer: boolean;
}

export default function PrimeFooter({
  id,
  projectId,
  thankYouTitle,
  thankYouMessage,
  disclaimer,
  email,
  buttonTitle,
  validity,
  hideThankYouTitle,
  hideThankYouMessage,
  hideDisclaimer,
}: PrimeFooterProps) {
  return (
    <div>
      <>
        <>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          {!hideThankYouTitle && (
            <>
              <h1>{thankYouTitle}</h1>
            </>
          )}
          {!hideThankYouMessage && (
            <>
              <h1>{thankYouMessage}</h1>
            </>
          )}
          {!hideDisclaimer && (
            <>
              <h1>{disclaimer}</h1>
            </>
          )}
          <h1>{email}</h1>
          <h1>{buttonTitle}</h1>
          <h1>{validity.toString()}</h1>
        </>
      </>
    </div>
  );
}
