// Contexte à joindre à chaque soumission de formulaire pour que HubSpot
// puisse rattacher le lead à la bonne page (au lieu de retomber sur le nom
// générique du site) : cookie de suivi + URL/titre réels de la page.
export function getHubspotContext() {
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return {
    hutk: match ? decodeURIComponent(match[1]) : "",
    pageUri: window.location.href,
    pageName: document.title,
  };
}
