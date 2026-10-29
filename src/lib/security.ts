/**
 * Block cross-site browser mutations without trusting user-controlled data.
 * SameSite cookies are a secondary safeguard; no Origin is permitted for
 * non-browser clients, but requests declaring cross-site context are rejected.
 */
export function sameOriginRequest(request: Request): boolean {
 const site=request.headers.get("sec-fetch-site");
 if(site==="cross-site")return false;
 const origin=request.headers.get("origin");
 if(!origin)return true;
 try {
  const parsed=new URL(origin);
  const current=new URL(request.url);
  return parsed.origin===current.origin;
 }catch{return false;}
}
