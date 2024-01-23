import CookieConsent from "../../plugins/gtag/theme/cookieconsent";
export default function Root({children}) {
  const cookieConsentResponse = JSON.parse(
    localStorage.getItem('docusaurus.cookieConsent') ?? 'null',
  );
  return <>
    {children}
    {cookieConsentResponse === null && <CookieConsent />}
  </>;
}