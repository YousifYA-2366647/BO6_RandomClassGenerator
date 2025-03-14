// returns the given cookie from a request.
export function getCookies(req, cookieName) {
    const cookies = req.headers.cookie;
    if (!cookies) return "";
  
    const cookieArray = cookies.split("; ");
    for (let cookie of cookieArray) {
      const [key, value] = cookie.split("=");
      if (key === cookieName) {
        return decodeURIComponent(value);
      }
    }
    return "";
}