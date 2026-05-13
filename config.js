window.RSBG_CONFIG = {
  SITE_URL: "https://rsbg.kooheji.dev",
  HISCORES_PROXY_URL: "/proxy.php"
};

if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
  window.RSBG_CONFIG.SITE_URL = window.location.origin;
  window.RSBG_CONFIG.HISCORES_PROXY_URL = "/proxy.php";
}
